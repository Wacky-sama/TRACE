from pydantic import BaseModel, validator
from enum import Enum
from uuid import UUID
from datetime import date, datetime, time
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
    start_time: Optional[time] = None
    end_time: Optional[time] = None

    @validator('end_date')
    def end_date_must_be_after_start(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('End date must be on or after start date')
        return v
    
    @validator('end_time')
    def end_time_must_be_after_start_time(cls, v, values):
        if 'start_time' in values and v and values['start_time']:
            if 'start_date' in values and 'end_date' in values and values['start_date'] == values['end_date']:
                if v <= values['start_time']:
                    raise ValueError('End time must be after start time')
        return v

class EventOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    location: str
    start_date: date
    end_date: date
    start_date: Optional[time] = None
    end_time: Optional[time] = None
    status: str
    created_by: UUID
    created_at: datetime
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True