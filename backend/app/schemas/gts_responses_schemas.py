import enum
from pydantic import BaseModel, validator
from typing import Optional, List
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

# C. TRAINING(S) ADVANCE STUDIES ATTENTED AFTER COLLEGE(optional)

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

    class Config:
        from_attributes = True

class GTSResponsesOut(BaseModel):
    id: UUID
    user_id: UUID
    full_name: str
    permanent_address: Optional[str] = None
    contact_email: str
    mobile: str
    civil_status: Optional[str]
    sex: SexEnum
    birthday: date
    ever_employed: Optional[bool]
    is_employed: Optional[bool]
    non_employed_reasons: Optional[List[str]] = None
    employment_status: Optional[str]
    occupation: Optional[List[str]] = None
    company_name: Optional[str]
    company_address: Optional[str]
    job_sector: Optional[str]
    place_of_work: Optional[str]

    class Config:
        from_attributes = True

    @validator('occupation', 'non_employed_reasons', pre=True, always=True, each_item=False)
    def parse_array_strings(cls, v):
        if isinstance(v, str) and v.startswith('{') and v.endswith('}'):
            items = []
            for item in v[1:-1].split(','):  
                item = item.strip()
                if item.startswith('"') and item.endswith('"'):
                    item = item[1:-1]  
                items.append(item)
            return [i for i in items if i]  
        return v if isinstance(v, list) else (v or [])