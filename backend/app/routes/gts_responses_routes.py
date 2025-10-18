from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.users_models import User
from app.models.gts_responses_models import GTSResponse
from app.utils.auth import get_current_user
from app.schemas.gts_responses_schemas import GTSResponseCreate, GTSResponseOut
from uuid import UUID

router = APIRouter(
    prefix="/gts_responses",
    tags=["GTS Responses"]
)

# View all responses (admin only)
@router.get("/", response_model=List[GTSResponseOut])
def get_all_responses(
    db: Session = Depends(get_db)
):
    return db.query(GTSResponse).all()


# Create new GTS response (used internally during registration)
@router.post("/register/alumni/{user_id}", tags=["public"], response_model=GTSResponseOut)
def create_initial_gts_response(
    user_id: UUID,
    gts_data: GTSResponseCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    name_parts = [
        user.firstname.strip() if user.firstname else "",
        f"{user.middle_initial.strip()}." if user.middle_initial else "",
        user.lastname.strip() if user.lastname else "",
        user.name_extension.strip() if user.name_extension else ""
    ]
    clean_parts = [part for part in name_parts if part]
    full_name = " ".join(clean_parts)

    gts_responses = GTSResponse(
        user_id=user_id,
        full_name=full_name,
        contact_email=user.email,
        mobile=user.contact_number,
        sex=user.sex,
        birthday=user.birthday,
        permanent_address=user.permanent_address,
        ever_employed=gts_data.ever_employed,
        is_employed=gts_data.is_employed,
        non_employed_reasons=gts_data.non_employed_reasons,
        employment_status=gts_data.employment_status,
        place_of_work=gts_data.place_of_work,
        company_name=gts_data.company_name,
        company_address=gts_data.company_address,
        occupation=gts_data.occupation,
    )
    db.add(gts_responses)
    db.commit()
    db.refresh(gts_responses)

    return gts_responses

# Alumni see their own GTS response
@router.get("/me", response_model=GTSResponseOut)
def get_my_gts_response(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    gts_responses = db.query(GTSResponse).filter(GTSResponse.user_id == current_user.id).first()
    if not gts_responses:
        raise HTTPException(status_code=404, detail="No GTS response found")
    return gts_responses

# Updates
@router.put("/{gts_id}", response_model=GTSResponseOut)
def update_gts_response(
    gts_id: UUID, 
    updated_data: GTSResponseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gts = db.query(GTSResponse).filter(GTSResponse.id == gts_id, GTSResponse.user_id == current_user.id).first()
    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")
    
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)
        
    db.commit()
    db.refresh(gts)
    return gts

