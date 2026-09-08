from typing import Optional
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.handwriting import HandwritingAnalysisResponse
from services.image_processor import validate_and_save_upload, decode_image_from_path
from services.handwriting_analyzer import handwriting_analyzer
from services.auth_service import get_current_user_optional
from db.database import get_db
from db.models import User, Sample

router = APIRouter(tags=["Handwriting Analysis"])

@router.post("/handwriting/analyze", response_model=HandwritingAnalysisResponse)
@router.post("/analyze/handwriting", response_model=HandwritingAnalysisResponse)
async def analyze_handwriting(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Real Handwriting Analysis Endpoint:
    1. Validates MIME type and file size
    2. Stores upload safely to server storage with UUID
    3. Executes OpenCV preprocessing (grayscale, denoising, CLAHE, Otsu threshold, deskew)
    4. Extracts 10+ measurable biometric features
    5. Persists Sample, Analysis, and ExtractedFeatures to database
    6. Returns structured JSON analysis
    """
    user_id = current_user.id if current_user else None

    # Step 1 & 2: Validate and persist file to disk
    stored_filename, file_path, file_size, mime_type = validate_and_save_upload(
        file=file,
        sample_type="handwriting"
    )

    # Step 3: Create Sample DB Record
    sample = Sample(
        user_id=user_id,
        filename=file.filename or stored_filename,
        stored_filename=stored_filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=mime_type,
        sample_type="handwriting"
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)

    # Step 4: Decode and run analysis pipeline
    try:
        img = decode_image_from_path(file_path)
        result = handwriting_analyzer.analyze_and_persist(
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
            detail=f"Handwriting morphology engine error: {str(e)}"
        )
