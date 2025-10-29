from pydantic import BaseModel # pyright: ignore[reportMissingImports]
from typing import Optional

class TrainingItem(BaseModel):
    id: Optional[str] = None
    title: str
    duration: Optional[str] = None
    credits_earned: Optional[str] = None
    institution: Optional[str] = None