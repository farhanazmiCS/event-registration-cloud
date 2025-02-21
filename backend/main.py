from fastapi import FastAPI, Depends, HTTPException, Request, Response, Query, Cookie
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from pydantic import BaseModel, EmailStr, Field
import boto3
import os
import hmac, hashlib, base64
import re
from datetime import datetime
import logging
from fastapi import Depends, HTTPException, Header
import boto3

from dotenv import load_dotenv


load_dotenv()  # Load AWS credentials from .env

# Retrieve the values AFTER loading dotenv
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
COGNITO_REGION = os.getenv("COGNITO_REGION")
COGNITO_CLIENT_SECRET = os.getenv("COGNITO_CLIENT_SECRET")

# SES CONFIG
AWS_REGION = os.getenv("AWS_REGION")
AWS_SES_SENDER_EMAIL = os.getenv("AWS_SES_SENDER_EMAIL")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# Initialize AWS SES client
ses_client = boto3.client(
    "ses",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# # Print to verify environment variables
# print(f"COGNITO_CLIENT_ID: {COGNITO_CLIENT_ID}")
# print(f"COGNITO_USER_POOL_ID: {COGNITO_USER_POOL_ID}")
# print(f"COGNITO_REGION: {COGNITO_REGION}")
# print(f"COGNITO_CLIENT_SECRET: {COGNITO_CLIENT_SECRET}")

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://event-registration-cloud2.vercel.app"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class UpdateProfileRequest(BaseModel):
    name: str
    email: EmailStr
    phone_number: str

class SignupRequest(BaseModel):
    username: str
    birthdate: str  # Format: YYYY-MM-DD
    phone_number: str  # Format: "+1234567890"
    email: EmailStr  # Ensures valid email format
    family_name: str
    middle_name: str
    name: str
    password: str

class ConfirmSignupRequest(BaseModel):
    username: str
    confirmation_code: str

class ResendConfirmationRequest(BaseModel):
    username: str

class ForgotPasswordRequest(BaseModel):
    username: str

# Define a request model for event creation
class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: datetime
    price: float
    quantity: int
    organizer_cognito_sub: str

class LoginRequest(BaseModel):
    username: str
    password: str

# Confirm New Password
class ConfirmPasswordRequest(BaseModel):
    username: str
    confirmation_code: str
    new_password: str

class ConfirmForgotPasswordRequest(BaseModel):
    username: str
    confirmation_code: str
    new_password: str

class PaymentRequest(BaseModel):
    event_id: int
    amount: float = Field(gt=0, description="Amount must be greater than 0")
    card_number: str = Field(min_length=16, max_length=16, pattern="^[0-9]{16}$", description="Card number must be exactly 16 digits")
    expiry_date: str = Field(pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$", description="Expiry must be in MM/YY format")
    cvv: str = Field(min_length=3, max_length=4, pattern="^[0-9]{3,4}$", description="CVV must be 3 or 4 digits")

# Initialize Cognito client
client = boto3.client('cognito-idp', region_name=COGNITO_REGION)

def validate_phone_number(phone_number: str):
    """Ensure phone number is in E.164 format (+[country code][number])"""
    pattern = re.compile(r"^\+\d{6,15}$")
    if not pattern.match(phone_number):
        raise HTTPException(status_code=400, detail="Invalid phone number format. Use +[country_code][number]")

def get_secret_hash(username):
    """Generates Cognito secret hash"""
    message = username + COGNITO_CLIENT_ID
    dig = hmac.new(
        COGNITO_CLIENT_SECRET.encode("utf-8"),  # Make sure this is not None
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(dig).decode()

def validate_expiry_date(expiry_date: str):
    """Ensure expiry date is valid and not expired."""
    expiry_month, expiry_year = map(int, expiry_date.split("/"))
    expiry_year += 2000  # Convert YY to YYYY format
    current_date = datetime.now()

    if expiry_year < current_date.year or (expiry_year == current_date.year and expiry_month < current_date.month):
        raise HTTPException(status_code=400, detail="Card expiry date is invalid or expired")
    
def send_email_notification(to_email: str, subject: str, body: str):
    """Send email using AWS SES."""
    try:
        response = ses_client.send_email(
            Source=AWS_SES_SENDER_EMAIL,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {"Data": subject},
                "Body": {
                    "Text": {"Data": body},
                    "Html": {"Data": f"<html><body><h2>{body}</h2></body></html>"}
                },
            },
        )
        print(f"Email sent successfully: MessageId={response['MessageId']}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def verify_email(email):
    try:
        response = ses_client.verify_email_identity(EmailAddress=email)
        print(f"Verification email sent to: {email}")
        return response
    except Exception as e:
        print(f"Error verifying email: {e}")


@app.get("/")
def read_root():
    return {"message": "FastAPI is connected to RDS via SSH tunnel!"}

@app.get("/users")
def get_users(request: Request, db: Session = Depends(get_db)):
    logger.info(f"GET {request.url} - Fetching all users")
    try:
        result = db.execute(text("SELECT * FROM users;"))
        users = result.fetchall()
        logger.info(f"GET {request.url} - Retrieved {len(users)} users")
        return {"users": [dict(row) for row in users]}
    except Exception as e:
        logger.error(f"GET {request.url} - Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@app.get("/events")
def get_events(request: Request, db: Session = Depends(get_db)):
    print(request)
    logger.info(f"GET {request.url} - Fetching all events")
    try:
        result = db.execute(text("SELECT * FROM events ORDER BY start_time ASC;"))
        events = result.mappings().all()
        logger.info(f"GET {request.url} - Retrieved {len(events)} events")
        return {"events": events}
    except Exception as e:
        logger.error(f"GET {request.url} - Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch events")

@app.post("/events")
def create_event(request: Request, event: EventCreate, db: Session = Depends(get_db)):
    user_sub = request.cookies.get("cognito_sub") # ✅ Extract user_sub from cookies

    if not user_sub:
        logger.warning(f"POST {request.url} - Unauthorized attempt to create event (missing user_sub)")
        raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

    logger.info(f"POST {request.url} - Creating event: {event.title} by user {user_sub}")

    try:
        query = text("""
            INSERT INTO events (title, description, location, start_time, end_time, price, quantity, organizer_cognito_sub, created_at) 
            VALUES (:title, :description, :location, :start_time, :end_time, :price, :quantity, :user_sub, NOW())
            RETURNING id
        """)

        params = {**event.dict(), "user_sub": user_sub}
        logger.info(f"Executing query: {query} with params: {params}")

        result = db.execute(query, params)
        db.commit()

        event_id = result.scalar()
        logger.info(f"POST {request.url} - Event {event_id} created successfully")
        return {"message": "Event created successfully", "event_id": event_id}

    except Exception as e:
        logger.error(f"POST {request.url} - Error creating event: {e}")
        raise HTTPException(status_code=500, detail="Failed to create event")
 
@app.get("/events/{event_id}")
def get_event(request: Request, event_id: int, db: Session = Depends(get_db)):
    logger.info(f"GET {request.url} - Fetching event ID: {event_id}")
    try:
        query = text("SELECT * FROM events WHERE id = :event_id")
        result = db.execute(query, {"event_id": event_id}).mappings().first()

        if not result:
            logger.warning(f"GET {request.url} - Event {event_id} not found")
            raise HTTPException(status_code=404, detail="Event not found")

        return dict(result)  # ✅ Move this inside the try block

    except Exception as e:
        logger.error(f"Error fetching event {event_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

### ✅ UPDATED LOGIN ROUTE: Store Tokens in Secure Cookies ###
@app.post("/api/login")
def login(request: LoginRequest, response: Response):
    try:
        secret_hash = get_secret_hash(request.username)  # ✅ Generate secret hash using username

        auth_response = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": request.username,  # ✅ Use "USERNAME" instead of "email"
                "PASSWORD": request.password,
                "SECRET_HASH": secret_hash,
            },
            ClientId=COGNITO_CLIENT_ID
        )

        access_token = auth_response["AuthenticationResult"]["AccessToken"]
        refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]

        # ✅ Retrieve `sub` from Cognito to identify user
        user_response = client.get_user(AccessToken=access_token)
        sub = next((attr["Value"] for attr in user_response["UserAttributes"] if attr["Name"] == "sub"), None)

        # ✅ Store `access_token` in an HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="None"
        )

        # ✅ Store `refresh_token` in an HTTP-only cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="None"
        )

        # ✅ Store `sub` in a readable cookie for frontend use
        response.set_cookie(
            key="cognito_sub",
            value=sub,
            httponly=False,
            secure=False,
            samesite="None"
        )

        return {"message": "Login successful"}

    except client.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    except client.exceptions.UserNotFoundException:
        raise HTTPException(status_code=404, detail="User does not exist")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/signup")
