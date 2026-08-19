from fastapi import APIRouter, UploadFile, File, HTTPException, status
from schemas.schemas import HandwritingAnalysisResponse
from models.handwriting_model import handwriting_analyzer
from utils.preprocessing import load_image_from_bytes

router = APIRouter(prefix="/analyze", tags=["Handwriting"])

@router.post("/handwriting", response_model=HandwritingAnalysisResponse)
async def analyze_handwriting(file: UploadFile = File(...)):
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image of regular handwriting"
        )
        
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty handwriting image file received"
            )
            
        img = load_image_from_bytes(contents)
        result = handwriting_analyzer.analyze(img)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Handwriting morphology engine error: {str(e)}"
        )
