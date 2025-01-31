from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI is connected to RDS via SSH tunnel!"}

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM users;"))
    users = result.fetchall()
    return {"users": [dict(row) for row in users]}