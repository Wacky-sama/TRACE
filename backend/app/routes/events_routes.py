from datetime import datetime
from uuid import UUID

from app.database import get_db
from app.models.events_models import Events
from app.models.users_models import Users
from app.routes.users_routes import get_current_user
from app.schemas.events_schemas import EventCreate, EventOut
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

# Create Event (Admin only)
@router.post("/create-event", response_model=EventOut)
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
        start_time_startday=event_in.start_time_startday,
        end_time_startday=event_in.end_time_startday,
        start_time_endday=event_in.start_time_endday,
        end_time_endday=event_in.end_time_endday,
        created_by=current_user.id,
        created_at=datetime.utcnow()
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    return new_event

# Get All Events (Admin + Alumni)
@router.get("/", response_model=list[EventOut])
def get_events(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role not in {"admin", "alumni"}:
        raise HTTPException(status_code=403, detail="Not authorized")

    creator = aliased(Users)
    results = (
        db.query(Events, creator.firstname, creator.lastname)
        .join(creator, Events.created_by == creator.id)
        .order_by(Events.start_date.asc())
        .all()
    )

    event_list = []
    now = datetime.now()  # current timestamp
    for event, firstname, lastname in results:
        event_start = datetime.combine(event.start_date, datetime.min.time())
        is_upcoming = now < event_start

        event_out = EventOut(
            **{**event.__dict__, "created_by_name": f"{firstname} {lastname}"}
        )
        # add a new property for frontend use
        event_out.is_upcoming = is_upcoming  
        event_list.append(event_out)

    return event_list

# Update Event (Admin only)
@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: UUID,
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    event = db.query(Events).filter(Events.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    for field, value in event_in.dict(exclude_unset=True).items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    
    return event

# Delete Event (Admin only)
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
