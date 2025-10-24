from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.config import settings
from app.database import Base, engine
from app.middleware.auth_middleware import AuthMiddleware
from app.routes import (
    activity_logs_routes,
    events_routes,
    users_routes,
    event_attendance_routes,
    gts_responses_routes,
)
from .admin_routes import router as admin_router

load_dotenv()

# Database setup
Base.metadata.create_all(bind=engine)

# Initialize the app (only ONCE!)
app = FastAPI()

# Middleware
app.add_middleware(AuthMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(admin_router)
app.include_router(activity_logs_routes.router)
app.include_router(events_routes.router)
app.include_router(event_attendance_routes.router)
app.include_router(gts_responses_routes.router)
app.include_router(users_routes.router)

# Root route
@app.get("/")
def root():
    return {"message": "TRACE System Prototype backend is running!"}
