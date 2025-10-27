import enum
from sqlalchemy import func
from sqlalchemy import Column, Enum, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class ActionType(str, enum.Enum):
    register = "register" # Alumni registration
    approve = "approve" # Admin approval of alumni
    decline = "decline" # Admin decline of alumni
    delete = "delete" # Alumni deletion
    update = "update" # Alumni information update
    login = "login" # User login
    logout = "logout" # User logout
    attend_event = "attend_event" # Alumni attend event
    decline_event = "decline_event" # Alumni decline event

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default="uuid_generate_v4()")
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(Enum(ActionType, name="actiontype"), nullable=False)
    description = Column(JSON, nullable=False)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    meta_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship(
        "Users", 
        foreign_keys=[user_id], 
        back_populates="activity_logs", 
        lazy="joined"
    )
    
    target_user = relationship(
        "Users", 
        foreign_keys=[target_user_id], 
        lazy="joined"
    )
