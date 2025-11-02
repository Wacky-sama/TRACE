from sqlalchemy import Column, String, Text, Date, Time, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.database import Base

class Events(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    
    # Dates
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # Times
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="pending")
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    approved_at = Column(DateTime)
    remarks = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = relationship(
        "Users", 
        foreign_keys=[created_by]
    )
    
    creator = relationship(
        "Users", 
        foreign_keys=[created_by]
    )
    
    attendances = relationship(
        "EventAttendance",
        back_populates="event",
        cascade="all, delete-orphan",
        passive_deletes=True
    )