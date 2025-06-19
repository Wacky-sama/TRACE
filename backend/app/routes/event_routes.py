from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import select
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

def get_events_by_status(db: Session, status: str):
    creator = aliased(User)
    results = (
        db.query(event_models.Event, creator.firstname, creator.lastname)
        .join(creator, event_models.Event.created_by == creator.id)
        .filter(event_models.Event.status == status)
        .all()
    )

    return [
        event_schemas.EventOut(
            **{**event.__dict__, "created_by_name": f"{firstname} {lastname}"}
        )
        for event, firstname, lastname in results
    ]


@router.get("/pending", response_model=list[event_schemas.EventOut])
def get_pending_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_events_by_status(db, "pending")

@router.get("/approved", response_model=list[event_schemas.EventOut])
def get_approved_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_events_by_status(db, "approved")

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
    return event
