from pydantic import BaseModel, validator
from enum import Enum
from uuid import UUID
from datetime import date, datetime
from typing import Optional

class EventAction(str, Enum):
    approve = "approve"
    decline = "decline"

    def to_db(self) -> str:
        return {
            "approve": "approved",
            "decline": "declined"
        }[self.value]

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_date: date
    end_date: date

    @validator('end_date')
    def end_date_must_be_after_start(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('End date must be on or after start date')
        return v

class EventOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    location: str
    start_date: date
    end_date: date
    status: str
    created_by: UUID
    created_at: datetime
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True