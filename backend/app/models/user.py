from sqlalchemy import Column, String, Boolean, Enum, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    admin = "admin"
    organizer = "organizer"
    alumni = "alumni"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    middle_initial = Column(String)
    course = Column(String)
    batch_year = Column(Integer)
    role = Column(Enum(UserRole), nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
