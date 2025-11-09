import re
from uuid import UUID
from fastapi import APIRouter,  BackgroundTasks, Depends, HTTPException, Query 
from sqlalchemy.orm import Session 
from sqlalchemy.exc import SQLAlchemyError 
from starlette import status 
from typing import List, Optional
from app.config import settings
from app.database import get_db
from app.models.activity_logs_models import ActionType
from app.models.users_models import Users, UserRole
from app.models.gts_responses_models import GTSResponses
from app.schemas.users_schemas import (ChangePasswordRequest,
                                      EmailCheckRequest,
                                      EmailCheckResponse,
                                      UsernameCheckRequest, 
                                      UsernameCheckResponse,
                                      UserLogin,
                                      AdminUserCreate, 
                                      AlumniRegister, 
                                      UserOut, 
                                      UserPendingApprovalOut, 
                                      PaginatedUserResponse,
                                      TokenResponse, 
                                      UserProfileOut)
from app.utils.activity_logger import log_activity
from app.utils.auth import get_current_user
from app.utils.email_sender import send_email
from app.utils.security import hash_password, verify_password, create_access_token
from datetime import timedelta, datetime, timezone

router = APIRouter(
    prefix="/users", 
    tags=["Users"]
)

# Email check
@router.post("/check-email", response_model=EmailCheckResponse, tags=["public"])
def check_email_availability(
    request: EmailCheckRequest,
    db: Session = Depends(get_db)
):
    email = request.email.strip().lower()
    
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return EmailCheckResponse(
            available=False,
            message="Invalid Email Format"
        )
        
    existing_user = db.query(Users).filter(
        Users.email.ilike(email),
        Users.deleted_at.is_(None)
    ).first()
        
    if existing_user:
        return EmailCheckResponse(
            available=False,
            message="Email is already taken"
        )
            
    return EmailCheckResponse(
        available=True,
        message="Email is available"
    )

# Username check
@router.post("/check-username", response_model=UsernameCheckResponse, tags=["public"])
def check_username_availability(
    request: UsernameCheckRequest,
    db: Session = Depends(get_db)
):
    username = request.username.strip()

    if len(username) < 3:
        return UsernameCheckResponse(
            available=False,
            message="Username must be at least 3 characters"
        )

    existing_user = db.query(Users).filter(
        Users.username.ilike(username),
        Users.deleted_at.is_(None)
    ).first()
        
    if existing_user:
        return UsernameCheckResponse(
            available=False,
            message="Username is already taken"
        )
    
    return UsernameCheckResponse(
        available=True,
        message="Username is available"
    )