def signup(request: SignupRequest):
    try:
        # Validate phone number format
        validate_phone_number(request.phone_number)

        logger.info(f"Attempting to sign up user: {request.username}")

        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,  # Separate username (not email)
            Password=request.password,
            SecretHash=get_secret_hash(request.username),
            UserAttributes=[
                {"Name": "phone_number", "Value": request.phone_number},  
                {"Name": "email", "Value": request.email},  
                {"Name": "birthdate", "Value": request.birthdate},
                {"Name": "family_name", "Value": request.family_name},
                {"Name": "middle_name", "Value": request.middle_name},
                {"Name": "name", "Value": request.name},
            ],
        )

        logger.info(f"Signup successful: {response}")

        # ✅ Fetch user details from Cognito to check if email is registered
        user_data = client.admin_get_user(
            UserPoolId=COGNITO_USER_POOL_ID,
            Username=request.username
        )
        logger.info(f"User data retrieved after signup: {user_data}")

        # ✅ Check if email attribute exists in user data
        user_attributes = {attr["Name"]: attr["Value"] for attr in user_data["UserAttributes"]}
        logger.info(f"Extracted User Attributes: {user_attributes}")

        if "email" not in user_attributes:
            logger.error("Email attribute missing in Cognito user data!")
            raise HTTPException(status_code=500, detail="Email attribute missing in Cognito.")

        # ✅ Force Cognito to trigger email verification by marking email_verified as false
        logger.info(f"Triggering email verification for {request.email}")
        update_response = client.admin_update_user_attributes(
            UserPoolId=COGNITO_USER_POOL_ID,
            Username=request.username,
            UserAttributes=[
                {"Name": "email_verified", "Value": "false"}
            ],
        )
        logger.info(f"admin_update_user_attributes response: {update_response}")

        logger.info("Verification email should now be sent by Cognito.")
        
        # Added a line to send AWS identity verification email
        verify_email(request.email)

        return {"message": "User created successfully. A verification email has been sent."}

    except client.exceptions.UsernameExistsException:
        logger.error(f"Username already exists: {request.username}")
        raise HTTPException(status_code=400, detail="User already exists")
    except client.exceptions.InvalidParameterException as e:
        logger.error(f"Invalid parameter: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {str(e)}")
    except Exception as e:
        logger.error(f"Error in signup: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/confirm-signup")
