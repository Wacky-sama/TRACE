import uuid
import enum
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ActionType(str, enum.Enum):
    register = "register"
    approve = "approve"
    decline = "decline"
    delete = "delete"
    update = "update"
    login = "login"
    logout = "logout"

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    action_type = Column(Enum(ActionType, name="action_type_enum"), nullable=False)
    description = Column(String, nullable=False)
    target_user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    meta_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id], back_populates="activity_logs", lazy="joined")
    target_user = relationship("User", foreign_keys=[target_user_id], lazy="joined")
