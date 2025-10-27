import enum
from pydantic import BaseModel, EmailStr, Field # pyright: ignore[reportMissingImports]
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date, timezone
from app.schemas.gts_responses_schemas import GTSResponsesOut

class EmailCheckRequest(BaseModel):
    email: EmailStr

class EmailCheckResponse(BaseModel):
    available: bool
    message: str

class UsernameCheckRequest(BaseModel):
    username: str

class UsernameCheckResponse(BaseModel):
    available: bool
    message: str

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserRole(str, enum.Enum):
    admin = "admin"
    alumni = "alumni"

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    confirm_new_password: str = Field(..., min_length=8)

class AdminResetPasswordRequest(BaseModel):
    new_password: str = Field(..., min_length=6)

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
    name_extension: Optional[str] = None
    course: str
    batch_year: int = Field(
        ...,
        ge=1900,
        le=datetime.now(timezone.utc).year,
        description="Graduation year must be between 1900 and the current year"
    )
    birthday: date
    present_address: str
    permanent_address: str
    contact_number: str
    sex: SexEnum

# Admin-only user creation schema
class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    lastname: str
    firstname: str
    middle_initial: Optional[str] = None
    name_extension: Optional[str] = None
    sex: SexEnum
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
    latest_gts: Optional[GTSResponsesOut] = None

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
    deleted_at: Optional[datetime] = None
    is_active: bool
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
    contact_number: Optional[str]
    role: UserRole
    is_approved: bool
    sex: Optional[SexEnum]
    present_address: Optional[str] = None
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