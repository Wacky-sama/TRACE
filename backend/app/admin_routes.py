from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get("/analytics")
def get_admin_analytics(db: Session = Depends(get_db)):
    # sample dummy data for now
    return {
        "totalAlumni": 123,
        "gtsCompleted": 45,
        "activeEvents": 3,
        "departments": 6,
    }
