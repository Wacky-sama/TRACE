from app.routes import (
    activity_logs_routes, 
    admin_analytics_routes, 
    admin_reports_routes,
    event_attendance_routes, 
    events_routes,
    gts_responses_routes,
    users_routes
    )
from fastapi import FastAPI # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv # pyright: ignore[reportMissingImports]
from app.config import settings
from app.database import Base, engine
from app.middleware.auth_middleware import AuthMiddleware

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(activity_logs_routes.router)  # Activity log routes
app.include_router(admin_analytics_routes.router) # Admin analytics routes
app.include_router(admin_reports_routes.router) # Admin reports routes
app.include_router(events_routes.router) # Event routes
app.include_router(event_attendance_routes.router) # Event attendance routes
app.include_router(gts_responses_routes.router) # GTS response routes
app.include_router(users_routes.router)  # User routes

@app.get("/")
def root():
    return {"message": "TRACE System Prototype backend is running!"}