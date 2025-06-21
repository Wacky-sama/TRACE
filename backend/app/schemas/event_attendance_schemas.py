from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AttendanceBase(BaseModel):
    event_id: UUID

class AttendanceCreate(AttendanceBase):
    pass  # Could be extended if you allow setting more than just event_id

class AttendanceOut(BaseModel):
    id: UUID
    event_id: UUID
    user_id: UUID
    status: str
    registered_at: datetime
    attended_at: Optional[datetime] = None

    class Config:
        from_attributes = True
