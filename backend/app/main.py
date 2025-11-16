from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.middleware.auth_middleware import AuthMiddleware
from app.routes import (
    activity_logs_routes,
    admin_analytics_routes,
    admin_reports_routes,
    event_attendance_routes,
    events_routes,
    gts_responses_routes,
    notifications_routes,
    users_routes
)

# Load environment variables
load_dotenv()

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="TRACE System Prototype",
    description="Backend API for TRACE System",
    version="1.0.0"
)

# Middleware
app.add_middleware(AuthMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
routers = [
    activity_logs_routes.router,
    admin_analytics_routes.router,
    admin_reports_routes.router,
    events_routes.router,
    event_attendance_routes.router,
    gts_responses_routes.router,
    notifications_routes.router,
    users_routes.router
]

for r in routers:
    app.include_router(r)

# Health check
@app.get("/", tags=["Health Check"])
def root():
    return {"message": "TRACE System Prototype backend is running!"}
