import enum
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from app.schemas.gts_responses_schemas import GTSResponseOut

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserRole(str, enum.Enum):
    admin = "admin"
    alumni = "alumni"

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"
    other = "Other"
    prefer_not_to_say = "Prefer not to say"

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
    permanent_address: Optional[str] = None
    contact_number: Optional[str] = None
    sex: Optional[SexEnum] = None

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
    permanent_address: Optional[str] = None
    contact_number: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool
    is_active: bool
    deleted_at: Optional[datetime]
    sex: Optional[SexEnum]

    class Config:
        from_attributes = True

class UserWithGTSResponseOut(UserOut):
    latest_gts: Optional[GTSResponseOut] = None

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
    permanent_address: Optional[str] = None
    contact_number: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole
    is_approved: bool
    sex: Optional[SexEnum]

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
    sex: Optional[SexEnum]
    permanent_address: Optional[str] = None

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