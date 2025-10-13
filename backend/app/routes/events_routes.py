from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from uuid import UUID
from datetime import datetime
from app.database import get_db
from app.routes.users_routes import get_current_user  
from app.models.users_models import User  
from app.models import events_models
from app.schemas import events_schemas
from app.schemas.events_schemas import EventAction

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/", response_model=events_schemas.EventOut)
def create_event(
    event_in: events_schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Admin can create events.")

    new_event = events_models.Event(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        event_date=event_in.event_date,
        created_by=current_user.id,
        status="approved",  # Default status for created events
        created_at=datetime.utcnow()
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def get_events_by_status(db, status, skip=0, limit=100):
    creator = aliased(User)
    results = (
        db.query(events_models.Event, creator.firstname, creator.lastname)
        .join(creator, events_models.Event.created_by == creator.id)
        .filter(events_models.Event.status == status)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        events_schemas.EventOut(
            **{**event.__dict__, "created_by_name": f"{firstname} {lastname}"}
        )
        for event, firstname, lastname in results
    ]

@router.get("/", response_model=list[events_schemas.EventOut])
def get_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in {"admin", "alumni"}:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_events_by_status(db, "approved")

@router.post("/{event_id}/{action}")
def update_event_status(
    event_id: UUID,
    action: EventAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(events_models.Event).filter(events_models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.status = action.to_db()
    db.commit()
    db.refresh(event)
    return {
    "message": f"Event {action}d successfully",
    "event": events_schemas.EventOut.from_orm(event)
}


@router.delete("/{event_id}")
def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(events_models.Event).filter(events_models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}


@router.put("/{event_id}", response_model=events_schemas.EventOut)
def update_event(
    event_id: UUID,
    event_in: events_schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(events_models.Event).filter(events_models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.title = event_in.title
    event.description = event_in.description
    event.location = event_in.location
    event.event_date = event_in.event_date

    db.commit()
    db.refresh(event)
    return event