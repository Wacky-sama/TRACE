from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.models.user import User
from app.database import SessionLocal
from app.utils.email_sender import send_email
from app.utils.security import hash_password

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register/alumni", response_model=UserOut)
def register_alumni(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    is_approved = user.role in ("admin", "organizer")

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        lastname=user.lastname,
        firstname=user.firstname,
        middle_initial=user.middle_initial,
        course=user.course,
        batch_year=user.batch_year,
        role=user.role,
        is_approved=is_approved
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    subject = "TRACE System - Registration Received"
    body = f"Hello {new_user.firstname},\n\nThank you for registering as an Alumni. Your registration is under review. We will notify you once approved.\n\nBest regards,\nTRACE Team"

    background_tasks.add_task(send_email, to_email=new_user.email, subject=subject, body=body)

    return new_user
