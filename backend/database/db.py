import json
from typing import Optional, Dict, Any
from db.database import SessionLocal, init_db as init_sqlalchemy_db
from db.models import Report

# Initialize SQLAlchemy database tables
init_sqlalchemy_db()

def init_db():
    init_sqlalchemy_db()

def save_report(report_id: str, user_name: str, mind_score: int, traits: Dict[str, Any], pdf_path: str):
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            report = Report(
                id=report_id,
                user_name=user_name,
                mind_score=mind_score,
                traits_json=json.dumps(traits),
                pdf_path=pdf_path,
                download_url=f"/api/v1/reports/download/{report_id}"
            )
            db.add(report)
        else:
            report.user_name = user_name
            report.mind_score = mind_score
            report.traits_json = json.dumps(traits)
            report.pdf_path = pdf_path
        db.commit()
    finally:
        db.close()

def get_report(report_id: str) -> Optional[Dict[str, Any]]:
    db = SessionLocal()
    try:
        row = db.query(Report).filter(Report.id == report_id).first()
        if not row:
            return None
        return {
            "id": row.id,
            "user_name": row.user_name,
            "mind_score": row.mind_score,
            "traits": json.loads(row.traits_json) if row.traits_json else {},
            "pdf_path": row.pdf_path,
            "created_at": row.created_at.isoformat() if row.created_at else None
        }
    finally:
        db.close()
