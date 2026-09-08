from typing import Optional
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.signature import SignatureAnalysisResponse
from services.image_processor import validate_and_save_upload, decode_image_from_path
from services.signature_analyzer import signature_analyzer
from services.auth_service import get_current_user_optional
from db.database import get_db
from db.models import User, Sample

router = APIRouter(tags=["Signature Analysis"])

@router.post("/signature/analyze", response_model=SignatureAnalysisResponse)
@router.post("/analyze/signature", response_model=SignatureAnalysisResponse)
async def analyze_signature(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None

    stored_filename, file_path, file_size, mime_type = validate_and_save_upload(
        file=file,
        sample_type="signature"
    )

    sample = Sample(
        user_id=user_id,
        filename=file.filename or stored_filename,
        stored_filename=stored_filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=mime_type,
        sample_type="signature"
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)

    try:
        img = decode_image_from_path(file_path)
        result = signature_analyzer.analyze(
            img=img,
            sample_record=sample,
            user_id=user_id,
            db=db
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signature analysis engine error: {str(e)}"
        )
