from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class SignatureMeasurableFeatures(BaseModel):
    stroke_width_px: float = Field(..., description="Estimated mean stroke width in pixels")
    stroke_variance: float = Field(..., description="Standard deviation of stroke width across pixels")
    median_angle_deg: float = Field(..., description="Median slant angle of signature in degrees")
    baseline_jitter: float = Field(..., description="Vertical variance of stroke centroids")
    contour_count: int = Field(..., description="Total contours detected")
    aspect_ratio: float = Field(..., description="Bounding box aspect ratio width / height")

class SignatureTraits(BaseModel):
    confidence: int = Field(..., description="Confidence score (0-100)")
    consistency: int = Field(..., description="Pattern consistency score (0-100)")
    pressure_level: str = Field(..., description="Stroke pressure: low, medium, or high")
    slant: str = Field(..., description="Signature slant: left, upright, or right")
    stress_indicator: int = Field(..., description="Stress indicator (0-100)")

class SignatureAnalysisResponse(BaseModel):
    analysis_id: Optional[str] = None
    sample_id: Optional[str] = None
    traits: SignatureTraits
    measurable_features: Optional[SignatureMeasurableFeatures] = None
    confidence_score: float = Field(..., description="Model confidence in feature extraction (0.0 to 1.0)")
    disclaimer: str = "Biometric signal extraction for behavioral profiling and self-discovery."
