from typing import Optional, Union
from uuid import UUID

from pydantic import BaseModel, field_validator

class TrainingItem(BaseModel):
    id: Optional[Union[str, UUID]] = None
    title: str
    duration: Optional[str] = None
    credits_earned: Optional[str] = None
    institution: Optional[str] = None
    
    @field_validator("id", mode="before")
    @classmethod
    def convert_uuid_to_str(cls, v):
        """
        Convert UUID to string if needed.
        """
        if isinstance(v, UUID):
            return str(v)
        return v