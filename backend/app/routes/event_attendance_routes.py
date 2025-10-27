from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.database import get_db
from app.models.activity_logs_models import ActionType
from app.models import (event_attendance_models, events_models)
from app.models.users_models import Users
from app.routes.users_routes import get_current_user 
from app.schemas.event_attendance_schemas import AttendanceOut
from app.utils.activity_logger import log_activity

router = APIRouter(
    prefix="/attendance", 
    tags=["Attendance"])

@router.post("/{event_id}", response_model=AttendanceOut)
def attend_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "alumni":
        raise HTTPException(status_code=403, detail="Only alumni can attend events.")

    # Check for approved event
    event = db.query(events_models.Events).filter_by(id=event_id, status="approved").first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found or not approved")

    # Prevent double registration
    existing = db.query(event_attendance_models.EventAttendance).filter_by(
        event_id=event_id,
        user_id=current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You already registered for this event.")

    # Register new attendance
    attendance = event_attendance_models.EventAttendance(
        event_id=event_id,
        user_id=current_user.id,
        status="registered"
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    log_activity(
        db=db,
        user_id=str(current_user.id),
        action_type=ActionType.attend_event,
        description=f"{current_user.firstname} {current_user.lastname} registered for event '{event.title}'",
        target_user_id=None,
        meta_data={
            "event_id": str(event.id),
            "event_title": event.title,
            "location": event.location,
            "start_date": event.start_date.isoformat(),
            "end_date": event.end_date.isoformat()
        }
    )

    return attendance

@router.post("/{event_id}/decline")
def decline_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "alumni":
        raise HTTPException(status_code=403, detail="Only alumni can decline events.")

    event = db.query(events_models.Events).filter_by(id=event_id, status="approved").first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found or not approved")
    
    record = db.query(event_attendance_models.EventAttendance).filter_by(
        event_id=event_id,
        user_id=current_user.id
    ).first()
    
    if not record:
        record = event_attendance_models.EventAttendance(
            event_id=event_id,
            user_id=current_user.id,
            status="declined",
            attended_at=datetime.utcnow()
        )
        db.add(record)
    else:
        record.status = "declined"
        record.attended_at = datetime.utcnow()

    db.commit()
    
    log_activity(
        db=db,
        user_id=str(current_user.id),
        action_type=ActionType.decline_event,
        description=f"{current_user.firstname} {current_user.lastname} declined event '{event.title}'",
        target_user_id=None,
        meta_data={
            "event_id": str(event.id),
            "event_title": event.title,
            "location": event.location,
            "start_date": event.start_date.isoformat(),
            "end_date": event.end_date.isoformat()
        }
    )
    
    return {"message": "Attendance declined successfully."}