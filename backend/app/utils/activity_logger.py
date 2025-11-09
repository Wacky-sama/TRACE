from datetime import datetime, timezone

from app.models.activity_logs_models import ActionType, ActivityLog
from app.models.users_models import Users
from sqlalchemy.orm import Session

def log_activity(
    db: Session,
    user_id: str,
    action_type: ActionType,
    description: str,
    target_user_id: str = None,
    meta_data: dict = None,
    created_at: datetime = None
):
    """
    Creates a new activity log entry in the database.
    Automatically handles DB commit and rollback safety.
    
    Automatically filters out activity logs for unapproved alumni users,
    except for specific actions (register, login, update before approval).
    """
    try: 
        if created_at is None:
            created_at = datetime.now(timezone.utc)
        
        user = db.query(Users).filter(Users.id == user_id).first()
        
        if user and user.role.value == "alumni" and not user.is_approved:
            allowed_actions = {ActionType.register, ActionType.login, ActionType.update}
            if action_type not in allowed_actions:
                return None
                
        log_entry = ActivityLog(
            user_id=user_id,
            action_type=action_type,
            description=description,
            target_user_id=target_user_id,
            meta_data=meta_data,
            created_at=created_at
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        
        return log_entry
    
    except Exception as e:
        db.rollback()
        print(f"[ActivityLog Error] Failed to log activity: {e}")
        return None