def confirm_signup(request: ConfirmSignupRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Attempting to confirm signup for username: {request.username}")
        secret_hash = get_secret_hash(request.username) if COGNITO_CLIENT_SECRET else None

        client.confirm_sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,
            ConfirmationCode=request.confirmation_code,
            SecretHash=secret_hash,
        )

        # ✅ Step 2: Retrieve User Info from Cognito
        user_data = client.admin_get_user(
            UserPoolId=COGNITO_USER_POOL_ID,
            Username=request.username
        )

        # ✅ Step 3: Extract `sub`, `email`, and `name`
        user_attributes = {attr["Name"]: attr["Value"] for attr in user_data["UserAttributes"]}
        cognito_sub = user_attributes.get("sub")
        email = user_attributes.get("email")
        name = user_attributes.get("name")
        created_at = datetime.utcnow()  # Store current timestamp
        
        # Log the extracted values for debugging
        logger.info(f"Extracted user data: sub={cognito_sub}, email={email}, name={name}, created_at={created_at}")

        # ✅ Step 4: Insert User into PostgreSQL
        query = text("""
            INSERT INTO users (cognito_sub, name, email, created_at) 
            VALUES (:cognito_sub, :name, :email, :created_at)
            ON CONFLICT (cognito_sub) DO NOTHING;
        """)

        db.execute(query, {"cognito_sub": cognito_sub, "name": name, "email": email, "created_at": created_at})
        db.commit()

        logger.info(f"Account for {request.username} successfully confirmed.")
        return {"message": "Account successfully confirmed. You can now log in."}

    except client.exceptions.NotAuthorizedException:
        logger.error(f"User {request.username} is already confirmed.")
        return {"message": "User is already confirmed. Please log in."}

    except client.exceptions.CodeMismatchException:
        logger.error(f"Invalid confirmation code for {request.username}.")
        raise HTTPException(status_code=400, detail="Invalid confirmation code.")

    except client.exceptions.UserNotFoundException:
        logger.error(f"User not found: {request.username}")
        raise HTTPException(status_code=404, detail="User not found.")

    except Exception as e:
        logger.error(f"Unexpected error during confirmation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/confirm-forgot-password")
