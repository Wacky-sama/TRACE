import enum
from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import date

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

class GTSResponsesCreate(BaseModel):
    ever_employed: bool
    is_employed: Optional[bool] = None
    non_employed_reasons: Optional[List[str]] = None
    employment_status: str
    place_of_work: Optional[str] = None
    permanent_address: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    occupation: Optional[List[str]] = None

# A. GENERAL INFORMATION Update
class GTSResponsesPersonalUpdate(BaseModel):
    civil_status: Optional[str] = None

# B. EDUCATIONAL BACKGROUND 
class GTSResponsesEducationalUpdate(BaseModel):
    degree: Optional[str] = None
    specialization: Optional[str] = None
    year_graduated: Optional[int] = None
    honors: Optional[str] = None
    exams: Optional[Dict[str, Any]] = None
    pursued_advance_degree: Optional[bool] = None
    pursued_advance_degree_reasons: Optional[List[str]] = None
    @validator('year_graduated')
    def validate_year_graduated(cls, v):
        if v is not None and (v < 1900 or v > 2100):
            raise ValueError('Year graduated must be between 1900 and 2100')
        return v
    class Config:
        from_attributes = True
# C. TRAINING(S) ADVANCE STUDIES ATTENTED AFTER COLLEGE(optional)
class TrainingItem(BaseModel):
    title: str
    duration: Optional[str] = None
    credits_earned: Optional[str] = None
    institution: Optional[str] = None


class GTSResponsesTrainingUpdate(BaseModel):
    trainings: Optional[List[TrainingItem]] = None

    class Config:
        from_attributes = True

# D. EMPLOYMENT DATA Update
class GTSResponsesEmploymentUpdate(BaseModel):
    ever_employed: Optional[bool] = None
    is_employed: Optional[bool] = None
    non_employed_reasons: Optional[List[str]] = None
    employment_status: Optional[str]
    occupation: Optional[List[str]] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    job_sector: Optional[str] = None
    place_of_work: Optional[str] = None
    first_job: Optional[bool] = None
    job_related_to_course: Optional[bool] = None
    job_start_date: Optional[date] = None
    months_to_first_job: Optional[int] = None
    job_find_methods: Optional[List[str]] = None
    job_reasons: Optional[List[str]] = None
    job_change_reasons: Optional[List[str]] = None
    job_level_first: Optional[str] = None
    job_level_current: Optional[str] = None
    first_job_salary: Optional[float] = None
    curriculum_relevance_first_job: Optional[bool] = None
    curriculum_relevance_second_job: Optional[bool] = None
    useful_competencies: Optional[List[str]] = None
    curriculum_improvement_suggestions: Optional[str] = None
    
    class Config:
        from_attributes = True

# E. JOB SATISFACTION Update
class GTSResponsesJobSatisfactionUpdate(BaseModel):
    job_satisfaction: Optional[str] = None
    job_satisfaction_reason: Optional[str] = None

    class Config:
        from_attributes = True

# F. SERVICES FROM CSU Update
class GTSResponsesServicesUpdate(BaseModel):
    desired_services: Optional[str] = None
    class Config:
        from_attributes = True

# G. PROBLEMS, ISSUES AND CONCERNS Update
class GTSResponsesProblemsUpdate(BaseModel):
    job_problems: Optional[str] = None
    class Config:
        from_attributes = True

class GTSResponsesOut(BaseModel):
    # SECTION A: GENERAL INFORMATION 
    id: UUID
    user_id: UUID
    full_name: str
    permanent_address: Optional[str] = None
    contact_email: str
    mobile: str
    civil_status: Optional[str]
    sex: SexEnum
    birthday: date
    
    # SECTION B: EDUCATIONAL BACKGROUND
    degree: Optional[str] = None
    specialization: Optional[str] = None
    year_graduated: Optional[int] = None
    honors: Optional[str] = None
    exams: Optional[Dict[str, Any]] = None
    pursued_advance_degree: Optional[bool] = None
    pursued_advance_degree_reasons: Optional[List[str]] = None
    
    # SECTION C: TRAINING(S) ADVANCE STUDIES ATTENTED AFTER COLLEGE(optional)
    trainings: Optional[List[Dict[str, Any]]] = None
    
    # SECTION D: EMPLOYMENT DATA
    ever_employed: Optional[bool]
    is_employed: Optional[bool]
    non_employed_reasons: Optional[List[str]] = None
    employment_status: Optional[str]
    occupation: Optional[List[str]] = None
    company_name: Optional[str]
    company_address: Optional[str]
    job_sector: Optional[str]
    place_of_work: Optional[str]
    first_job: Optional[bool] = None
    job_related_to_course: Optional[bool] = None
    job_start_date: Optional[date] = None
    months_to_first_job: Optional[int] = None
    job_find_methods: Optional[List[str]] = None
    job_reasons: Optional[List[str]] = None
    job_change_reasons: Optional[List[str]] = None
    job_level_first: Optional[str] = None
    job_level_current: Optional[str] = None
    first_job_salary: Optional[float] = None
    curriculum_relevance_first_job: Optional[bool] = None
    curriculum_relevance_second_job: Optional[bool] = None
    useful_competencies: Optional[List[str]] = None
    curriculum_improvement_suggestions: Optional[str] = None
    
    # SECTION E: JOB SATISFACTION
    job_satisfaction: Optional[str] = None
    job_satisfaction_reason: Optional[str] = None

    # SECTION F: SERVICES FROM CSU
    desired_services: Optional[str] = None

    # SECTION G: PROBLEMS, ISSUES AND CONCERNS
    job_problems: Optional[str] = None

    
    class Config:
        from_attributes = True

    @validator('occupation', 'non_employed_reasons', 'job_find_methods', 
               'job_reasons', 'job_change_reasons', 'useful_competencies', 
                pre=True, always=True, each_item=False)
    def parse_array_strings(cls, v):
        """
        Parses PostgreSQL array strings (e.g. '{item1, item2}') into Python lists.
        This ensures proper handling when SQLAlchemy returns text-formatted arrays.
        """
        if isinstance(v, str) and v.startswith('{') and v.endswith('}'):
            items = []
            for item in v[1:-1].split(','):  
                item = item.strip()
                if item.startswith('"') and item.endswith('"'):
                    item = item[1:-1]  
                items.append(item)
            return [i for i in items if i]  
        return v if isinstance(v, list) else (v or [])