# Login with username or email; returns JWT token and user role
@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Users).filter(
        (Users.username == credentials.identifier) | (Users.email == credentials.identifier)
    ).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username/email or password")

    if not user.is_active or user.deleted_at:
        raise HTTPException(status_code=403, detail="Access Denied!")

    token = create_access_token(
        data={"sub": user.username, "role": user.role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    log_activity(
        db=db,
        user_id=user.id,
        action_type=ActionType.login,
        description=f"{user.role.value.capitalize()} - {user.firstname} {user.lastname} logged in",
        created_at=datetime.now(timezone.utc),
    )

    return TokenResponse(
        token=token,
        role=user.role,
        username=user.username,
        is_approved=user.is_approved,
    )

# Admin-only route to create Admin accounts (limits: 2 Admins)
@router.post("/admin/create-user", response_model=UserOut, status_code=201)
def create_user_as_admin(
    user_data: AdminUserCreate,
    background_tasks: BackgroundTasks,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Only admins can create users")

     # Check for existing email/username
    if db.query(Users).filter(Users.email == user_data.email, Users.deleted_at.is_(None)).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(Users).filter(Users.username == user_data.username, Users.deleted_at.is_(None)).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    admin_count = db.query(Users).filter(Users.role == UserRole.admin).count()

    if user_data.role == UserRole.admin and admin_count >= 2:
        raise HTTPException(status_code=400, detail="Maximum number of Admins (2) reached")

    if user_data.role == UserRole.alumni:
        raise HTTPException(status_code=400, detail="Alumni cannot be created by admin, please register via alumni route")

    new_user = Users(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        lastname=user_data.lastname,
        firstname=user_data.firstname,
        middle_initial=user_data.middle_initial,
        name_extension=user_data.name_extension,
        sex=user_data.sex,
        role=UserRole.admin,
        is_approved=True 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            action_type=ActionType.register,
            description=f"Admin created account for {new_user.firstname} {new_user.lastname} ({new_user.role.value})",
            target_user_id=new_user.id
        )
    except Exception as e:
         print(f"Error logging activity: {e}")
    role_display_name = {
        UserRole.admin: "Administrator",
    }
    display_role = role_display_name.get(new_user.role, new_user.role.value)

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
@router.post("/register/alumni", tags=["public"], response_model=UserOut)
def register_alumni(
    user_data: AlumniRegister,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check for existing email/username
    if db.query(Users).filter(Users.email == user_data.email, Users.deleted_at.is_(None)).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(Users).filter(Users.username == user_data.username, Users.deleted_at.is_(None)).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    try:
        # Create and save new alumni user
        new_user = Users(
            username=user_data.username,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            lastname=user_data.lastname,
            firstname=user_data.firstname,
            middle_initial=user_data.middle_initial,
            name_extension=user_data.name_extension,
            birthday=user_data.birthday,
            present_address=user_data.present_address,
            permanent_address=user_data.permanent_address,
            contact_number=user_data.contact_number,
            course=user_data.course,
            batch_year=user_data.batch_year,
            sex=user_data.sex,
            role=UserRole.alumni,
            is_approved=False,
        )
        db.add(new_user)
        db.flush()
    
        # Log alumni self-registration
        log_activity(
            db=db,
            user_id=new_user.id,
            action_type=ActionType.register,
            description=f"Alumni {new_user.firstname} {new_user.lastname} registered an account"
        )
        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

    # Send confirmation email
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
    pending_alumni = db.query(Users).filter(Users.role == UserRole.alumni, Users.is_approved == False).all()
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
    query = db.query(Users).filter(
        Users.is_approved == True,
        Users.deleted_at.is_(None)
    )

    # Optional filters
    if role:
        try:
            role_enum = UserRole(role)
            query = query.filter(Users.role == role_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid role")

    if course:
        query = query.filter(Users.course == course)
    if batch_year:
        query = query.filter(Users.batch_year == batch_year)

    # Pagination
    total = query.count()
    pages = (total + limit - 1) // limit
    users = query.offset((page - 1) * limit).limit(limit).all()

    # Determine online status (active in last 5 minutes)
    now = datetime.utcnow()
    five_minutes_ago = now - timedelta(minutes=5)

    users_out = []
    for user in users:
        user_data = UserProfileOut.from_orm(user).dict()
        user_data["is_online"] = user.last_seen and user.last_seen > five_minutes_ago
        user_data["is_active"] = user.is_active
        users_out.append(user_data)

    return {
        "users": users_out,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

# Set user as inactive (block); user must not be archived
@router.patch("/{user_id}/block", status_code=204)
def block_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit() 
    # Log blocking action
    log_activity(
        db=db,
        user_id=str(user.id),
        action_type=ActionType.update,
        description=f"Blocked user - {user.firstname} {user.lastname}",
        target_user_id=str(user.id)
    )
 
# Reactivate a previously blocked user
@router.patch("/{user_id}/unblock", status_code=204)
def unblock_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    log_activity(
        db=db,
        user_id=str(user.id),
        action_type=ActionType.update,
        description=f"Unblocked user - {user.firstname} {user.lastname}",
        target_user_id=str(user.id)
    )

# Archive user by setting deleted_at timestamp
@router.delete("/{user_id}/archive", status_code=204)
def archive_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user or user.deleted_at:
        raise HTTPException(status_code=404, detail="User not found")
    user.deleted_at = datetime.utcnow()
    db.commit()
    log_activity(
        db=db,
        user_id=str(user.id),
        action_type=ActionType.delete,
        description=f"Archived user - {user.firstname} {user.lastname}",
        target_user_id=str(user.id)
    )
    
# Unarchive a user by unsetting deleted_at
@router.patch("/{user_id}/unarchive", status_code=204)
def unarchive_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.deleted_at:
        raise HTTPException(status_code=400, detail="User is not archived")
    user.deleted_at = None  # Unset the timestamp
    db.commit()
    # Log unarchiving action
    log_activity(
        db=db,
        user_id=str(user.id),
        action_type=ActionType.update,
        description=f"Unarchived user - {user.firstname} {user.lastname}",
        target_user_id=str(user.id)
    )    

# Approve pending user (typically alumni registration)
@router.patch("/{user_id}/approve", status_code=status.HTTP_204_NO_CONTENT)
def approve_user(
    user_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    user = db.query(Users).filter(Users.id == UUID(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved")

    try:
        user.is_approved = True
        existing_gts = db.query(GTSResponses).filter(GTSResponses.user_id == user.id).first()

        if existing_gts:
            full_name = f"{user.firstname} {user.middle_initial + '.' if user.middle_initial else ''} {user.lastname} {user.name_extension or ''}".strip()
            existing_gts.full_name = full_name
            existing_gts.degree = user.course
            existing_gts.sex = user.sex
            existing_gts.present_address = user.present_address
        else:
            gts_response = GTSResponses(
                user_id=user.id,
                full_name=f"{user.firstname} {user.lastname}",
                permanent_address=user.permanent_address,
                present_address=user.present_address,
                birthday=user.birthday,
                degree=user.course,
            )
            db.add(gts_response)

        db.commit()

        log_activity(
            db=db,
            user_id=current_user.id,
            action_type=ActionType.approve,
            description=f"Approved alumni account of {user.firstname} {user.lastname}",
            target_user_id=user.id
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve user: {str(e)}")

    subject = "Your Alumni Account Has Been Approved"
    body = f"""\
    Dear {user.lastname}, {user.firstname},

    We are pleased to inform you that your registration to the TRACE System has been approved.

    You may now log in using your credentials to access the alumni dashboard.

    Best regards,  
    TRACE Team
    """
    background_tasks.add_task(send_email, user.email, subject, body) 

# Decline pending user by deleting record (only if not yet approved)
@router.patch("/{user_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
def decline_user(
    user_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    user = db.query(Users).filter(Users.id == UUID(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_approved:
        raise HTTPException(status_code=400, detail="User already approved, can't decline")
    try:
        db.query(GTSResponses).filter(GTSResponses.user_id == user.id).delete()

        log_activity(
            db=db,
            user_id=current_user.id, 
            action_type=ActionType.decline,
            description=f"Declined alumni registration of {user.firstname} {user.lastname}",
            target_user_id=user.id,
            meta_data=None
        )
        
        db.delete(user)
        db.commit()
        
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to decline user: {str(e)}")
        
    subject = "Alumni Registration Status"
    body = f"""\
    Dear {user.firstname} {user.lastname},

    Thank you for your interest in joining our Alumni System.

    After reviewing your registration, we regret to inform you that your request has not been approved at this time.

    Sincerely,  
    Alumni Registration Team
    """
    background_tasks.add_task(send_email, user.email, subject, body)

# Get total user count and counts per role
@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db)):
    total_users = db.query(Users).count()
    admins = db.query(Users).filter(Users.role == UserRole.admin).count()
    alumni = db.query(Users).filter(Users.role == UserRole.alumni).count()
    
    return {
        "total_users": total_users,
        "admins": admins,
        "alumni": alumni
    }
# Count users who are active and not archived (i.e., not blocked or soft-deleted)
@router.get("/active")
def get_active_users(db: Session = Depends(get_db)):
    active_users = db.query(Users).filter(Users.is_active == True, Users.deleted_at.is_(None)).count()
    return {"active_users": active_users}

# Count users who are blocked (inactive) but not archived
@router.get("/blocked")
def get_blocked_users(db: Session = Depends(get_db)):
    blocked_users = db.query(Users).filter(Users.is_active == False, Users.deleted_at.is_(None)).count()
    return {"blocked_users": blocked_users}

# Count soft-deleted users (i.e., users with a non-null deleted_at)
@router.get("/archived")
def get_archived_count(db: Session = Depends(get_db)):
    archived_users = db.query(Users).filter(Users.deleted_at.isnot(None)).count()
    return {"archived_users": archived_users}

# List archived users (soft-deleted) with optional filters (role, course, batch year)
@router.get("/archived-users", response_model=PaginatedUserResponse)
def get_archived_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    course: Optional[str] = None,
    batch_year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Users).filter(Users.deleted_at.isnot(None))

    if role:
        try:
            role_enum = UserRole(role)
            query = query.filter(Users.role == role_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid role")

    if course:
        query = query.filter(Users.course == course)
    if batch_year:
        query = query.filter(Users.batch_year == batch_year)

    total = query.count()
    pages = (total + limit - 1) // limit
    users = query.offset((page - 1) * limit).limit(limit).all()

    users_out = []
    for user in users:
        user_data = UserProfileOut.from_orm(user).dict()
        user_data["is_active"] = user.is_active
        users_out.append(user_data)

    return {
        "users": users_out,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

# Get users active in the last 5 minutes, not blocked or archived, with valid roles
@router.get("/online", response_model=List[UserOut])
def get_online_users(db: Session = Depends(get_db)):    
    five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
    online_users = db.query(Users).filter(
        Users.last_seen >= five_minutes_ago,
        Users.is_active == True,
        Users.is_approved == True,
        Users.deleted_at.is_(None),
        Users.role.in_([UserRole.admin, UserRole.alumni])
    ).all()

    return online_users

# Get current user
@router.get("/me", response_model=UserProfileOut)
def get_current_user_profile(current_user: Users = Depends(get_current_user)):
    return current_user

@router.post("/change-password", status_code=200)
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if request.new_password != request.confirm_new_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")

    if verify_password(request.new_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="New password cannot be the same as the current password")

    current_user.password_hash = hash_password(request.new_password)
    db.commit()

    log_activity(
        db=db,
        user_id=current_user.id,
        action_type=ActionType.update,
        description=f"{current_user.role.value.capitalize()} changed their password",
        target_user_id=current_user.id
    )

    return {"message": "Password changed successfully"}
