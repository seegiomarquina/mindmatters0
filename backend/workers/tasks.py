import uuid
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from db.models import Job

def enqueue_analysis_job(job_type: str, payload: Dict[str, Any], db: Session) -> str:
    """Enqueues an asynchronous analysis task for worker or batch processing."""
    job_id = str(uuid.uuid4())
    job = Job(
        id=job_id,
        job_type=job_type,
        status="pending",
        payload_json=json.dumps(payload)
    )
    db.add(job)
    db.commit()
    return job_id

def update_job_status(job_id: str, status: str, result: Optional[Dict[str, Any]] = None, error: Optional[str] = None, db: Optional[Session] = None):
    if not db:
        return
    job = db.query(Job).filter(Job.id == job_id).first()
    if job:
        job.status = status
        if result:
            job.result_json = json.dumps(result)
        if error:
            job.error_details = error
        job.updated_at = datetime.now(timezone.utc)
        db.commit()
