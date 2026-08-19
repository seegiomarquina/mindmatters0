from fastapi import APIRouter, UploadFile, File, HTTPException, status
from schemas.schemas import SignatureAnalysisResponse
from models.signature_model import signature_analyzer
from utils.preprocessing import load_image_from_bytes

router = APIRouter(prefix="/analyze", tags=["Signature"])

@router.post("/signature", response_model=SignatureAnalysisResponse)
async def analyze_signature(file: UploadFile = File(...)):
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image (PNG, JPEG, etc.)"
        )
    
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty image file received"
            )
            
        img = load_image_from_bytes(contents)
        result = signature_analyzer.analyze(img)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signature analysis engine error: {str(e)}"
        )
