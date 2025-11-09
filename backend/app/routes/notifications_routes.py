from fastapi import APIRouter, Depends, HTTPException, status # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]
from uuid import UUID
from app.database import get_db
from app.models.activity_logs_models import ActivityLog, ActionType
from app.schemas.activity_logs_schemas import ActivityLogResponse
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=List[ActivityLogResponse])
def get_notifications(db: Session = Depends(get_db)):
    """Return all activity logs (acts as notifications) ordered by newest first"""
    logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).all()
    return logs


@router.patch("/{notif_id}/read")
def mark_notification_read(notif_id: UUID, db: Session = Depends(get_db)):
    notif = db.query(ActivityLog).filter_by(id=notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return {"message": "Notification marked as read"}


@router.delete("/{notif_id}")
def delete_notification(notif_id: UUID, db: Session = Depends(get_db)):
    notif = db.query(ActivityLog).filter_by(id=notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    db.delete(notif)
    db.commit()
    return {"message": "Notification deleted"}
