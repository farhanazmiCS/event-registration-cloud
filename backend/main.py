from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
import time
from pydantic import BaseModel, EmailStr
import boto3
import os
import hmac, hashlib, base64
from dotenv import load_dotenv
import re

load_dotenv()  # Load AWS credentials from .env

# Retrieve the values AFTER loading dotenv
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
AWS_REGION = os.getenv("AWS_REGION")
# ✅ Explicitly load AWS credentials
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# print(f"COGNITO_CLIENT_ID: {COGNITO_CLIENT_ID}")
# print(f"COGNITO_USER_POOL_ID: {COGNITO_USER_POOL_ID}")
# print(f"AWS_REGION: {AWS_REGION}")

class SignupRequest(BaseModel):
    username: str
    birthdate: str  # Format: YYYY-MM-DD
    phone_number: str  # Format: "+1234567890"
    email: EmailStr  # Ensures valid email format
    family_name: str
    middle_name: str
    name: str
    password: str

# ✅ Define a Pydantic model for confirmation requests
class ConfirmSignupRequest(BaseModel):
    username: str
    confirmation_code: str

class ResendConfirmationRequest(BaseModel):
    username: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Initialize Cognito client
session = boto3.Session()
client = session.client("cognito-idp", region_name=AWS_REGION)


def validate_phone_number(phone_number: str):
    """Ensure phone number is in E.164 format (+[country code][number])"""
    pattern = re.compile(r"^\+\d{6,15}$")
    if not pattern.match(phone_number):
        raise HTTPException(status_code=400, detail="Invalid phone number format. Use +[country_code][number]")

def get_secret_hash(username):
    """Generate Cognito secret hash for authentication"""
    message = username + COGNITO_CLIENT_ID
    dig = hmac.new(
        os.getenv("COGNITO_CLIENT_SECRET").encode("utf-8"),  # Load secret from .env
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(dig).decode()

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

@app.post("/api/login")
def login(request: LoginRequest):
    try:
        response = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": request.email,
                "PASSWORD": request.password,
                "SECRET_HASH": get_secret_hash(request.email),  # Include secret hash
            },
            ClientId=COGNITO_CLIENT_ID
        )
        
        return {
            "access_token": response["AuthenticationResult"]["AccessToken"],
            "refresh_token": response["AuthenticationResult"]["RefreshToken"],
            "id_token": response["AuthenticationResult"]["IdToken"]
        }
    except client.exceptions.NotAuthorizedException as e:
        print(f"DEBUG: NotAuthorizedException - {e}")
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    except client.exceptions.UserNotFoundException as e:
        print(f"DEBUG: UserNotFoundException - {e}")
        raise HTTPException(status_code=404, detail="User does not exist")
    except Exception as e:
        print(f"DEBUG: Unexpected Error - {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/signup")
def signup(request: SignupRequest):
    try:
        # Validate phone number format
        validate_phone_number(request.phone_number)

        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,
            Password=request.password,
            SecretHash=get_secret_hash(request.username),
            UserAttributes=[
                {"Name": "phone_number", "Value": request.phone_number},  # Ensure valid format
                {"Name": "email", "Value": request.email},
                {"Name": "birthdate", "Value": request.birthdate},
                {"Name": "family_name", "Value": request.family_name},
                {"Name": "middle_name", "Value": request.middle_name},
                {"Name": "name", "Value": request.name},
            ],
        )

        return {"message": "User created successfully"}
    except client.exceptions.UsernameExistsException:
        raise HTTPException(status_code=400, detail="User already exists")
    except client.exceptions.InvalidParameterException as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/confirm-signup")
def confirm_signup(request: ConfirmSignupRequest):
    try:
        # Step 1: Compute secret hash (needed if App Client has a secret)
        secret_hash = get_secret_hash(request.username)

        # Step 2: Attempt to confirm the user
        client.confirm_sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,
            ConfirmationCode=request.confirmation_code,
            SecretHash=secret_hash,  # Include secret hash if required
        )

        # Step 3: Retry checking confirmation status (in case Cognito takes time to update)
        for _ in range(5):  # Retry up to 5 times
            user_data = client.admin_get_user(
                UserPoolId=COGNITO_USER_POOL_ID,
                Username=request.username
            )
            user_status = user_data.get("UserStatus", "")
            
            if user_status == "CONFIRMED":
                break  # Exit loop if confirmed
            time.sleep(1)  # Wait 1 second before retrying

        # Step 4: If user is still not confirmed, return a better message
        if user_status != "CONFIRMED":
            return {"message": "Your account may take a few moments to confirm. Please try logging in."}

        # Step 5: Ensure email is marked as verified
        client.admin_update_user_attributes(
            UserPoolId=COGNITO_USER_POOL_ID,
            Username=request.username,
            UserAttributes=[
                {"Name": "email_verified", "Value": "true"},
            ]
        )

        return {"message": "Account successfully confirmed. You can now log in."}

    except client.exceptions.NotAuthorizedException:
        return {"message": "User is already confirmed. Please log in."}

    except client.exceptions.CodeMismatchException:
        raise HTTPException(status_code=400, detail="Invalid confirmation code.")

    except client.exceptions.UserNotFoundException:
        raise HTTPException(status_code=404, detail="User not found.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/resend-confirmation")
def resend_confirmation(request: ResendConfirmationRequest):
    try:
        response = client.resend_confirmation_code(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,
        )
        return {"message": "Confirmation code resent successfully"}
    
    except client.exceptions.UserNotFoundException:
        raise HTTPException(status_code=404, detail="User not found")
    
    except client.exceptions.NotAuthorizedException:
        return {"message": "User is already confirmed. Please log in."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
