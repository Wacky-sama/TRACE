from sqlalchemy.orm import Session
from app.models.activity_logs_models import ActivityLog, ActionType
from datetime import datetime

def log_activity(
    db: Session,
    user_id: str,
    action_type: ActionType,
    description: str,
    target_user_id: str = None,
    meta_data: dict = None
):
    """
    Creates a new activity log entry in the database.
    Automatically handles DB commit and rollback safety.
    """
    try:
        log_entry = ActivityLog(
            user_id=user_id,
            action_type=action_type,
            description=description,
            target_user_id=target_user_id,
            meta_data=meta_data,
            created_at=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        db.rollback()
        print(f"[ActivityLog Error] Failed to log activity: {e}")
        return None
