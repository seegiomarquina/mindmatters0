import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from db.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    samples = relationship("Sample", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")

class Sample(Base):
    __tablename__ = "samples"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(64), nullable=False)
    sample_type = Column(String(32), default="handwriting")  # handwriting, signature
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="samples")
    analyses = relationship("Analysis", back_populates="sample", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    sample_id = Column(String(36), ForeignKey("samples.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    sample_type = Column(String(32), default="handwriting")  # handwriting, signature, typing
    status = Column(String(32), default="completed")  # pending, completed, failed
    model_version = Column(String(32), default="2.0.0")
    confidence_score = Column(Float, nullable=True)
    dominant_pattern = Column(String(128), nullable=True)
    error_message = Column(Text, nullable=True)
    traits_json = Column(Text, nullable=True)  # JSON-encoded qualitative traits / interpretation
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="analyses")
    sample = relationship("Sample", back_populates="analyses")
    extracted_features = relationship("ExtractedFeatures", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="analysis", cascade="all, delete-orphan")

class ExtractedFeatures(Base):
    __tablename__ = "extracted_features"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # 10 Measurable Biometric Features
    slant_angle = Column(Float, nullable=True)
    ink_density = Column(Float, nullable=True)
    writing_area_ratio = Column(Float, nullable=True)
    component_count = Column(Integer, nullable=True)
    avg_char_height = Column(Float, nullable=True)
    avg_char_width = Column(Float, nullable=True)
    avg_word_gap = Column(Float, nullable=True)
    avg_line_spacing = Column(Float, nullable=True)
    baseline_slope = Column(Float, nullable=True)
    baseline_jitter = Column(Float, nullable=True)
    contour_complexity = Column(Float, nullable=True)
    pressure_proxy = Column(Float, nullable=True)
    regularity_score = Column(Float, nullable=True)
    
    raw_metrics_json = Column(Text, nullable=True)  # Full numerical dictionary JSON
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    analysis = relationship("Analysis", back_populates="extracted_features")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_name = Column(String(128), default="Anonymous")
    mind_score = Column(Integer, nullable=False)
    dominant_archetype = Column(String(128), nullable=True)
    executive_summary = Column(Text, nullable=True)
    cognitive_indices_json = Column(Text, nullable=True)
    traits_json = Column(Text, nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    pdf_path = Column(String(512), nullable=True)
    download_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reports")
    analysis = relationship("Analysis", back_populates="reports")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_type = Column(String(64), nullable=False)
    status = Column(String(32), default="pending")  # pending, in_progress, completed, failed
    payload_json = Column(Text, nullable=True)
    result_json = Column(Text, nullable=True)
    error_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
