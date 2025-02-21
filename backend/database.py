import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load .env file from the parent directory
dotenv_path = os.path.join(BASE_DIR, ".env")
print(f"db.py path ${dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# Debugging: Print the DATABASE_URL to confirm it's loaded
DATABASE_URL = os.getenv("DATABASE_URL")
print("Using DATABASE_URL:", DATABASE_URL)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()