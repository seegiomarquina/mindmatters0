import cv2
import numpy as np
from typing import Dict, Any
from schemas.schemas import SignatureAnalysisResponse, SignatureTraits
from utils.preprocessing import preprocess_document_image

class SignatureAnalyzer:
    def __init__(self):
        pass

    def analyze(self, image: np.ndarray) -> SignatureAnalysisResponse:
        gray, thresh = preprocess_document_image(image)
        
        # 1. Stroke width & pressure estimation via distance transform
        dist_transform = cv2.distanceTransform(thresh, cv2.DIST_L2, 5)
        stroke_pixels = dist_transform[thresh > 0]
        
        if len(stroke_pixels) > 0:
            avg_stroke_width = float(np.mean(stroke_pixels) * 2.0)
            stroke_variance = float(np.std(stroke_pixels))
        else:
            avg_stroke_width = 3.0
            stroke_variance = 1.0
            
        if avg_stroke_width > 4.5:
            pressure_level = "high"
        elif avg_stroke_width < 2.2:
            pressure_level = "low"
        else:
            pressure_level = "medium"

        # 2. Slant angle analysis using moments of connected components
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        angles = []
        for c in contours:
            if cv2.contourArea(c) > 30 and len(c) >= 5:
                (x, y), (MA, ma), angle = cv2.fitEllipse(c)
                # Normalize angle
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
        if len(contours) > 2:
            centroids_y = [cv2.moments(c)['m01'] / (cv2.moments(c)['m00'] + 1e-5) for c in contours if cv2.contourArea(c) > 20]
            baseline_jitter = float(np.std(centroids_y)) if len(centroids_y) > 1 else 10.0
            consistency = int(np.clip(100 - (baseline_jitter * 1.8 + stroke_variance * 8.0), 35, 95))
        else:
            consistency = 68

        # 4. Confidence & Stress Indicators
        # Firm strokes with controlled variance -> high confidence
        pressure_factor = 75 if pressure_level == "medium" else (85 if pressure_level == "high" else 60)
        confidence = int(np.clip((pressure_factor * 0.4) + (consistency * 0.4) + (20 if slant != "left" else 5), 40, 95))
        
        # Micro-tremor / High stroke variance / extreme slant -> stress
        tremor_score = stroke_variance * 20.0 + (abs(median_angle) * 0.6)
        stress_indicator = int(np.clip(tremor_score + (100 - consistency) * 0.4, 15, 88))
        
        # Model confidence score in feature extraction
        confidence_score = round(float(np.clip(0.82 + (len(contours) * 0.005), 0.78, 0.94)), 2)

        return SignatureAnalysisResponse(
            traits=SignatureTraits(
                confidence=confidence,
                consistency=consistency,
                pressure_level=pressure_level,
                slant=slant,
                stress_indicator=stress_indicator
            ),
            confidence_score=confidence_score
        )

signature_analyzer = SignatureAnalyzer()
