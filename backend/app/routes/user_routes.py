from fastapi import APIRouter,  BackgroundTasks, Body, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status
from typing import List, Optional
from app.config import settings
from app.database import get_db
from app.models.user_models import User, UserRole
from app.schemas.user_schemas import UserCreate, UserOut, UserPendingApprovalOut, PaginatedUserResponse, UserProfileOut
from app.utils.email_sender import send_email
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token
from datetime import timedelta, datetime

router = APIRouter()

# Login with username or email; returns JWT token and user role
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
        raise HTTPException(status_code=403, detail="Access Denied!")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)  
    token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"token": token, "role": user.role, "username": user.username, "is_approved": user.is_approved}

# Dependency to get the current user from JWT token
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

 # Admin-only route to create Admin or Event Organizer accounts (limits: 2 Admins, 5 Organizers)
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

    role_display_names = {
        UserRole.admin: "Administrator",
        UserRole.organizer: "Event Organizer",
    }
    display_role = role_display_names.get(new_user.role, new_user.role.value)

    subject = "TRACE System - Account Created"
    body = f"""\
    Hello {new_user.firstname},

    An account has been created for you on the TRACE System.

    Username: {new_user.username}
    Password: {user_data.password}
    Role: {display_role}

    Please log in and change your password immediately.

    Best regards,  
    TRACE Team
    """

    background_tasks.add_task(send_email, to_email=new_user.email, subject=subject, body=body)

    return new_user

# Public endpoint for alumni registration (requires admin approval)
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
    body = f"""\
    Hello {new_user.firstname},

    Thank you for registering as an Alumni. Your registration is under review.  
    We will notify you once it is approved.

    Best regards,  
    TRACE Team
    """

    background_tasks.add_task(send_email, to_email=new_user.email, subject=subject, body=body)

    return new_user

# List all unapproved alumni registrations
@router.get("/pending-alumni", response_model=List[UserPendingApprovalOut])
def get_pending_alumni(db: Session = Depends(get_db)):
    pending_alumni = db.query(User).filter(User.role == UserRole.alumni, User.is_approved == False).all()
    return pending_alumni

# List approved, non-archived users with optional filters (role, course, batch year)
@router.get("/registered-users", response_model=PaginatedUserResponse)
def get_registered_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    course: Optional[str] = None,
    batch_year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(
        User.is_approved == True,
        User.deleted_at.is_(None)
    )

    if role:
        query = query.filter(User.role == role)
    if course:
        query = query.filter(User.course == course)
    if batch_year:
        query = query.filter(User.batch_year == batch_year)

    total = query.count()
    pages = (total + limit - 1) // limit

    users = query.offset((page - 1) * limit).limit(limit).all()

    now = datetime.utcnow()
    five_minutes_ago = now - timedelta(minutes=5)

    users_out = []
    for user in users:
        user_data = UserProfileOut.from_orm(user).dict()
        user_data["is_online"] = user.last_seen and user.last_seen > five_minutes_ago
        users_out.append(user_data)

    return {
        "users": users_out,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

#  Set user as inactive (block); user must not be archived
@router.patch("/{user_id}/block", status_code=204)
def block_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit() 

# Reactivate a previously blocked user
@router.patch("/{user_id}/unblock", status_code=204)
def unblock_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()

# Soft-delete user by setting deleted_at timestamp
@router.delete("/{user_id}/delete", status_code=204)
def soft_delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.deleted_at = datetime.utcnow()
    db.commit()

# Approve pending user (typically alumni registration)
@router.patch("/{user_id}/approve", status_code=status.HTTP_204_NO_CONTENT)
def approve_user(user_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved")

    user.is_approved = True
    db.commit()

    subject = "Your Alumni Account Has Been Approved"
    body = f"""\
    Dear {user.lastname}, {user.firstname},

    We are pleased to inform you that your registration to the TRACE System has been approved.

    You may now log in using your credentials to access the alumni dashboard.

    If you have any questions, feel free to contact us.

    Best regards,  
    TRACE Team
    """

    background_tasks.add(send_email, user.email, subject, body)

    return

# Decline pending user by deleting record (only if not yet approved)
@router.patch("/{user_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
def decline_user(user_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved, can't decline")

    subject = "Alumni Registration Status"
    body = f"""\
    Dear {user.firstname} {user.lastname},

    Thank you for your interest in joining our Alumni System.

    After reviewing your registration, we regret to inform you that your request has not been approved at this time.

    Sincerely,  
    Alumni Registration Team
    """

    background_tasks.add_task(send_email, user.email, subject, body)

    db.delete(user)
    db.commit()
    return

# Get total user count and counts per role
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
# Count users who are active and not archived (i.e., not blocked or soft-deleted)
@router.get("/active")
def get_active_users(db: Session = Depends(get_db)):
    active_users = db.query(User).filter(User.is_active == True, User.deleted_at.is_(None)).count()
    return {"active_users": active_users}

# Count users who are blocked (inactive) but not archived
@router.get("/blocked")
def get_blocked_users(db: Session = Depends(get_db)):
    blocked_users = db.query(User).filter(User.is_active == False, User.deleted_at.is_(None)).count()
    return {"blocked_users": blocked_users}

# Count soft-deleted users (i.e., users with a non-null deleted_at)
@router.get("/archived")
def get_archived_users(db: Session = Depends(get_db)):
    archived_users = db.query(User).filter(User.deleted_at.isnot(None)).count()
    return {"archived_users": archived_users}

# Get users active in the last 5 minutes, not blocked or archived, with valid roles
@router.get("/online", response_model=List[UserOut])
def get_online_users(db: Session = Depends(get_db)):    
    five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
    online_users = db.query(User).filter(
        User.last_seen >= five_minutes_ago,
        User.is_active == True,
        User.deleted_at.is_(None),
        User.role.in_([UserRole.admin, UserRole.alumni, UserRole.organizer])
    ).all()

    return online_users

# Get current user
@router.get("/me", response_model=UserProfileOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user