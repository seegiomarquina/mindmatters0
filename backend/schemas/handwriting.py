from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class MeasurableFeatures(BaseModel):
    slant_angle_deg: float = Field(..., description="Median stroke slant angle in degrees (-90 to +90)")
    ink_density: float = Field(..., description="Foreground ink pixel ratio relative to bounding area (0.0 to 1.0)")
    writing_area_ratio: float = Field(..., description="Ratio of active handwriting bounding box to total page canvas (0.0 to 1.0)")
    component_count: int = Field(..., description="Number of identified distinct connected components/strokes")
    avg_char_height_px: float = Field(..., description="Average connected component height in pixels")
    avg_char_width_px: float = Field(..., description="Average connected component width in pixels")
    avg_word_gap_px: float = Field(..., description="Estimated horizontal spacing/gap between word clusters in pixels")
    avg_line_spacing_px: float = Field(..., description="Estimated vertical distance between text lines in pixels")
    baseline_slope_deg: float = Field(..., description="Linear regression baseline angle across the page in degrees")
    baseline_jitter: float = Field(..., description="Standard deviation / jitter along the baseline")
    contour_complexity: float = Field(..., description="Mean isoperimetric quotient of stroke contours (perimeter^2 / area)")
    pressure_proxy: float = Field(..., description="Stroke thickness & pixel intensity proxy derived from distance transform")
    regularity_score: float = Field(..., description="Consistency index based on standard deviations across dimensions (0-100)")

class HandwritingTraits(BaseModel):
    letter_size: str = Field(..., description="Letter size classification: small, medium, or large")
    line_spacing: str = Field(..., description="Line spacing: tight, medium, or wide")
    word_spacing: str = Field(..., description="Word spacing: narrow, medium, or wide")
    slant: str = Field(..., description="Handwriting slant: left, upright, or right")
    formation_consistency: int = Field(..., description="Formation consistency score (0-100)")
    pressure_estimate: str = Field(..., description="Pen pressure estimate: light, medium, or firm")

class HandwritingAnalysisResponse(BaseModel):
    analysis_id: Optional[str] = Field(None, description="Unique analysis record ID")
    sample_id: Optional[str] = Field(None, description="Unique sample storage ID")
    traits: HandwritingTraits
    measurable_features: Optional[MeasurableFeatures] = None
    dominant_pattern: str
    confidence_score: float
    disclaimer: str = "Observable computer-vision metrics for research and behavioral insight; not clinical diagnosis."
