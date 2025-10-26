from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.users_models import Users
from app.models.gts_responses_models import GTSResponses
from app.utils.auth import get_current_user
from app.schemas.gts_responses_schemas import (
    GTSResponsesCreate, GTSResponsesOut, 
    GTSResponsesPersonalUpdate, GTSResponsesEducationalUpdate,
    GTSResponsesTrainingUpdate, GTSResponsesEmploymentUpdate,
    GTSResponsesJobSatisfactionUpdate, GTSResponsesServicesUpdate, 
    GTSResponsesProblemsUpdate)
from uuid import UUID

router = APIRouter(
    prefix="/gts_responses",
    tags=["GTS Responses"]
)

def parse_pg_array(value):
    if isinstance(value, str) and value.startswith('{') and value.endswith('}'):
        inner = value[1:-1]
        if '","' in inner:  
            items = inner.split('","')
            items[0] = items[0].lstrip('"')
            items[-1] = items[-1].rstrip('"')
            return [i.strip() for i in items if i.strip()]
        else: 
            return [i.strip().strip('"') for i in inner.split(',') if i.strip()]
    return value if isinstance(value, list) else (value or [])

# View all responses (admin only)
@router.get("/", response_model=List[GTSResponsesOut])
def get_all_responses(
    db: Session = Depends(get_db)
):
    responses = db.query(GTSResponses).all()
    for resp in responses:
        resp.occupation = parse_pg_array(resp.occupation)
        resp.non_employed_reasons = parse_pg_array(resp.non_employed_reasons)
    return responses

# Create new GTS response (used internally during registration)
@router.post("/register/alumni/{user_id}", tags=["public"], response_model=GTSResponsesOut)
def create_initial_gts_response(
    user_id: UUID,
    gts_data: GTSResponsesCreate,
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

    gts_responses = GTSResponses(
        user_id=user_id,
        full_name=full_name,
        contact_email=user.email,
        mobile=user.contact_number,
        sex=user.sex,
        birthday=user.birthday,
        permanent_address=user.permanent_address,
        present_address=user.present_address,
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
    
    gts_responses.occupation = parse_pg_array(gts_responses.occupation)
    gts_responses.non_employed_reasons = parse_pg_array(gts_responses.non_employed_reasons)
    
    return gts_responses

# Alumni see their own GTS response
@router.get("/me", response_model=GTSResponsesOut)
def get_my_gts_response(
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    gts_responses = db.query(GTSResponses).filter(GTSResponses.user_id == current_user.id).first()
    if not gts_responses:
        raise HTTPException(status_code=404, detail="No GTS response found")

    gts_responses.occupation = parse_pg_array(gts_responses.occupation)
    gts_responses.non_employed_reasons = parse_pg_array(gts_responses.non_employed_reasons)
    
    return gts_responses

# A. Update Personal Info
@router.put("/{gts_id}/personal", response_model=GTSResponsesOut)
def update_gts_response(
    gts_id: UUID, 
    updated_data: GTSResponsesPersonalUpdate, 
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id, 
        GTSResponses.user_id == current_user.id
    ).first()
    
    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")
    
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)
        
    db.commit()
    db.refresh(gts)
    
    gts.occupation = parse_pg_array(gts.occupation)
    gts.non_employed_reasons = parse_pg_array(gts.non_employed_reasons)
    
    return gts

# B. Update Educational Background
@router.put("/{gts_id}/educational", response_model=GTSResponsesOut)
def update_educational_info(
    gts_id: UUID,
    updated_data: GTSResponsesEducationalUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()
    
    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")
    
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)
        
    db.commit()
    db.refresh(gts)
    
    gts.occupation = parse_pg_array(gts.occupation)
    gts.non_employed_reasons = parse_pg_array(gts.non_employed_reasons)
    gts.pursued_advance_degree_reasons = parse_pg_array(gts.pursued_advance_degree_reasons)
    
    return gts

# C. Update Training(s) Advance Studies Attended After College
@router.put("/{gts_id}/trainings", response_model=GTSResponsesOut)
def update_trainings_info(
    gts_id: UUID,
    updated_data: GTSResponsesTrainingUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()
    
    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")

    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)
    
    db.commit()
    db.refresh(gts)
    
    # Parse other arrays for consistency
    gts.occupation = parse_pg_array(gts.occupation)
    gts.non_employed_reasons = parse_pg_array(gts.non_employed_reasons)

    return gts

# D. Update Employment Info
@router.put("/{gts_id}/employment", response_model=GTSResponsesOut)
def update_employment_info(
    gts_id: UUID,
    updated_data: GTSResponsesEmploymentUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()
    
    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")
    
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)
        
    db.commit()
    db.refresh(gts)
    
    gts.occupation = parse_pg_array(gts.occupation)
    gts.non_employed_reasons = parse_pg_array(gts.non_employed_reasons)
    
    return gts

# E. Update Job Satisfaction
@router.put("/{gts_id}/job-satisfaction", response_model=GTSResponsesOut)
def update_job_satisfaction(
    gts_id: UUID,
    updated_data: GTSResponsesJobSatisfactionUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()

    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")

    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)

    db.commit()
    db.refresh(gts)
    return gts

# F. Update Services from CSU
@router.put("/{gts_id}/services", response_model=GTSResponsesOut)
def update_services_from_csu(
    gts_id: UUID,
    updated_data: GTSResponsesServicesUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()

    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")

    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)

    db.commit()
    db.refresh(gts)
    return gts

# G. Update Problems, Issues and Concerns
@router.put("/{gts_id}/problems", response_model=GTSResponsesOut)
def update_problems_issues(
    gts_id: UUID,
    updated_data: GTSResponsesProblemsUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    gts = db.query(GTSResponses).filter(
        GTSResponses.id == gts_id,
        GTSResponses.user_id == current_user.id
    ).first()

    if not gts:
        raise HTTPException(status_code=404, detail="GTS Response not found")

    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(gts, key, value)

    db.commit()
    db.refresh(gts)
    return gts
