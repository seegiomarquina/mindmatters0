import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from schemas.report import ReportGenerateRequest, ReportGenerateResponse
from services.report_service import report_service
from services.auth_service import get_current_user_optional
from core.config import settings
from db.database import get_db
from db.models import Report, User

router = APIRouter(tags=["Reports & Dossiers"])

@router.post("/reports/generate", response_model=ReportGenerateResponse)
@router.post("/report/generate", response_model=ReportGenerateResponse)
async def generate_report(
    payload: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    try:
        result = report_service.create_report(
            payload=payload,
            user_id=user_id,
            db=db
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile report: {str(e)}"
        )

@router.get("/reports/download/{report_id}")
@router.get("/report/download/{report_id}")
async def download_report_pdf(
    report_id: str,
    db: Session = Depends(get_db)
):
    pdf_filename = f"{report_id}.pdf" if not report_id.endswith(".pdf") else report_id
    pdf_path = os.path.join(settings.REPORTS_DIR, pdf_filename)

    if not os.path.exists(pdf_path):
        # Look in database
        report = db.query(Report).filter(Report.id == report_id).first()
        if report and report.pdf_path and os.path.exists(report.pdf_path):
            pdf_path = report.pdf_path
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PDF report file with ID '{report_id}' was not found."
            )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"MindMatters_Report_{report_id}.pdf"
    )
