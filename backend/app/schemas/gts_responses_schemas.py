from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class GTSResponseCreate(BaseModel):
    employment_status: str
    place_of_work: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    occupation: Optional[str] = None


class GTSResponseOut(BaseModel):
    id: UUID
    user_id: UUID
    employment_status: str
    place_of_work: Optional[str]
    company_name: Optional[str]
    company_address: Optional[str]
    occupation: Optional[str]

    class Config:
        orm_mode = True
