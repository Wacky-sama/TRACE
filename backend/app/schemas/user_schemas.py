from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import enum

class UserLogin(BaseModel):
    username: str
    password: str

class UserRole(str, enum.Enum):
    admin = "admin"
    alumni = "alumni"

class TokenResponse(BaseModel):
    token: str
    role: UserRole
    is_approved: bool

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    lastname: str
    firstname: str
    middle_initial: Optional[str] = None
    course: Optional[str] = None
    batch_year: Optional[int] = None
    name_extension: Optional[str] = None
    birthday: Optional[date] = None
    present_address: Optional[str] = None
    contact_number: Optional[str] = None
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
    middle_initial: Optional[str]
    name_extension: Optional[str]
    birthday: Optional[datetime]
    present_address: Optional[str]
    contact_number: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool
    is_active: bool
    deleted_at: Optional[datetime]

class UserProfileOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    lastname: str
    firstname: str
    middle_initial: Optional[str]
    name_extension: Optional[str]
    birthday: Optional[datetime]
    present_address: Optional[str]
    contact_number: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool

    class Config:
        from_attributes = True

class UserPendingApprovalOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    lastname: str
    firstname: str
    middle_initial: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool


class PaginatedUserResponse(BaseModel):
    users: List[UserProfileOut]
    total: int
    page: int
    limit: int
    pages: int

    class Config:
        from_attributes = True