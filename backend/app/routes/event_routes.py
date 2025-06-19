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
