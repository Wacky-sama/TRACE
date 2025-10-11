import uuid
import enum
from sqlalchemy import Column, String, Boolean, Enum, Integer, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    alumni = "alumni"

class SexEnum(str, enum.Enum):
    male = "Male"
    female = "Female"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    middle_initial = Column(String(1))
    name_extension = Column(String, nullable=True)
    course = Column(String)
    batch_year = Column(Integer)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    deleted_at = Column(DateTime, nullable=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_seen = Column(DateTime, server_default=func.now())
    birthday = Column(Date, nullable=True)
    present_address = Column(String, nullable=True)
    permanent_address = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    sex = Column(Enum(SexEnum), nullable=False)

    # Relationships
    activity_logs = relationship(
        "ActivityLog",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys="ActivityLog.user_id",
    )

    target_logs = relationship(
        "ActivityLog",
        back_populates="target_user",
        foreign_keys="ActivityLog.target_user_id",
        passive_deletes=True,
    ) 
