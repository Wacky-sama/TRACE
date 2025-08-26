from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
import enum

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserRole(str, enum.Enum):
    admin = "admin"
    alumni = "alumni"

class TokenResponse(BaseModel):
    token: str
    role: UserRole
    is_approved: bool
    username: str

# Alumni Registration Schema
class AlumniRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    lastname: str
    firstname: str
    middle_initial: Optional[str] = None
    course: str
    batch_year: int = Field(
        ...,
        ge=1900,
        le=datetime.utcnow().year,
        description="Graduation year must be between 1900 and the current year"
    )
    name_extension: Optional[str] = None
    birthday: Optional[date] = None
    present_address: Optional[str] = None
    contact_number: Optional[str] = None

# Admin-only user creation schema
class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    lastname: str
    firstname: str
    middle_initial: Optional[str] = None
    role: UserRole

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    lastname: str
    firstname: str
    middle_initial: Optional[str]
    name_extension: Optional[str]
    birthday: Optional[date]
    present_address: Optional[str]
    contact_number: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool
    is_active: bool
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True

class UserProfileOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    lastname: str
    firstname: str
    middle_initial: Optional[str]
    name_extension: Optional[str]
    birthday: Optional[date]
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

    class Config:
        from_attributes = True

class PaginatedUserResponse(BaseModel):
    users: List[UserProfileOut]
    total: int
    page: int
    limit: int
    pages: int

    class Config:
        from_attributes = True