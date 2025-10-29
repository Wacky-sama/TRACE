import uuid
from sqlalchemy import Column, String, ForeignKey # pyright: ignore[reportMissingImports]
from sqlalchemy.dialects.postgresql import UUID # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import relationship # pyright: ignore[reportMissingImports]
from app.database import Base

class Training(Base):
    __tablename__ = "trainings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gts_id = Column(UUID(as_uuid=True), ForeignKey("gts_responses.id"), nullable=False)
    title = Column(String, nullable=False)
    duration = Column(String, nullable=True)
    credits_earned = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    
    gts_response = relationship(
        "GTSResponses", 
        back_populates="trainings"
    )