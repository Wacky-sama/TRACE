from fastapi import APIRouter,  BackgroundTasks, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from starlette import status
from typing import List
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut, UserLogin, UserPendingApprovalOut, UserProfileOut
from app.models.user import User, UserRole
from app.database import SessionLocal
from app.utils.email_sender import send_email
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token
from datetime import timedelta, datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(
    identifier: str = Body(..., embed=True),
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
    
    if not user.is_active or user.deleted_at:
        raise HTTPException(status_code=403, detail="User is blocked or deleted")

    access_token_expires = timedelta(minutes=60)  # or load from env
    token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"token": token, "role": user.role}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/admin/create-user", response_model=UserOut, status_code=201)
def create_user_as_admin(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Only admins can create users")

    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    admin_count = db.query(User).filter(User.role == UserRole.admin).count()
    organizer_count = db.query(User).filter(User.role == UserRole.organizer).count()

    if user_data.role == UserRole.admin and admin_count >= 2:
        raise HTTPException(status_code=400, detail="Maximum number of Admins (2) reached")

    if user_data.role == UserRole.organizer and organizer_count >= 5:
        raise HTTPException(status_code=400, detail="Maximum number of Event Organizers (5) reached")

    if user_data.role == UserRole.alumni:
        raise HTTPException(status_code=400, detail="Alumni cannot be created by admin, please register via alumni route")

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        lastname=user_data.lastname,
        firstname=user_data.firstname,
        middle_initial=user_data.middle_initial,
        role=user_data.role,
        is_approved=True 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    subject = "TRACE System - Account Created"
    body = f"Hello {new_user.firstname},\n\nAn account has been created for you on the TRACE System. \n\nUsername: {new_user.username}\nPassword: {user_data.password}\n\nPlease log in and change your password immediately.\n\nBest regards, \nTRACE Team"

    background_tasks.add_task(send_email, to_email=new_user.email, subject=subject, body=body)

    return new_user

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

@router.get("/pending-alumni", response_model=List[UserPendingApprovalOut])
def get_pending_alumni(db: Session = Depends(get_db)):
    pending_alumni = db.query(User).filter(User.role == UserRole.alumni, User.is_approved == False).all()
    return pending_alumni

@router.get("/registered-users", response_model=List[UserProfileOut])
def get_registered_users(db: Session = Depends(get_db)):
    registered_users = db.query(User).filter(User.is_approved == True, User.role.in_([UserRole.alumni, UserRole.organizer]), User.deleted_at.is_(None)).all()
    return registered_users

@router.patch("/{user_id}/block", status_code=204)
def block_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit() 

@router.patch("/{user_id}/unblock", status_code=204)
def unblock_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()

@router.delete("/{user_id}", status_code=204)
def soft_delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.deleted_at = datetime.utcnow()
    db.commit()

@router.patch("/{user_id}/approve", status_code=status.HTTP_204_NO_CONTENT)
def approve_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved")

    user.is_approved = True
    db.commit()
    return

@router.patch("/{user_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
def decline_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved, can't decline")

    db.delete(user)
    db.commit()
    return

@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    admins = db.query(User).filter(User.role == UserRole.admin).count()
    organizers = db.query(User).filter(User.role == UserRole.organizer).count()
    alumni = db.query(User).filter(User.role == UserRole.alumni).count()
    
    return {
        "total_users": total_users,
        "admins": admins,
        "organizers": organizers,
        "alumni": alumni
    }
