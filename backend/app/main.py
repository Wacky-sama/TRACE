import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.config import settings
from app.database import Base, engine
from app.routes import user_routes, event_routes, event_attendance_routes
from app.middleware.auth_middleware import UpdateLastSeenMiddleware

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(UpdateLastSeenMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(event_routes.router, prefix="/events", tags=["Events"])
app.include_router(event_attendance_routes.router)

@app.get("/")
def root():
    return {"message": "TRACE System Prototype backend is running!"}