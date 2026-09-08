from pydantic import BaseModel, Field
from typing import List, Optional

class KeystrokeItem(BaseModel):
    key: str
    keydown: float
    keyup: float

class TypingAnalysisRequest(BaseModel):
    keystrokes: List[KeystrokeItem]
    typed_text: Optional[str] = None
    total_time_seconds: Optional[float] = None
    backspace_count: Optional[int] = None

class TypingMeasurableFeatures(BaseModel):
    total_keystrokes: int
    dwell_time_std_ms: float
    flight_time_std_ms: float
    cadence_entropy: float
    hesitation_count: int

class TypingAnalysisResponse(BaseModel):
    analysis_id: Optional[str] = None
    avg_dwell_time_ms: float
    avg_flight_time_ms: float
    backspace_rate: float
    typing_speed_wpm: float
    stress_score: int
    focus_score: int
    measurable_features: Optional[TypingMeasurableFeatures] = None
