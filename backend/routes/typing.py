from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.typing import TypingAnalysisRequest, TypingAnalysisResponse
from services.typing_analyzer import typing_analyzer
from services.auth_service import get_current_user_optional
from db.database import get_db
from db.models import User

router = APIRouter(tags=["Typing Dynamics"])

@router.post("/typing/analyze", response_model=TypingAnalysisResponse)
@router.post("/analyze/typing", response_model=TypingAnalysisResponse)
async def analyze_typing(
    payload: TypingAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not payload.keystrokes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Keystroke sequence is empty. At least 2 keystrokes are required."
        )

    user_id = current_user.id if current_user else None

    try:
        result = typing_analyzer.analyze(
            keystrokes=payload.keystrokes,
            user_id=user_id,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Typing rhythm analysis engine error: {str(e)}"
        )
