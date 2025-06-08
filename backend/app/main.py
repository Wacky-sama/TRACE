from fastapi import FastAPI
from app.database import Base, engine
from app.routes import user_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_routes.router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "TRACE System V1 backend is running"}
