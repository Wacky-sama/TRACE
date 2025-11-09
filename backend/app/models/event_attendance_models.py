from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String  
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.orm import relationship 
from uuid import uuid4
from datetime import datetime
from app.database import Base

class EventAttendance(Base):
    __tablename__ = "event_attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(10), default="registered")
    registered_at = Column(DateTime, default=datetime.utcnow)
    attended_at = Column(DateTime, nullable=True)
    qr_token = Column(String, unique=True, nullable=True)
    is_valid = Column(Boolean, default=True)
    scanned_at = Column(DateTime, nullable=True)

     # Relationships
    event = relationship(
        "Events", 
        back_populates="attendances", 
        foreign_keys=[event_id], 
        passive_deletes=True
    )
    
    user = relationship(
        "Users", 
        backref="event_attendances", 
        foreign_keys=[user_id]
    )
