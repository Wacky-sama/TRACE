from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
from app.models.activity_logs_models import ActivityLog
from app.schemas.activity_logs_schemas import ActivityLogResponse, ActivityLogCreate
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
    current_user=Depends(get_current_user)
):
    """
    Manually create an activity log entry.
    This is mostly used for testing or system actions that are not auto-logged.
    """
    try:
        new_log = ActivityLog(
            user_id=current_user.id,
            action_type=log.action_type,
            description=log.description,
            target_user_id=log.target_user_id,
            meta_data=log.meta_data,
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create activity log: {str(e)}")


@router.get("/recent", response_model=List[ActivityLogResponse])
def get_recent_activity_logs(
    db: Session = Depends(get_db),
    limit: int = 10
):
    """
    Retrieve the most recent activity logs for the dashboard or audit history.
    """
    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )
    return [ActivityLogResponse.from_orm(log) for log in logs]
