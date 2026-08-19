import cv2
import numpy as np
from schemas.schemas import HandwritingAnalysisResponse, HandwritingTraits
from utils.preprocessing import preprocess_document_image

class HandwritingAnalyzer:
    def __init__(self):
        pass

    def analyze(self, image: np.ndarray) -> HandwritingAnalysisResponse:
        gray, thresh = preprocess_document_image(image)
        
        # 1. Connected components & letter size distribution
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh, connectivity=8)
        
        # Filter small noise / huge page border blobs
        h_page, w_page = thresh.shape[:2]
        min_area = 15
        max_area = (h_page * w_page) * 0.15
        
        valid_stats = [s for s in stats[1:] if min_area < s[cv2.CC_STAT_AREA] < max_area]
        
        if valid_stats:
            heights = [s[cv2.CC_STAT_HEIGHT] for s in valid_stats]
            widths = [s[cv2.CC_STAT_WIDTH] for s in valid_stats]
            avg_height = float(np.mean(heights))
            height_std = float(np.std(heights))
            avg_width = float(np.mean(widths))
        else:
            avg_height = 24.0
            height_std = 6.0
            avg_width = 18.0

        if avg_height < 18.0:
            letter_size = "small"
        elif avg_height > 38.0:
            letter_size = "large"
        else:
            letter_size = "medium"

        # 2. Line spacing via horizontal projection profile
        horizontal_proj = np.sum(thresh, axis=1)
        line_valleys = []
        in_gap = True
        gap_count = 0
        for val in horizontal_proj:
            if val < 50:
                gap_count += 1
            else:
                if gap_count > 5:
                    line_valleys.append(gap_count)
                gap_count = 0
        avg_line_gap = float(np.mean(line_valleys)) if line_valleys else 15.0
        
        if avg_line_gap < 12.0:
            line_spacing = "tight"
        elif avg_line_gap > 30.0:
            line_spacing = "wide"
        else:
            line_spacing = "medium"

        # 3. Word spacing via horizontal gaps between valid components
        valid_boxes = sorted(
            [s for s in valid_stats if s[cv2.CC_STAT_AREA] > 30],
            key=lambda b: (b[cv2.CC_STAT_TOP] // int(avg_height * 1.5), b[cv2.CC_STAT_LEFT])
        )
        horizontal_gaps = []
        for i in range(len(valid_boxes) - 1):
            curr_b = valid_boxes[i]
            next_b = valid_boxes[i + 1]
            # Same approximate line
            if abs(curr_b[cv2.CC_STAT_TOP] - next_b[cv2.CC_STAT_TOP]) < avg_height * 0.8:
                gap = next_b[cv2.CC_STAT_LEFT] - (curr_b[cv2.CC_STAT_LEFT] + curr_b[cv2.CC_STAT_WIDTH])
                if 2 < gap < avg_width * 5:
                    horizontal_gaps.append(gap)
                    
        avg_word_gap = float(np.mean(horizontal_gaps)) if horizontal_gaps else 16.0
        if avg_word_gap < avg_width * 0.7:
            word_spacing = "narrow"
        elif avg_word_gap > avg_width * 1.8:
            word_spacing = "wide"
        else:
            word_spacing = "medium"

        # 4. Slant detection via line contour angles
        contours, _ = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        slant_angles = []
        for c in contours:
            if len(c) >= 5 and cv2.contourArea(c) > 40:
                (x, y), (MA, ma), angle = cv2.fitEllipse(c)
                if angle > 90:
                    angle = angle - 180
                slant_angles.append(angle)
        median_slant = float(np.median(slant_angles)) if slant_angles else 0.0
        if median_slant > 10.0:
            slant = "right"
        elif median_slant < -10.0:
            slant = "left"
        else:
            slant = "upright"

        # 5. Formation consistency & pressure estimate
        consistency_raw = max(30, int(100 - (height_std / (avg_height + 1e-4) * 90)))
        formation_consistency = int(np.clip(consistency_raw, 45, 96))
        
        stroke_dist = cv2.distanceTransform(thresh, cv2.DIST_L2, 3)
        mean_thickness = float(np.mean(stroke_dist[thresh > 0])) if np.sum(thresh > 0) > 0 else 2.0
        if mean_thickness > 3.2:
            pressure_estimate = "firm"
        elif mean_thickness < 1.8:
            pressure_estimate = "light"
        else:
            pressure_estimate = "medium"

        # 6. Dominant pattern classification
        if letter_size == "small" and word_spacing == "narrow":
            dominant_pattern = "tense/compressed writing"
        elif formation_consistency > 75 and line_spacing in ["medium", "wide"]:
            dominant_pattern = "structured & methodical"
        elif slant == "right" and letter_size in ["medium", "large"]:
            dominant_pattern = "expressive & communicative"
        elif letter_size == "small" and word_spacing == "wide":
            dominant_pattern = "analytical & introspective"
        else:
            dominant_pattern = "fluid & adaptable"

        confidence_score = round(float(np.clip(0.80 + (len(valid_stats) * 0.001), 0.78, 0.93)), 2)

        return HandwritingAnalysisResponse(
            traits=HandwritingTraits(
                letter_size=letter_size,
                line_spacing=line_spacing,
                word_spacing=word_spacing,
                slant=slant,
                formation_consistency=formation_consistency,
                pressure_estimate=pressure_estimate
            ),
            dominant_pattern=dominant_pattern,
            confidence_score=confidence_score
        )

handwriting_analyzer = HandwritingAnalyzer()
