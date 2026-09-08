from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Union
from datetime import datetime
from schemas.signature import SignatureAnalysisResponse
from schemas.typing import TypingAnalysisResponse
from schemas.handwriting import HandwritingAnalysisResponse

class ReportGenerateRequest(BaseModel):
    user_name: Optional[str] = "Anonymous"
    signature_result: Optional[Union[SignatureAnalysisResponse, Dict[str, Any]]] = None
    typing_result: Optional[Union[TypingAnalysisResponse, Dict[str, Any]]] = None
    handwriting_result: Optional[Union[HandwritingAnalysisResponse, Dict[str, Any]]] = None
    analysis_id: Optional[str] = None
    psychometrics: Optional[Dict[str, Any]] = None

class ReportGenerateResponse(BaseModel):
    report_id: str
    mind_score: int
    dominant_archetype: Optional[str] = None
    executive_summary: Optional[str] = None
    download_url: str

class ReportDetailResponse(BaseModel):
    id: str
    user_name: str
    mind_score: int
    dominant_archetype: Optional[str]
    executive_summary: Optional[str]
    cognitive_indices: Optional[Dict[str, Any]]
    traits: Optional[Dict[str, Any]]
    pdf_filename: Optional[str]
    download_url: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
