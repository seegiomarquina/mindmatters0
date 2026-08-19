from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Signature Schemas
class SignatureTraits(BaseModel):
    confidence: int = Field(..., description="Confidence score (0-100)")
    consistency: int = Field(..., description="Pattern consistency score (0-100)")
    pressure_level: str = Field(..., description="Stroke pressure: low, medium, or high")
    slant: str = Field(..., description="Signature slant: left, upright, or right")
    stress_indicator: int = Field(..., description="Stress indicator (0-100)")

class SignatureAnalysisResponse(BaseModel):
    traits: SignatureTraits
    confidence_score: float = Field(..., description="Model confidence in traits (0.0 to 1.0)")

# Typing Schemas
class KeystrokeItem(BaseModel):
    key: str
    keydown: float
    keyup: float

class TypingAnalysisRequest(BaseModel):
    keystrokes: List[KeystrokeItem]

class TypingAnalysisResponse(BaseModel):
    avg_dwell_time_ms: float
    avg_flight_time_ms: float
    backspace_rate: float
    typing_speed_wpm: float
    stress_score: int
    focus_score: int

# Handwriting Schemas
class HandwritingTraits(BaseModel):
    letter_size: str = Field(..., description="Letter size: small, medium, or large")
    line_spacing: str = Field(..., description="Line spacing: tight, medium, or wide")
    word_spacing: str = Field(..., description="Word spacing: narrow, medium, or wide")
    slant: str = Field(..., description="Handwriting slant: left, upright, or right")
    formation_consistency: int = Field(..., description="Formation consistency score (0-100)")
    pressure_estimate: str = Field(..., description="Pen pressure: light, medium, or firm")

class HandwritingAnalysisResponse(BaseModel):
    traits: HandwritingTraits
    dominant_pattern: str
    confidence_score: float

# Report Schemas
class ReportGenerateRequest(BaseModel):
    user_name: Optional[str] = "Anonymous"
    signature_result: Optional[SignatureAnalysisResponse] = None
    typing_result: Optional[TypingAnalysisResponse] = None
    handwriting_result: Optional[HandwritingAnalysisResponse] = None

class ReportGenerateResponse(BaseModel):
    report_id: str
    mind_score: int
    download_url: str

class HealthResponse(BaseModel):
    status: str
