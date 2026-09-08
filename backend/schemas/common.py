from pydantic import BaseModel, Field
from typing import Optional, Any

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "2.0.0"
    engine: str = "MindMatters AI Real Computer-Vision Engine"
    database: str = "connected"

class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
    success: bool = True
