from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from app.database import get_db
from app.routes.user_routes import get_current_user  
from app.models.user_models import User  
from app.models import event_models
from app.schemas import event_schemas

router = APIRouter()

@router.post("/", response_model=event_schemas.EventOut)
def create_event(
    event_in: event_schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Only event organizers can create events.")

    new_event = event_models.Event(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        event_date=event_in.event_date,
        created_by=current_user.id,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/pending", response_model=list[event_schemas.EventOut])
def get_pending_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    events = db.query(event_models.Event).filter(event_models.Event.status == "pending").all()
    result = []
    for event in events:
        creator = db.query(User).filter(User.id == event.created_by).first()
        event_data = event.__dict__.copy()
        event_data["created_by_name"] = f"{creator.firstname} {creator.lastname}" if creator else None
        result.append(event_data)
    return result

@router.get("/approved", response_model=list[event_schemas.EventOut])
def get_approved_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    events = db.query(event_models.Event).filter(event_models.Event.status == "approved").all()
    result = []
    for event in events:
        creator = db.query(User).filter(User.id == event.created_by).first()
        event_data = event.__dict__.copy()
        event_data["created_by_name"] = f"{creator.firstname} {creator.lastname}" if creator else None
        result.append(event_data)
    return result

@router.post("/{event_id}/{action}")
def update_event_status(
    event_id: UUID,
    action: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(event_models.Event).filter(event_models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if action not in ("approve", "decline"):
        raise HTTPException(status_code=400, detail="Invalid action")

    event.status = "approved" if action == "approve" else "declined"
    db.commit()
    db.refresh(event)
    return {"message": f"Event {action}d successfully", "event": event}
