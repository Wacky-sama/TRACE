from sqlalchemy import Column, String, Text, Date, Time, ForeignKey, DateTime # pyright: ignore[reportMissingImports]
from sqlalchemy.dialects.postgresql import UUID # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import relationship # pyright: ignore[reportMissingImports]
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
    start_date = Column(Date, nullable=False) # Start date of the event
    end_date = Column(Date, nullable=False) # End date of the event
    
    # Times
    start_time_startday = Column(Time, nullable=True) # Start time on start day
    end_time_startday = Column(Time, nullable=True) # End time on start day
    start_time_endday = Column(Time, nullable=True) # Start time on end day
    end_time_endday = Column(Time, nullable=True) # End time on end day
    
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
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
    
    def __repr__(self):
        return f"<Event(title={self.title}, creator={self.created_by})>"