from fastapi import APIRouter, Depends, HTTPException # pyright: ignore[reportMissingImports]
from fastapi.responses import FileResponse # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]
from tempfile import NamedTemporaryFile
from app.database import get_db
from app.models.users_models import Users
from app.models.events_models import Events
from app.models.gts_responses_models import GTSResponses
from app.utils.report_utils import generate_csv_report, generate_pdf_report

router = APIRouter(
    prefix="/admin/reports",
    tags=["Admin Reports"]
)

@router.get("/{report_type}")
def generate_report(report_type: str, format: str = "pdf", db: Session = Depends(get_db)):
    valid_reports = ["alumni", "events", "gts"]
    if report_type not in valid_reports:
        raise HTTPException(status_code=400, detail="Invalid report type")
    if format not in ["pdf", "csv"]:
        raise HTTPException(status_code=400, detail="Invalid format")

    # Fetch data based on type
    if report_type == "alumni":
        data = db.query(Users).filter(Users.role == "alumni", Users.is_deleted == False).all()
    elif report_type == "events":
        data = db.query(Events).all()
    elif report_type == "gts":
        data = db.query(GTSResponses).all()

    # Generate file
    with NamedTemporaryFile(delete=False, suffix=f".{format}") as tmp:
        if format == "csv":
            generate_csv_report(data, report_type, tmp.name)
        else:
            generate_pdf_report(data, report_type, tmp.name)
        return FileResponse(tmp.name, media_type="application/octet-stream", filename=f"{report_type}_report.{format}")
