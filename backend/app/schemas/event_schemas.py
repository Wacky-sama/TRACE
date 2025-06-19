from pydantic import BaseModel
from enum import Enum
from uuid import UUID
from datetime import date, datetime
from typing import Optional

class EventAction(str, Enum):
    approve = "approve"
    decline = "decline"

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: date

class EventOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: date
    status: str
    created_by: UUID
    created_at: datetime
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True