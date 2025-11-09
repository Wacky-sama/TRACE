import base64
import io
import json
import uuid
from datetime import datetime, timezone
from uuid import UUID

import qrcode
from app.database import get_db
from app.models import event_attendance_models, events_models
from app.models.activity_logs_models import ActionType
from app.models.users_models import Users
from app.routes.users_routes import get_current_user
from app.schemas.event_attendance_schemas import AttendanceOut, QRScanRequest
from app.utils.activity_logger import log_activity
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/attendance", 
    tags=["Attendance"])

@router.post("/scan")
def scan_qr(
    body: QRScanRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can scan QR codes.")
    
    token = body.token
    print(f"Scanned token: {token}")

    # Find record
    record = db.query(event_attendance_models.EventAttendance).filter_by(qr_token=token).first()
    if not record:
        raise HTTPException(status_code=404, detail="QR code not found.")

    event = db.query(events_models.Events).filter_by(id=record.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")

    now = datetime.now(timezone.utc)
    if now < event.start_date:
        raise HTTPException(status_code=400, detail="Event has not started yet.")

    if not record.is_valid:
        raise HTTPException(status_code=400, detail="QR already used or invalid.")

    # Mark attendance
    record.is_valid = False
    record.scanned_at = now
    record.attended_at = now
    db.commit()

    return {"message": f"Attendance for {record.user.firstname} {record.user.lastname} validated successfully."}

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

@router.post("/{event_id}/accept")
def generate_qr_code(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # Only alumni
    if current_user.role != "alumni":
        raise HTTPException(status_code=403, detail="Only alumni can generate QR codes.")

    # Confirm event
    event = db.query(events_models.Events).filter_by(id=event_id, status="approved").first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found or not approved.")

    # Must already be registered
    record = db.query(event_attendance_models.EventAttendance).filter_by(
        event_id=event_id,
        user_id=current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=400, detail="You must attend the event first before generating a QR.")

    # Generate or reuse QR token
    if not record.qr_token:
        record.qr_token = str(uuid.uuid4())
        db.commit()
        db.refresh(record)

    # Create QR as image (Base64)
    qr_data = json.dumps({"token": record.qr_token})
    qr_img = qrcode.make(qr_data)
    buf = io.BytesIO()
    qr_img.save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {"qr_code": qr_b64, "token": record.qr_token}

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
        raise HTTPException(status_code=404, detail="Event not found")
    
    record = db.query(event_attendance_models.EventAttendance).filter_by(
        event_id=event_id,
        user_id=current_user.id
    ).first()
    
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
    
    return record

@router.get("/my-status")
def get_my_attendance_status(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    records = db.query(event_attendance_models.EventAttendance).filter_by(user_id=current_user.id).all()
    return [{"event_id": str(r.event_id), "status": r.status} for r in records]