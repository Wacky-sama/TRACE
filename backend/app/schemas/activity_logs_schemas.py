from pydantic import BaseModel
from typing import Any, Optional 
from datetime import datetime, timezone
from uuid import UUID

class ActivityLogBase(BaseModel):
    action_type: str
    description: str
    target_user_id: Optional[UUID] = None
    meta_data: Optional[Any] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.astimezone(timezone.utc).isoformat()
        }