def confirm_forgot_password(request: ConfirmForgotPasswordRequest):
    try:
        secret_hash = get_secret_hash(request.username)  # ✅ Generate secret hash using username

        response = client.confirm_forgot_password(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,  # ✅ Use "username" instead of "email"
            ConfirmationCode=request.confirmation_code,
            Password=request.new_password,
            SecretHash=secret_hash
        )

        return {"message": "Password reset successful. You can now log in."}

    except client.exceptions.CodeMismatchException:
        raise HTTPException(status_code=400, detail="Invalid confirmation code.")

    except client.exceptions.ExpiredCodeException:
        raise HTTPException(status_code=400, detail="Confirmation code expired.")

    except client.exceptions.UserNotFoundException:
        raise HTTPException(status_code=404, detail="User not found.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resend-confirmation")
def resend_confirmation(request: ResendConfirmationRequest):
    try:
        secret_hash = get_secret_hash(request.username) if COGNITO_CLIENT_SECRET else None

        response = client.resend_confirmation_code(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,
            SecretHash=secret_hash,  # Include secret hash if needed
        )

        logger.info(f"Confirmation code resent response: {response}")  # ✅ Log full response

        return {
            "message": "Confirmation code resent successfully",
            "code_delivery_details": response.get("CodeDeliveryDetails", {})
        }

    except client.exceptions.UserNotFoundException:
        logger.error(f"User not found for {request.username}")
        raise HTTPException(status_code=404, detail="User not found")

    except client.exceptions.NotAuthorizedException:
        logger.error(f"User {request.username} is already confirmed.")
        return {"message": "User is already confirmed. Please log in."}

    except client.exceptions.LimitExceededException:
        logger.error(f"Too many resend attempts for {request.username}.")
        raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")

    except client.exceptions.CodeDeliveryFailureException:
        logger.error(f"Failed to deliver code for {request.username}.")
        raise HTTPException(status_code=500, detail="Code delivery failed. Check email/SMS settings.")

    except Exception as e:
        logger.error(f"Error during resend confirmation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    try:
        logger.info(f"Initiating forgot password request for username: {request.username}")

        response = client.forgot_password(
            ClientId=COGNITO_CLIENT_ID,
            Username=request.username,  # ✅ Ensure username is correct
            SecretHash=get_secret_hash(request.username) if COGNITO_CLIENT_SECRET else None
        )

        logger.info(f"Forgot Password Response: {response}")  # ✅ Log full response

        return {
            "message": "Password reset code sent to email",
            "delivery_details": response.get("CodeDeliveryDetails", {})
        }

    except client.exceptions.UserNotFoundException:
        logger.error(f"User not found: {request.username}")
        raise HTTPException(status_code=404, detail="User not found")

    except client.exceptions.LimitExceededException:
        logger.error(f"Too many reset attempts for {request.username}. Try again later.")
        raise HTTPException(status_code=429, detail="Too many reset attempts. Try again later.")

    except client.exceptions.CodeDeliveryFailureException:
        logger.error(f"Code delivery failed for {request.username}. Email settings might be misconfigured.")
        raise HTTPException(status_code=500, detail="Failed to send reset code. Check email settings.")

    except Exception as e:
        logger.error(f"Unexpected error in forgot password: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify-email")
async def verify_email_route(request: Request):
    """API route to verify email."""
    data = await request.json()
    email = data.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    response = verify_email(email)
    return {"message": "Verification email sent successfully", "response": response}

@app.post("/api/payments")
def process_payment(request: Request, payment: PaymentRequest, db: Session = Depends(get_db)):
    try:
        user_sub = request.cookies.get("cognito_sub")

        if not user_sub:
            raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

        # Validate expiry date
        validate_expiry_date(payment.expiry_date)

        # Fetch user email from database
        query = text("SELECT email FROM users WHERE cognito_sub = :user_sub")
        user_email = db.execute(query, {"user_sub": user_sub}).scalar()

        with db.begin_nested():  # Ensures atomic operation: if one fails, everything rolls back

            # Insert the payment record
            db.execute(
                text("""
                    INSERT INTO payments (user_cognito_sub, event_id, amount, payment_status, paid_at)
                    VALUES (:user_cognito_sub, :event_id, :amount, 'completed', :paid_at)
                """),
                {
                    "user_cognito_sub": user_sub,
                    "event_id": payment.event_id,
                    "amount": payment.amount,
                    "paid_at": datetime.utcnow(),
                }
            )

            # Insert into registrations table with status 'confirmed'
            db.execute(
                text("""
                    INSERT INTO registrations (user_cognito_sub, event_id, registration_status, registered_at)
                    VALUES (:user_cognito_sub, :event_id, 'confirmed', :registered_at)
                    ON CONFLICT (user_cognito_sub, event_id) DO NOTHING
                """),
                {
                    "user_cognito_sub": user_sub,
                    "event_id": payment.event_id,
                    "registered_at": datetime.utcnow(),
                }
            )

            # Decrement the quantity of the event by 1
            result = db.execute(
                text("""
                    UPDATE events
                    SET quantity = quantity - 1
                    WHERE id = :event_id AND quantity > 0
                    RETURNING quantity
                """),
                {
                    "event_id": payment.event_id
                }
            )

        db.commit()

        # Send email notification using AWS SES
        if user_email:
            event_title = db.execute(text("SELECT title FROM events WHERE id = :event_id"), 
                                     {"event_id": payment.event_id}).scalar()

            send_email_notification(
                to_email=user_email,
                subject="Registration Confirmation - EventHub",
                body=f"Thank you for registering for the event: {event_title}. <br/> <br/> Your payment of ${payment.amount} has been successfully processed."
            )

        return {"message": "Payment successful and email sent"}

    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()  # Rollback in case of errors
        raise HTTPException(status_code=400, detail=str(e))


### ✅ UPDATED GET USER PROFILE: Extract Access Token from Cookies ###
@app.get("/api/user-profile")
def get_user_profile(request: Request):
    logger.info(f"Received cookies: {request.cookies}")  # ✅ Debugging step
    access_token = request.cookies.get("access_token")  # ✅ Extract access token from cookies

    if not access_token:
        raise HTTPException(status_code=401, detail="Unauthorized: No access token found.")

    try:
        client = boto3.client('cognito-idp', region_name=COGNITO_REGION)
        response = client.get_user(AccessToken=access_token)

        user_attributes = {attr["Name"]: attr["Value"] for attr in response["UserAttributes"]}
        return user_attributes

    except client.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

### ✅ NEW ROUTE: Refresh Access Token from Refresh Token Cookie ###
@app.post("/api/refresh")
def refresh_access_token(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token found")

    try:
        refresh_response = client.initiate_auth(
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={"REFRESH_TOKEN": refresh_token},
            ClientId=COGNITO_CLIENT_ID
        )

        new_access_token = refresh_response["AuthenticationResult"]["AccessToken"]

        # ✅ Update the access token cookie
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="None"
        )

        return {"message": "Token refreshed"}

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.post("/api/logout")
def logout(response: Response):
    response.set_cookie("access_token", "", httponly=True, secure=True, samesite="None", path="/", max_age=0)
    response.set_cookie("refresh_token", "", httponly=True, secure=True, samesite="None", path="/", max_age=0)
    response.set_cookie("cognito_sub", "", httponly=False, secure=False, samesite="None", path="/", max_age=0)
    return {"message": "Logged out successfully"}



@app.put("/api/update-profile")
def update_profile(request: Request, data: UpdateProfileRequest, db: Session = Depends(get_db)):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Unauthorized: No access token found.")

    try:
        # ✅ Update user attributes in Cognito
        client.update_user_attributes(
            AccessToken=access_token,
            UserAttributes=[
                {"Name": "name", "Value": data.name},
                {"Name": "email", "Value": data.email},
                {"Name": "phone_number", "Value": data.phone_number},
            ],
        )

        return {"message": "Profile updated successfully"}

    except client.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=403, detail="Not authorized to update user.")
    except client.exceptions.UserNotFoundException:
        raise HTTPException(status_code=404, detail="User not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/my-events")
