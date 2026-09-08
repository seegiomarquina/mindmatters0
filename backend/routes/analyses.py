import os
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from schemas.analysis import AnalysisListResponse, AnalysisHistoryItem, AnalysisDetailResponse
from schemas.common import MessageResponse
from db.database import get_db
from db.models import Analysis, Sample, ExtractedFeatures, Report, User
from services.auth_service import get_current_user_optional

router = APIRouter(prefix="/analyses", tags=["Analyses History & Details"])

@router.get("", response_model=AnalysisListResponse)
async def list_analyses(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sample_type: Optional[str] = Query(None, description="Filter by sample type: handwriting, signature, typing"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retrieve historical analysis records (paginated)."""
    query = db.query(Analysis)
    
    if current_user:
        query = query.filter(Analysis.user_id == current_user.id)
    if sample_type:
        query = query.filter(Analysis.sample_type == sample_type)

    total = query.count()
    analyses = (
        query.order_by(Analysis.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        AnalysisHistoryItem(
            id=a.id,
            sample_id=a.sample_id,
            sample_type=a.sample_type,
            status=a.status,
            confidence_score=a.confidence_score,
            dominant_pattern=a.dominant_pattern,
            created_at=a.created_at
        )
        for a in analyses
    ]

    return AnalysisListResponse(
        total=total,
        page=page,
        page_size=page_size,
        analyses=items
    )

@router.get("/{analysis_id}", response_model=AnalysisDetailResponse)
async def get_analysis_detail(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve full analysis result with measurable features and traits."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis record with ID '{analysis_id}' not found."
        )

    traits = json.loads(analysis.traits_json) if analysis.traits_json else {}
    
    measurable_dict = None
    if analysis.extracted_features:
        ef = analysis.extracted_features
        measurable_dict = json.loads(ef.raw_metrics_json) if ef.raw_metrics_json else {
            "slant_angle_deg": ef.slant_angle,
            "ink_density": ef.ink_density,
            "writing_area_ratio": ef.writing_area_ratio,
            "component_count": ef.component_count,
            "avg_char_height_px": ef.avg_char_height,
            "avg_char_width_px": ef.avg_char_width,
            "avg_word_gap_px": ef.avg_word_gap,
            "avg_line_spacing_px": ef.avg_line_spacing,
            "baseline_slope_deg": ef.baseline_slope,
            "baseline_jitter": ef.baseline_jitter,
            "contour_complexity": ef.contour_complexity,
            "pressure_proxy": ef.pressure_proxy,
            "regularity_score": ef.regularity_score,
        }

    return AnalysisDetailResponse(
        id=analysis.id,
        sample_id=analysis.sample_id,
        sample_type=analysis.sample_type,
        status=analysis.status,
        model_version=analysis.model_version,
        confidence_score=analysis.confidence_score,
        dominant_pattern=analysis.dominant_pattern,
        traits=traits,
        measurable_features=measurable_dict,
        created_at=analysis.created_at,
        error_message=analysis.error_message
    )

@router.delete("/{analysis_id}", response_model=MessageResponse)
async def delete_analysis(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    """Delete an analysis result, associated features, sample records, and clean uploaded files."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{analysis_id}' not found."
        )

    # Clean up sample file on disk if exists
    if analysis.sample and analysis.sample.file_path:
        try:
            if os.path.exists(analysis.sample.file_path):
                os.remove(analysis.sample.file_path)
        except Exception:
            pass

    # Delete records (cascading deletes extracted features)
    db.delete(analysis)
    db.commit()

    return MessageResponse(
        message=f"Analysis '{analysis_id}' and associated sample files successfully deleted."
    )

@router.get("/{analysis_id}/report")
async def get_analysis_report(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve report for a specific analysis."""
    report = db.query(Report).filter(Report.analysis_id == analysis_id).first()
    if not report:
        # Fallback to analysis detail
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report or analysis with ID '{analysis_id}' not found."
            )
        return {
            "analysis_id": analysis.id,
            "status": analysis.status,
            "traits": json.loads(analysis.traits_json) if analysis.traits_json else {},
            "dominant_pattern": analysis.dominant_pattern,
            "created_at": analysis.created_at
        }

    return {
        "report_id": report.id,
        "analysis_id": report.analysis_id,
        "user_name": report.user_name,
        "mind_score": report.mind_score,
        "dominant_archetype": report.dominant_archetype,
        "executive_summary": report.executive_summary,
        "cognitive_indices": json.loads(report.cognitive_indices_json) if report.cognitive_indices_json else {},
        "traits": json.loads(report.traits_json) if report.traits_json else {},
        "download_url": report.download_url,
        "created_at": report.created_at
    }
