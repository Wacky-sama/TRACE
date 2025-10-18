import enum
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

class GTSResponseCreate(BaseModel):
    ever_employed: bool
    is_employed: Optional[bool] = None
    non_employed_reasons: Optional[List[str]] = None
    employment_status: str
    place_of_work: Optional[str] = None
    permanent_address: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    occupation: Optional[List[str]] = None

class GTSResponseFullCreate(GTSResponseCreate):
    degree: Optional[str]
    specialization: Optional[str]
    year_graduated: Optional[int]
    honors: Optional[str]
    pursued_advance_degree: Optional[bool]
    pursued_advance_degree_reasons: Optional[List[str]]
    trainings: Optional[List[dict]]
    job_satisfaction: Optional[str]
    job_satisfaction_reason: Optional[str]
    desired_services: Optional[str]
    job_problems: Optional[str]

class GTSResponseOut(BaseModel):
    id: UUID
    user_id: UUID
    full_name: str
    contact_email: str
    mobile: str
    sex: SexEnum
    birthday: date
    ever_employed: Optional[bool]
    is_employed: Optional[bool]
    non_employed_reasons: Optional[List[str]]
    employment_status: Optional[str]
    place_of_work: Optional[str]
    permanent_address: Optional[str] = None
    company_name: Optional[str]
    company_address: Optional[str]
    occupation: Optional[List[str]]

    class Config:
        from_attributes = True
