from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from uuid import UUID
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    organizer = "organizer"
    alumni = "alumni"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    lastname: str
    firstname: str
    middle_initial: Optional[str] = None
    course: Optional[str] = None
    batch_year: Optional[int] = None
    role: UserRole

    @model_validator(mode='after')
    def check_alumni_fields(self):
        if self.role == UserRole.alumni:
            if not self.course:
                raise ValueError('Course is required for alumni')
            if not self.batch_year:
                raise ValueError('Batch year is required for alumni')
        return self

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    lastname: str
    firstname: str
    role: UserRole
    is_approved: bool

    class Config:
        from_attributes = True
