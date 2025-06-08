from pydantic import BaseModel, EmailStr
from typing import Optional
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    organizer = "organizer"
    alumni = "alumni"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    firstname: str
    lastname: str
    middle_initial: Optional[str]
    student_no: Optional[str]
    course: Optional[str]
    batch_year: Optional[int]
    role: UserRole

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    firstname: str
    lastname: str
    role: UserRole
    is_approved: bool

    class Config:
        orm_mode = True
