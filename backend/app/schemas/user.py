from pydantic import BaseModel, EmailStr, field_validator, model_validator
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import enum

class UserLogin(BaseModel):
    username: str
    password: str

class UserRole(str, enum.Enum):
    admin = "admin"
    organizer = "organizer"
    alumni = "alumni"

class TokenResponse(BaseModel):
    token: str
    role: UserRole

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
    is_active: bool
    deleted_at: Optional[datetime]

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

class UserProfileOut(BaseModel):
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

class UpdateLastSeenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.headers.get("Authorization")
        if token and token.startswith("Bearer "):
            token = token[7:]
            try:
                payload = decode_access_token(token)
                username = payload.get("sub")
                db = SessionLocal()
                user = db.query(User).filter(User.username == username).first()
                if user:
                    user.last_seen = datetime.utcnow()
                    db.commit()
                db.close()
            except Exception:
                pass
        response = await call_next(request)
        return response

    class Config:
        from_attributes = True