def get_my_events(request: Request, db: Session = Depends(get_db)):
    # ✅ Read user_sub from request cookies
    user_sub = request.cookies.get("cognito_sub")
    print(f"my-events sub from cookies: {user_sub}")

    logger.info(f"GET {request.url} - All received cookies: {request.cookies}")  # ✅ Debugging log
    logger.info(f"GET {request.url} - Extracted user_sub: {user_sub}")  # ✅ Verify extracted sub

    if not user_sub:
        logger.warning(f"GET {request.url} - Unauthorized access: Missing cognito_sub cookie")
        raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

    logger.info(f"GET {request.url} - Fetching events for user {user_sub}")
    print(f"my-events sub working")

    try:
        query = text("""
            SELECT e.*
            FROM events e
            JOIN registrations r ON e.id = r.event_id
            WHERE r.user_cognito_sub = :user_sub
            ORDER BY e.start_time ASC;
        """)

        params = {"user_sub": user_sub}  # ✅ Ensure user_sub is mapped correctly
        logger.info(f"Executing query: {query} with params: {params}")  # ✅ Debugging log

        result = db.execute(query, params).mappings().all()

        logger.info(f"GET {request.url} - Retrieved {len(result)} events for user {user_sub}")
        return {"events": result}

    except Exception as e:
        logger.error(f"GET {request.url} - Error fetching user events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user events")

