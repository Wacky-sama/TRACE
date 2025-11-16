import base64
import io
import json
import uuid
from datetime import datetime, timezone, time
from uuid import UUID

import qrcode
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import events_models, event_attendance_models
from app.models.activity_logs_models import ActionType
from app.models.events_models import Events
from app.models.users_models import Users
from app.routes.users_routes import get_current_user
from app.schemas.event_attendance_schemas import AttendanceOut, QRScanRequest
from app.utils.activity_logger import log_activity

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

def require_role(user: Users, role: str):
    if user.role != role:
        raise HTTPException(status_code=403, detail=f"Only {role}s can perform this action.")

def get_event(db: Session, event_id: UUID):
    event = db.query(events_models.Events).filter_by(id=event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    return event

def log_event_action(db: Session, user: Users, action_type: ActionType, event: events_models.Events):
    log_activity(
        db=db,
        user_id=str(user.id),
        action_type=action_type,
        description=f"{user.firstname} {user.lastname} {action_type.value.replace('_', ' ')} event '{event.title}'",
        target_user_id=None,
        meta_data={
            "event_id": str(event.id),
            "event_title": event.title,
            "location": event.location,
            "start_date": event.start_date.isoformat(),
            "end_date": event.end_date.isoformat()
        }
    )

def get_attendance_record(db: Session, event_id: UUID, user_id: UUID, create_if_missing=False):
    record = db.query(event_attendance_models.EventAttendance).filter_by(
        event_id=event_id,
        user_id=user_id
    ).first()
    if not record and create_if_missing:
        record = event_attendance_models.EventAttendance(
            event_id=event_id,
            user_id=user_id,
            status="registered"
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    return record

@router.post("/scan")
def scan_qr(body: QRScanRequest, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    require_role(current_user, "admin")

    # Fetch attendance record by QR token
    record = db.query(event_attendance_models.EventAttendance).filter_by(qr_token=body.token).first()
    if not record:
        raise HTTPException(status_code=404, detail="QR code not found.")

    if not record.is_valid:
        if record.scanned_at:
            raise HTTPException(status_code=400, detail="QR already scanned at {}".format(record.scanned_at))
        else:
            raise HTTPException(status_code=400, detail="QR invalid")

    # Fetch the associated event
    event = get_event(db, record.event_id)

    # Compare datetime safely
    now = datetime.now()
    event_start = datetime.combine(event.start_date, event.start_time_startday or time.min)
    event_end   = datetime.combine(event.end_date, event.end_time_endday or time.max)

    if now < event_start:
        raise HTTPException(status_code=400, detail="Event hasn't started yet")
    if now > event_end:
        raise HTTPException(status_code=400, detail="Event has already ended")

    # Validate QR
    if not record.is_valid:
        raise HTTPException(status_code=400, detail="QR already used or invalid.")

    # Mark attendance
    record.is_valid = False
    record.scanned_at = now
    record.attended_at = now
    db.commit()

    return {"message": f"Attendance for {record.user.firstname} {record.user.lastname} validated successfully."}

@router.post("/{event_id}", response_model=AttendanceOut)
def attend_event(event_id: UUID, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    require_role(current_user, "alumni")
    event = get_event(db, event_id)

    record = get_attendance_record(db, event_id, current_user.id, create_if_missing=True)

    log_event_action(db, current_user, ActionType.attend_event, event)
    return record

@router.post("/{event_id}/accept")
def generate_qr_code(event_id: UUID, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    require_role(current_user, "alumni")
    event = get_event(db, event_id)

    record = get_attendance_record(db, event_id, current_user.id)
    if not record:
        raise HTTPException(status_code=400, detail="You must attend the event before generating a QR code.")

    if not record.qr_token:
        record.qr_token = str(uuid.uuid4())
        db.commit()
        db.refresh(record)

    qr_data = json.dumps({"token": record.qr_token})
    buf = io.BytesIO()
    qrcode.make(qr_data).save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {"qr_code": qr_b64, "token": record.qr_token}

@router.post("/{event_id}/decline")
def decline_event(event_id: UUID, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    require_role(current_user, "alumni")
    event = get_event(db, event_id)

    record = get_attendance_record(db, event_id, current_user.id)
    if not record:
        record = event_attendance_models.EventAttendance(
            event_id=event_id,
            user_id=current_user.id,
            status="declined"
        )
        db.add(record)
    else:
        record.status = "declined"

    db.commit()
    db.refresh(record)

    log_event_action(db, current_user, ActionType.decline_event, event)
    return record

@router.get("/my-status")
def get_my_attendance_status(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    records = db.query(event_attendance_models.EventAttendance).filter_by(user_id=current_user.id).all()
    return [{"event_id": str(r.event_id), "status": r.status} for r in records]
