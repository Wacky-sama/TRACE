from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from uuid import UUID
from datetime import datetime
from app.database import get_db
from app.routes.users_routes import get_current_user  
from app.models.users_models import Users 
from app.models.events_models import Events
from app.schemas.events_schemas import EventOut, EventAction, EventCreate

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.post("/", response_model=EventOut)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)  
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Admin can create events.")

    new_event = Events(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        start_date=event_in.start_date,
        end_date=event_in.end_date,
        created_by=current_user.id,
        status="approved",  # Default status for created events
        created_at=datetime.utcnow()
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def get_events_by_status(db, status, skip=0, limit=100):
    creator = aliased(Users)
    results = (
        db.query(Events, creator.firstname, creator.lastname)
        .join(creator, Events.created_by == creator.id)
        .filter(Events.status == status)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        EventOut(
            **{**event.__dict__, "created_by_name": f"{firstname} {lastname}"}
        )
        for event, firstname, lastname in results
    ]

@router.get("/", response_model=list[EventOut])
def get_events(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    if current_user.role not in {"admin", "alumni"}:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_events_by_status(db, "approved")

@router.post("/{event_id}/{action}")
def update_event_status(
    event_id: UUID,
    action: EventAction,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.status = action.to_db()
    db.commit()
    db.refresh(event)
    return {
    "message": f"Event {action}d successfully",
    "event": EventOut.from_orm(event)
}

@router.delete("/{event_id}")
def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: UUID,
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.title = event_in.title
    event.description = event_in.description
    event.location = event_in.location
    event.start_date = event_in.start_date
    event.end_date = event_in.end_date

    db.commit()
    db.refresh(event)
    return event