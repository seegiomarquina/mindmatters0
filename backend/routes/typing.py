from fastapi import APIRouter, HTTPException, status
from schemas.schemas import TypingAnalysisRequest, TypingAnalysisResponse
from models.typing_model import typing_analyzer

router = APIRouter(prefix="/analyze", tags=["Typing"])

@router.post("/typing", response_model=TypingAnalysisResponse)
async def analyze_typing(payload: TypingAnalysisRequest):
    if not payload.keystrokes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Keystroke sequence is empty. At least 2 keystrokes are required."
        )
    
    try:
        result = typing_analyzer.analyze(payload.keystrokes)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Typing rhythm analysis engine error: {str(e)}"
        )
