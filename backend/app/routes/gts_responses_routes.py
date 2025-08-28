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
@router.post("/register/alumni/{user_id}", response_model=GTSResponseOut)
def create_gts_response(
    user_id: UUID,
    request: GTSResponseCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    gts = GTSResponse(
        user_id=user_id,
        permanent_address=user.permanent_address,
        ever_employed=request.ever_employed,
        is_employed=request.is_employed,
        employment_status=request.employment_status,
        place_of_work=request.place_of_work,
        company_name=request.company_name,
        company_address=request.company_address,
        occupation=request.occupation,
    )
    db.add(gts)
    db.commit()
    db.refresh(gts)
    return gts
