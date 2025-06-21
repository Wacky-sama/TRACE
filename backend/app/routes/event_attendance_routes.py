from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models import event_models, event_attendance_models
from app.routes.user_routes import get_current_user
from app.models.user_models import User
from app.schemas.event_attendance_schemas import AttendanceOut

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/{event_id}", response_model=AttendanceOut)
def attend_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "alumni":
        raise HTTPException(status_code=403, detail="Only alumni can attend events.")

    # Check for approved event
    event = db.query(event_models.Event).filter_by(id=event_id, status="approved").first()
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

    return attendance
