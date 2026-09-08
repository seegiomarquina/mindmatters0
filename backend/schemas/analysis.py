from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnalysisHistoryItem(BaseModel):
    id: str
    sample_id: Optional[str]
    sample_type: str
    status: str
    confidence_score: Optional[float]
    dominant_pattern: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class AnalysisListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    analyses: List[AnalysisHistoryItem]

class AnalysisDetailResponse(BaseModel):
    id: str
    sample_id: Optional[str]
    sample_type: str
    status: str
    model_version: str
    confidence_score: Optional[float]
    dominant_pattern: Optional[str]
    traits: Optional[Dict[str, Any]] = None
    measurable_features: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime]
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
