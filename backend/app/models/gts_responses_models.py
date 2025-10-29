import uuid
from sqlalchemy import Column, String, Boolean, Integer, Date, ForeignKey, Text, Numeric # pyright: ignore[reportMissingImports]
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY # pyright: ignore[reportMissingImports]
from sqlalchemy.sql import func # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import relationship # pyright: ignore[reportMissingImports]
from app.models.trainings_models import Training
from app.database import Base

class GTSResponses(Base):
    __tablename__ = "gts_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    # SECTION A: GENERAL INFORMATION
    full_name = Column(Text, nullable=False)
    permanent_address = Column(Text, nullable=False)
    present_address = Column(Text, nullable=False)
    contact_email = Column(Text, nullable=False)
    telephone = Column(Text, nullable=True)
    mobile = Column(Text, nullable=False)
    civil_status = Column(Text, nullable=True)
    sex = Column(Text, nullable=False)
    birthday = Column(Date, nullable=False)

    # SECTION B: EDUCATIONAL BACKGROUND
    degree = Column(Text, nullable=True)
    specialization = Column(Text, nullable=True)
    year_graduated = Column(Integer, nullable=True)
    honors = Column(Text, nullable=True)
    exams = Column(JSONB, nullable=True)
    pursued_advance_degree = Column(Boolean, nullable=True)
    pursued_advance_degree_reasons = Column(ARRAY(Text), nullable=True)
    
    # SECTION C: TRAINING(S) ADVANCE STUDIES ATTENTED AFTER COLLEGE(optional) - Seperate file trainings_models.py

    # SECTION D: EMPLOYMENT DATA
    ever_employed = Column(Boolean, nullable=True)
    is_employed = Column(Boolean, nullable=True)
    non_employed_reasons = Column(ARRAY(Text), nullable=True)
    employment_status = Column(Text, nullable=True)
    occupation = Column(ARRAY(String), nullable=True)
    company_name = Column(Text, nullable=True)
    company_address = Column(Text, nullable=True)
    job_sector = Column(Text, nullable=True)
    place_of_work = Column(Text, nullable=True)
    first_job = Column(Boolean, nullable=True)
    job_related_to_course = Column(Boolean, nullable=True)
    job_start_date = Column(Date, nullable=True)
    months_to_first_job = Column(Integer, nullable=True)
    job_find_methods = Column(ARRAY(Text), nullable=True)
    job_reasons = Column(ARRAY(Text), nullable=True)
    job_change_reasons = Column(ARRAY(Text), nullable=True)
    job_level_first = Column(Text, nullable=True)
    job_level_current = Column(Text, nullable=True)
    first_job_salary = Column(Numeric, nullable=True)
    curriculum_relevance_first_job = Column(Boolean, nullable=True)
    curriculum_relevance_second_job = Column(Boolean, nullable=True)
    useful_competencies = Column(ARRAY(Text), nullable=True)
    curriculum_improvement_suggestions = Column(Text, nullable=True)

    # SECTION E: JOB SATISFACTION
    job_satisfaction = Column(Text, nullable=True)
    job_satisfaction_reason = Column(Text, nullable=True)
    
    # SECTION F: SERVICES FROM CSU
    desired_services = Column(Text, nullable=True)
    
    # SECTION G: PROBLEMS, ISSUES AND CONCERNS
    job_problems = Column(Text, nullable=True)

    # Metadata
    submitted_at = Column(Date, server_default=func.now())

    # Relations
    user = relationship(
        "Users", 
        backref="gts_responses"
    )
    
    trainings = relationship(
        "Training",
        back_populates="trainings",
        cascade="all, delete-orphan"
    )
