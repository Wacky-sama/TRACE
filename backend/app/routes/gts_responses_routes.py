from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user_models import User
from app.models.gts_responses_models import GTSResponse
from app.schemas.gts_responses_schemas import GTSResponseCreate, GTSResponseOut
from uuid import UUID

router = APIRouter(
    prefix="/gts_responses",
    tags=["GTS Responses"]
)

# Create new GTS response (used internally during registration)
@router.post("/register/alumni/{user_id}", tags=["public"], response_model=GTSResponseOut)
def create_gts_response(
    user_id: UUID,
    gts_data: GTSResponseCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    gts_response = GTSResponse(
        user_id=user_id,
        full_name=f"{user.firstname} {user.middle_initial} {user.lastname} {user.name_extension}",
        contact_email=user.email,
        mobile=user.contact_number,
        sex=user.sex,
        birthday=user.birthday,
        permanent_address=user.permanent_address,
        ever_employed=gts_data.ever_employed,
        is_employed=gts_data.is_employed,
        employment_status=gts_data.employment_status,
        place_of_work=gts_data.place_of_work,
        company_name=gts_data.company_name,
        company_address=gts_data.company_address,
        occupation=gts_data.occupation,
    )
    db.add(gts_response)
    db.commit()
    db.refresh(gts_response)

    return gts_response
