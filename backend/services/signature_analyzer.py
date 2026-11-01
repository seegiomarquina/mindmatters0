import json
import cv2
import numpy as np
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from schemas.signature import (
    SignatureAnalysisResponse, SignatureTraits, SignatureMeasurableFeatures
)
from services.image_processor import preprocess_handwriting_pipeline
from db.models import Sample, Analysis, ExtractedFeatures

class SignatureAnalyzer:
    """
    Signature Geometry & Biometric Stroke Engine.
    
    Extracts geometric, directional, and stroke-width features from signature scans:
    - Optical Stroke Width & Variance: Euclidean distance transform L2 metric on binarized strokes
    - Directional Slant: Ellipse orientation via second-order central moments
    - Baseline Jitter: Standard deviation of vertical centroid coordinates across active strokes
    - Aspect Ratio: Envelope width-to-height ratio (w / h)
    - Consistency: Composite inverse-variance metric derived from stroke regularity and baseline stability
    - Fluidity / Stroke Stability Index: Heuristic estimate of motor continuity (not psychological self-worth)

    SCIENTIFIC NOTE:
    Evaluates stroke geometry and motor stability computationally. Does not assert physical pen force.
    """
    def analyze(
        self,
        img: np.ndarray,
        sample_record: Optional[Sample] = None,
        user_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> SignatureAnalysisResponse:
        prep = preprocess_handwriting_pipeline(img)
        thresh = prep.binary_thresh

        # 1. Distance transform for stroke width & optical pressure proxy
        dist_transform = cv2.distanceTransform(thresh, cv2.DIST_L2, 5)
        stroke_pixels = dist_transform[thresh > 0]

        if len(stroke_pixels) > 0:
            avg_stroke_width = float(np.mean(stroke_pixels) * 2.0)
            stroke_variance = float(np.std(stroke_pixels))
        else:
            avg_stroke_width = 3.0
            stroke_variance = 1.0

        if avg_stroke_width > 4.2:
            pressure_level = "high"
        elif avg_stroke_width < 2.2:
            pressure_level = "low"
        else:
            pressure_level = "medium"

        # 2. Slant angles
        angles = []
        for c in prep.contours:
            if cv2.contourArea(c) > 30 and len(c) >= 5:
                (x, y), (MA, ma), angle = cv2.fitEllipse(c)
                if angle > 90:
                    angle = angle - 180
                angles.append(angle)

        median_angle = float(np.median(angles)) if angles else 0.0
        if median_angle > 12.0:
            slant = "right"
        elif median_angle < -12.0:
            slant = "left"
        else:
            slant = "upright"

        # 3. Consistency and Baseline Stability
        valid_contours = [c for c in prep.contours if cv2.contourArea(c) > 20]
        if len(valid_contours) > 1:
            centroids_y = []
            for c in valid_contours:
                m = cv2.moments(c)
                if m['m00'] > 0:
                    centroids_y.append(m['m01'] / m['m00'])
            baseline_jitter = float(np.std(centroids_y)) if len(centroids_y) > 1 else 8.0
            consistency = int(np.clip(100 - (baseline_jitter * 1.8 + stroke_variance * 8.0), 35, 95))
        else:
            baseline_jitter = 8.0
            consistency = 68

        # 4. Motor Fluidity & Kinetic Indicators
        pressure_factor = 75 if pressure_level == "medium" else (85 if pressure_level == "high" else 60)
        confidence = int(np.clip((pressure_factor * 0.4) + (consistency * 0.4) + (20 if slant != "left" else 5), 40, 95))

        tremor_score = stroke_variance * 20.0 + (abs(median_angle) * 0.6)
        stress_indicator = int(np.clip(tremor_score + (100 - consistency) * 0.4, 15, 88))

        # Aspect ratio
        coords = np.column_stack(np.where(thresh > 0))
        if len(coords) > 10:
            y_min, x_min = np.min(coords, axis=0)
            y_max, x_max = np.max(coords, axis=0)
            h = max(1, y_max - y_min)
            w = max(1, x_max - x_min)
            aspect_ratio = round(float(w / h), 2)
        else:
            aspect_ratio = 2.5

        confidence_score = round(float(np.clip(0.82 + (len(prep.contours) * 0.005), 0.78, 0.94)), 2)

        measurable = SignatureMeasurableFeatures(
            stroke_width_px=round(avg_stroke_width, 2),
            stroke_variance=round(stroke_variance, 2),
            median_angle_deg=round(median_angle, 2),
            baseline_jitter=round(baseline_jitter, 2),
            contour_count=len(prep.contours),
            aspect_ratio=aspect_ratio
        )

        traits = SignatureTraits(
            confidence=confidence,
            consistency=consistency,
            pressure_level=pressure_level,
            slant=slant,
            stress_indicator=stress_indicator
        )

        analysis_id = None
        sample_id = sample_record.id if sample_record else None

        if db:
            analysis_obj = Analysis(
                sample_id=sample_id,
                user_id=user_id,
                sample_type="signature",
                status="completed",
                model_version="2.0.0",
                confidence_score=confidence_score,
                dominant_pattern=f"{slant} slant, {pressure_level} pressure",
                traits_json=json.dumps(traits.model_dump())
            )
            db.add(analysis_obj)
            db.flush()
            analysis_id = analysis_obj.id

            features_obj = ExtractedFeatures(
                analysis_id=analysis_id,
                slant_angle=measurable.median_angle_deg,
                baseline_jitter=measurable.baseline_jitter,
                pressure_proxy=measurable.stroke_width_px,
                regularity_score=float(traits.consistency),
                raw_metrics_json=json.dumps(measurable.model_dump())
            )
            db.add(features_obj)
            db.commit()
            db.refresh(analysis_obj)

        return SignatureAnalysisResponse(
            analysis_id=analysis_id,
            sample_id=sample_id,
            traits=traits,
            measurable_features=measurable,
            confidence_score=confidence_score
        )

signature_analyzer = SignatureAnalyzer()
