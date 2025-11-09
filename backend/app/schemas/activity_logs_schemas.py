from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel

class NotificationTYpe(str, Enum):
    alert = "alert"
    message = "message"
    update = "update"
class ActivityLogBase(BaseModel):
    action_type: str
    description: str
    target_user_id: Optional[UUID] = None
    meta_data: Optional[Any] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: UUID
    action_type: str
    description: Any
    user_id: UUID
    target_user_id: Optional[UUID] = None
    meta_data: Optional[Any] = None
    is_read: Optional[bool] = False
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.astimezone(timezone.utc).isoformat()
        }