@app.get("/createdevents")
def get_created_events(request: Request, db: Session = Depends(get_db)):
    user_sub = request.cookies.get("cognito_sub")  # ✅ Read manually from request cookies
    print(f"Here:${user_sub}")

    logger.info(f"GET {request.url} - All received cookies: {request.cookies}")  # ✅ Debugging log
    logger.info(f"GET {request.url} - Extracted user_sub: {user_sub}")  # ✅ Verify extracted sub

    if not user_sub:
        logger.warning(f"GET {request.url} - Unauthorized access: Missing cognito_sub cookie")
        raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

    print("Working")
    logger.info(f"GET {request.url} - Fetching events created by user {user_sub}")

    try:
        query = text("SELECT * FROM events WHERE organizer_cognito_sub = :user_sub ORDER BY start_time ASC")

        params = {"user_sub": user_sub}  # ✅ Ensure user_sub is mapped correctly

        print(f"Executing query: {query} with params: {params}")  # ✅ Debugging log

        result = db.execute(query, {"user_sub": user_sub}).mappings().all()

        
        logger.info(f"GET {request.url} - Retrieved {len(result)} events created by {user_sub}")
        return {"events": result}
    except Exception as e:
        logger.error(f"GET {request.url} - Error fetching created events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch created events")

