from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Body
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.models.user import User
from app.database import SessionLocal
from app.utils.email_sender import send_email
from app.utils.security import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(
    identifier: str = Body(..., embed=True),  # username or email from your frontend
    password: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username/email or password")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username/email or password")

    access_token_expires = timedelta(minutes=60)  # or load from env
    token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"token": token}

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