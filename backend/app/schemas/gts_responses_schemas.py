import enum
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

class GTSResponseCreate(BaseModel):
    full_name: Optional[str] = None
    contact_email: Optional[str] = None
    mobile: Optional[str] = None
    sex: Optional[SexEnum] = None
    birthday: Optional[date] = None
    ever_employed: Optional[bool] = None
    is_employed: Optional[bool] = None
    employment_status: Optional[str] = None
    place_of_work: Optional[str] = None
    permanent_address: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    occupation: Optional[str] = None
    civil_status: Optional[str] = None

class GTSResponseOut(BaseModel):
    id: UUID
    user_id: UUID
    ever_employed: Optional[bool]
    is_employed: Optional[bool]
    employment_status: Optional[str]
    place_of_work: Optional[str]
    permanent_address: Optional[str] = None
    company_name: Optional[str]
    company_address: Optional[str]
    occupation: Optional[str]
    civil_status: Optional[str]

    class Config:
        from_attributes = True
