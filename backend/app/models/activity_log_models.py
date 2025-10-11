import uuid
from sqlalchemy import Column, String, ForeignKey, Text, JSON, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base 

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    meta_data = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship(
        "User",
        back_populates="activity_logs",
        foreign_keys=[user_id],
        passive_deletes=True,
    )

    target_user = relationship(
        "User",
        back_populates="target_logs",
        foreign_keys=[target_user_id],
        passive_deletes=True,
    )
