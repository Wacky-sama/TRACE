from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.activity_log_schemas import ActivityLogResponse, ActivityLogCreate
from app.models.activity_log_models import ActivityLog
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/activity", 
    tags=["Activity Logs"]
)

@router.post("/", response_model=ActivityLogResponse)
def create_activity_log(
    log: ActivityLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_log = ActivityLog(
        user_id=current_user.id,
        action_type=log.action_type,
        description=log.description,
        target_user_id=log.target_user_id,
        metadata=log.metadata,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/recent", response_model=List[ActivityLogResponse])
def get_recent_activity_logs(db: Session = Depends(get_db), limit: int = 10):
    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )
    return logs
