import csv

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)

def get_display_headers(report_type: str):
    """Return human-readable column headers for each report type"""
    headers = {
        "alumni": {
            "username": "Username",
            "email": "Email",
            "full_name": "Full Name",
            "course": "Course",
            "batch_year": "Batch Year",
            "is_active": "Active Status"
        },
        "events": {
            "title": "Event Title",
            "description": "Description",
            "location": "Location",
            "start_date": "Start Date",
            "end_date": "End Date",
            "start_time": "Start Time",
            "end_time": "End Time",
            "created_by": "Created By"
        },
        "gts": {
            "full_name": "Full Name",
            "degree": "Degree Program",
            "year_graduated": "Year Graduated",
            "is_employed": "Currently Employed",
            "employment_status": "Employment Status",
            "company_name": "Company Name",
            "occupation": "Occupation/Position",
            "job_sector": "Job Sector",
            "job_related_to_course": "Job Related to Course",
            "submitted_at": "Submission Date"
        }
    }
    return headers.get(report_type, {})

def sanitize_data(data, report_type: str):
    """Remove sensitive fields based on report type"""
    if report_type == "alumni":
        return [
            {
                "username": row.username,
                "email": row.email,
                "full_name": f"{row.firstname} {row.middle_initial or ''}. {row.lastname} {row.name_extension or ''}".strip(),
                "course": row.course,
                "batch_year": row.batch_year,
                "is_active": "Yes" if row.is_active else "No",
            }
            for row in data
        ]
    elif report_type == "events":
        return [
            {
                "title": row.title,
                "description": row.description or "N/A",
                "location": row.location or "N/A",
                "start_date": row.start_date.strftime("%Y-%m-%d") if row.start_date else "N/A",
                "end_date": row.end_date.strftime("%Y-%m-%d") if row.end_date else "N/A",
                "start_time": row.start_time_startday.strftime("%H:%M") if row.start_time_startday else "N/A",
                "end_time": row.end_time_endday.strftime("%H:%M") if row.end_time_endday else "N/A",
                "created_by": str(row.created_by),
            }
            for row in data
        ]
    elif report_type == "gts":
        return [
            {
                "full_name": row.full_name or "N/A",
                "degree": row.degree or "N/A",
                "year_graduated": row.year_graduated or "N/A",
                "is_employed": "Yes" if row.is_employed else "No" if row.is_employed is False else "N/A",
                "employment_status": row.employment_status or "N/A",
                "company_name": row.company_name or "N/A",
                "occupation": ", ".join(row.occupation) if row.occupation else "N/A",
                "job_sector": row.job_sector or "N/A",
                "job_related_to_course": "Yes" if row.job_related_to_course else "No" if row.job_related_to_course is False else "N/A",
                "submitted_at": row.submitted_at.strftime("%Y-%m-%d") if row.submitted_at else "N/A",
            }
            for row in data
        ]
    return []

def generate_csv_report(data, report_type: str, filepath: str):
    if not data:
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            f.write("No data available")
        return

    sanitized = sanitize_data(data, report_type)
    display_headers = get_display_headers(report_type)
    
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        if sanitized:
            # Map internal field names to display names
            fieldnames = list(sanitized[0].keys())
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            
            # Write custom headers
            writer.writerow({field: display_headers.get(field, field) for field in fieldnames})
            
            # Write data
            writer.writerows(sanitized)
        else:
            f.write("No data available")

def generate_pdf_report(data, report_type: str, filepath: str):
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title = Paragraph(f"<b>{report_type.upper()} REPORT</b>", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 20))
    
    if not data:
        no_data = Paragraph("No data available.", styles['Normal'])
        elements.append(no_data)
        doc.build(elements)
        return
    
    sanitized = sanitize_data(data, report_type)
    
    if not sanitized:
        no_data = Paragraph("No data available.", styles['Normal'])
        elements.append(no_data)
        doc.build(elements)
        return
    
    # Get display headers
    display_headers = get_display_headers(report_type)
    internal_fields = list(sanitized[0].keys())
    
    # Create table with display headers
    headers = [display_headers.get(field, field) for field in internal_fields]
    table_data = [headers] + [[str(row[field]) for field in internal_fields] for row in sanitized]
    
    # Create table
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
    ]))
    
    elements.append(table)
    doc.build(elements)