from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.database import get_db
from app.models.users_models import User
from app.models.gts_responses_models import GTSResponses
from app.models.events_models import Event
from app.models.activity_logs_models import ActivityLog

router = APIRouter(
    prefix="/admin/analytics",
    tags=["Admin Analytics"]
)

@router.get("/")
def get_admin_analytics(
    db: Session = Depends(get_db),
    start_year: int = Query(None, description="Filter analytics from this year onward"),
    end_year: int = Query(None, description="Filter analytics up to this year"),
    department: str = Query(None, description="Filter by course name"),
):
    """
    Returns full analytics dataset for the Admin Dashboard with optional filters:
    - start_year / end_year (for time range)
    - department (to filter alumni/GTS data by course)
    """

    try:
        filters = []
        gts_filters = []

        # Handle year filtering (use extract for PostgreSQL)
        if start_year:
            gts_filters.append(extract("year", GTSResponses.submitted_at) >= start_year)
        if end_year:
            gts_filters.append(extract("year", GTSResponses.submitted_at) <= end_year)

        # Handle department filtering (now using 'course')
        if department:
            filters.append(User.course == department)

        # Alumni-specific filters (role + department)
        alumni_filters = [User.role == 'alumni'] + filters

        # BASIC COUNTS
        total_alumni = db.query(func.count(User.id)).filter(*alumni_filters).scalar()
        active_alumni = db.query(func.count(User.id)).filter(User.is_active == True, *alumni_filters).scalar()
        pending_approvals = db.query(func.count(User.id)).filter(User.is_approved == False, *alumni_filters).scalar()

        total_responses = (
            db.query(func.count(GTSResponses.id))
            .join(User, User.id == GTSResponses.user_id)
            .filter(*gts_filters, *filters)
            .scalar()
        )

        # EMPLOYMENT RATE
        employed_count = (
            db.query(func.count(GTSResponses.id))
            .join(User, User.id == GTSResponses.user_id)
            .filter(GTSResponses.is_employed == True, *gts_filters, *filters)
            .scalar()
        )
        employment_rate = (employed_count / total_responses * 100) if total_responses else 0

        # GTS COMPLETION
        gts_completed = total_responses

        # ACTIVE EVENTS
        active_events = db.query(func.count(Event.id)).scalar()

        # ======== DEPARTMENTS ========
        departments = db.query(User.course).filter(*alumni_filters).distinct().count()

        # ======== RECENT LOGINS ========
        last_7_days = datetime.utcnow() - timedelta(days=7)
        recent_logins = (
            db.query(func.count(User.id))
            .filter(User.last_seen >= last_7_days, *alumni_filters) 
            .scalar()
        )

        # EMPLOYMENT TREND 
        employment_trend = (
            db.query(
                extract("year", GTSResponses.submitted_at).label("year"),
                func.count(GTSResponses.id).label("employed"),
            )
            .join(User, User.id == GTSResponses.user_id)
            .filter(GTSResponses.is_employed == True, *gts_filters, *filters)
            .group_by(extract("year", GTSResponses.submitted_at))
            .order_by(extract("year", GTSResponses.submitted_at))
            .all()
        )
        employment_trend_data = [{"year": int(y), "employed": e} for y, e in employment_trend]

        # EVENT PARTICIPATION TREND
        event_trend = (
            db.query(
                extract("month", Event.event_date).label("month"),
                func.count(Event.id).label("attendance"),
            )
            .group_by(extract("month", Event.event_date))
            .order_by(extract("month", Event.event_date))
            .all()
        )
        event_chart_data = [
            {"month": datetime(2024, int(m), 1).strftime("%b"), "attendance": a}
            for m, a in event_trend
        ]

        # GTS COMPLETION BY DEPARTMENT
        gts_by_department = (
            db.query(User.course, func.count(GTSResponses.id))
            .join(GTSResponses, GTSResponses.user_id == User.id)
            .filter(*filters)
            .group_by(User.course)
            .all()
        )
        gts_by_dept_data = [
            {"dept": dept or "Unspecified", "value": count} for dept, count in gts_by_department
        ]

        # RECENT ACTIVITIES 
        recent_activities = (
            db.query(ActivityLog.description, ActivityLog.created_at)
            .order_by(ActivityLog.created_at.desc())
            .limit(5)
            .all()
        )
        activities_data = [
            {"description": desc, "timestamp": ts.strftime("%Y-%m-%d %H:%M")} for desc, ts in recent_activities
        ]

        # FINAL RESPONSE
        return {
            "filters": {
                "start_year": start_year,
                "end_year": end_year,
                "department": department,
            },
            "summary": {
                "totalAlumni": total_alumni,
                "activeAlumni": active_alumni,
                "pendingApprovals": pending_approvals,
                "employmentRate": round(employment_rate, 1),
                "gtsCompleted": gts_completed,
                "activeEvents": active_events,
                "departments": departments,
                "recentLogins": recent_logins,
            },
            "employmentTrend": employment_trend_data,
            "chartData": event_chart_data,
            "gtsByDept": gts_by_dept_data,
            "recentActivities": activities_data,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
