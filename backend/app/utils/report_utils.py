import csv

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_csv_report(data, report_type: str, filepath: str):
    if not data:
        with open(filepath, "w", newline="") as f:
            f.write("No data available")
        return

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        headers = data[0].__table__.columns.keys()
        writer.writerow(headers)
        for row in data:
            writer.writerow([getattr(row, col) for col in headers])

def generate_pdf_report(data, report_type: str, filepath: str):
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, height - 50, f"{report_type.capitalize()} Report")

    c.setFont("Helvetica", 10)
    y = height - 100
    if not data:
        c.drawString(50, y, "No data available.")
    else:
        headers = data[0].__table__.columns.keys()
        c.drawString(50, y, ", ".join(headers))
        y -= 20
        for row in data:
            row_data = ", ".join(str(getattr(row, col)) for col in headers)
            c.drawString(50, y, row_data[:110])  # limit line length
            y -= 15
            if y < 50:
                c.showPage()
                y = height - 100

    c.save()
