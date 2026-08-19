import os
import uuid
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from schemas.schemas import ReportGenerateRequest, ReportGenerateResponse
from models.mind_score import calculate_mind_score
from utils.pdf_generator import generate_pdf_report
from database.db import save_report, get_report

router = APIRouter(prefix="/report", tags=["Report"])

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "reports")

@router.post("/generate", response_model=ReportGenerateResponse)
async def generate_report(payload: ReportGenerateRequest):
    try:
        report_id = f"mm_{uuid.uuid4().hex[:6].upper()}"
        mind_score = calculate_mind_score(
            signature_res=payload.signature_result,
            typing_res=payload.typing_result,
            handwriting_res=payload.handwriting_result
        )

        sig_dict = payload.signature_result.model_dump() if payload.signature_result else None
        typ_dict = payload.typing_result.model_dump() if payload.typing_result else None
        hw_dict = payload.handwriting_result.model_dump() if payload.handwriting_result else None

        pdf_path = generate_pdf_report(
            report_id=report_id,
            user_name=payload.user_name or "Anonymous",
            mind_score=mind_score,
            signature_data=sig_dict,
            typing_data=typ_dict,
            handwriting_data=hw_dict,
            output_dir=REPORTS_DIR
        )

        save_report(
            report_id=report_id,
            user_name=payload.user_name or "Anonymous",
            mind_score=mind_score,
            traits={
                "signature": sig_dict,
                "typing": typ_dict,
                "handwriting": hw_dict
            },
            pdf_path=pdf_path
        )

        return ReportGenerateResponse(
            report_id=report_id,
            mind_score=mind_score,
            download_url=f"/report/download/{report_id}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile report: {str(e)}"
        )

@router.get("/download/{report_id}")
async def download_report(report_id: str):
    record = get_report(report_id)
    pdf_path = os.path.join(REPORTS_DIR, f"{report_id}.pdf")
    
    if not os.path.exists(pdf_path):
        if record and record.get("pdf_path") and os.path.exists(record["pdf_path"]):
            pdf_path = record["pdf_path"]
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report with ID '{report_id}' not found."
            )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"MindMatters_Report_{report_id}.pdf"
    )
