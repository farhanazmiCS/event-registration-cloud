from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is connected to RDS via SSH tunnel!"}

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM users;"))
    users = result.fetchall()
    return {"users": [dict(row) for row in users]}

@app.get("/events")
def get_events(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM events ORDER BY start_time ASC;"))
    events = result.mappings().all()  # Use .mappings() to return rows as dictionaries
    return {"events": events}