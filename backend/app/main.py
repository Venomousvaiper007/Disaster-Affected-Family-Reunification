import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from sqlalchemy import text
from dotenv import load_dotenv

from backend.app.database.connection import engine, Base
from backend.app.database.session import get_db
from backend.app.database.models import *
from backend.app.routers import (
    auth, missing, found, emergencies, cases, matches, evidence, conflicts, rescue, dashboard, notifications
)
from backend.app.seed.demo_data import seed_demo_data

load_dotenv()

app = FastAPI(
    title="Reunite360 API",
    description="Disaster Response, Family Reunification & Rescue Coordination Platform API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:4173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(missing.router)
app.include_router(found.router)
app.include_router(emergencies.router)
app.include_router(cases.router)
app.include_router(matches.router)
app.include_router(evidence.router)
app.include_router(conflicts.router)
app.include_router(rescue.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)

@app.on_event("startup")
def startup_event():
    # Safely create tables without dropping any existing tables
    Base.metadata.create_all(bind=engine)
    # Seed database with initial records if empty
    db = Session(bind=engine)
    try:
        seed_demo_data(db)
    except Exception as e:
        print(f"Seed note: {e}")
    finally:
        db.close()

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Perform actual query to verify PostgreSQL database connection
        result = db.execute(text("SELECT current_database();")).fetchone()
        db_name = result[0] if result else "reunite360"
        return {
            "status": "ok",
            "database": "connected",
            "database_name": db_name
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