@app.put("/events/{event_id}")
def update_event(request: Request, event_id: int, event: EventCreate, db: Session = Depends(get_db)):
    # ✅ Read user_sub from request cookies
    user_sub = request.cookies.get("cognito_sub")
    print(f"User sub from cookies: {user_sub}")

    logger.info(f"PUT {request.url} - All received cookies: {request.cookies}")  # ✅ Debugging log
    logger.info(f"PUT {request.url} - Extracted user_sub: {user_sub}")  # ✅ Verify extracted sub

    if not user_sub:
        logger.warning(f"PUT {request.url} - Unauthorized access: Missing cognito_sub cookie")
        raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

    logger.info(f"PUT {request.url} - Updating event {event_id} by user {user_sub}")

    try:
        query = text("""
            UPDATE events
            SET title = :title, description = :description, location = :location, 
                start_time = :start_time, end_time = :end_time, price = :price, 
                quantity = :quantity
            WHERE id = :event_id AND organizer_cognito_sub = :user_sub
        """)

        params = {**event.dict(), "event_id": event_id, "user_sub": user_sub}  # ✅ Ensure user_sub is mapped correctly
        logger.info(f"Executing query: {query} with params: {params}")  # ✅ Debugging log

        result = db.execute(query, params)
        db.commit()

        if result.rowcount == 0:
            logger.warning(f"PUT {request.url} - Unauthorized event update attempt for {event_id}")
            raise HTTPException(status_code=403, detail="Not allowed to update this event")

        logger.info(f"PUT {request.url} - Event {event_id} updated successfully")
        return {"message": "Event updated successfully"}
    except Exception as e:
        logger.error(f"PUT {request.url} - Error updating event {event_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update event")

@app.delete("/events/{event_id}")
def delete_event(request: Request, event_id: int, db: Session = Depends(get_db)):
    # ✅ Read user_sub from request cookies
    user_sub = request.cookies.get("cognito_sub")
    print(f"User sub from cookies: {user_sub}")

    logger.info(f"DELETE {request.url} - All received cookies: {request.cookies}")  # ✅ Debugging log
    logger.info(f"DELETE {request.url} - Extracted user_sub: {user_sub}")  # ✅ Verify extracted sub

    if not user_sub:
        logger.warning(f"DELETE {request.url} - Unauthorized access: Missing cognito_sub cookie")
        raise HTTPException(status_code=401, detail="Unauthorized: Missing user_sub cookie")

    logger.info(f"DELETE {request.url} - Deleting event {event_id} by user {user_sub}")

    try:
        query = text("DELETE FROM events WHERE id = :event_id AND organizer_cognito_sub = :user_sub")

        params = {"event_id": event_id, "user_sub": user_sub}  # ✅ Ensure user_sub is mapped correctly
        logger.info(f"Executing query: {query} with params: {params}")  # ✅ Debugging log

        result = db.execute(query, params)
        db.commit()

        if result.rowcount == 0:
            logger.warning(f"DELETE {request.url} - Unauthorized delete attempt for event {event_id}")
            raise HTTPException(status_code=403, detail="Not allowed to delete this event")

        logger.info(f"DELETE {request.url} - Event {event_id} deleted successfully")
        return {"message": "Event deleted successfully"}

    except Exception as e:
        logger.error(f"DELETE {request.url} - Error deleting event {event_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete event")

@app.get("/health")
def health_check():
    return {"status": "healthy"}