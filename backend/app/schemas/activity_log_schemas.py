from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from uuid import UUID

class ActivityLogBase(BaseModel):
    action_type: str
    description: str
    target_user_id: Optional[UUID] = None
    metadata: Optional[Any] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
