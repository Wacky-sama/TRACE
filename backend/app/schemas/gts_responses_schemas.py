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
    occupation: Optional[str] = None

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
