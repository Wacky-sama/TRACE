# app/routes/admin_analytics_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.gts_responses_models import GTSResponses
from app.models.users_models import User

router = APIRouter(
    prefix="/admin/analytics",
    tags=["Admin Analytics"]
)

@router.get("/")
def get_admin_analytics(db: Session = Depends(get_db)):
    try:
        total_alumni = db.query(func.count(User.id)).scalar()
        total_responses = db.query(func.count(GTSResponses.id)).scalar()

        # Employment rate (out of respondents)
        employed_count = db.query(func.count(GTSResponses.id)).filter(GTSResponses.is_employed == True).scalar()
        employment_rate = (employed_count / total_responses * 100) if total_responses else 0

        # Further studies rate
        further_studies_count = db.query(func.count(GTSResponses.id)).filter(GTSResponses.pursued_advance_degree == True).scalar()
        further_studies_rate = (further_studies_count / total_responses * 100) if total_responses else 0

        # Top industry
        top_industry = (
            db.query(GTSResponses.job_sector, func.count(GTSResponses.job_sector))
            .group_by(GTSResponses.job_sector)
            .order_by(func.count(GTSResponses.job_sector).desc())
            .first()
        )
        top_industry_name = top_industry[0] if top_industry else "N/A"

        # Employment distribution by status
        employment_status_distribution = (
            db.query(GTSResponses.employment_status, func.count(GTSResponses.employment_status))
            .group_by(GTSResponses.employment_status)
            .all()
        )
        employment_status_data = [
            {"status": status or "Unknown", "count": count}
            for status, count in employment_status_distribution
        ]

        # Employment by sector
        sector_distribution = (
            db.query(GTSResponses.job_sector, func.count(GTSResponses.job_sector))
            .group_by(GTSResponses.job_sector)
            .all()
        )
        sector_data = [
            {"sector": sector or "Unspecified", "count": count}
            for sector, count in sector_distribution
        ]

        return {
            "summary": {
                "totalAlumni": total_alumni,
                "employmentRate": round(employment_rate, 1),
                "furtherStudiesRate": round(further_studies_rate, 1),
                "topIndustry": top_industry_name,
                "totalResponses": total_responses,
            },
            "employment": {
                "statusDistribution": employment_status_data,
                "industryDistribution": sector_data,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
