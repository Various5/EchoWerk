# 📧 Email Verification Fix
# DATEI: backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import os
from datetime import datetime, timedelta
import json
import pyotp
import qrcode
from io import BytesIO
import base64
from fastapi.responses import JSONResponse
app = FastAPI(
    title="EchoWerk Authentication API",
    description="Modern music authentication with email verification and 2FA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Storage (für Development - in Production würde das in der Database sein)
users_db = {}
verification_tokens = {}
login_attempts = {}

# Email Configuration (aus Environment Variables)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://10.0.1.10:3000")


# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: str = None


class PasswordStrengthValidator:
    @staticmethod
    def validate(password: str) -> tuple[bool, list[str]]:
        errors = []
        if len(password) < 8:
            errors.append("At least 8 characters")
        if not any(c.islower() for c in password):
            errors.append("One lowercase letter")
        if not any(c.isupper() for c in password):
            errors.append("One uppercase letter")
        if not any(c.isdigit() for c in password):
            errors.append("One number")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            errors.append("One special character")
        return len(errors) == 0, errors


class EmailService:
    @staticmethod
    def send_verification_email(to_email: str, verification_link: str) -> bool:
        """Send email verification email"""
        if not SMTP_USERNAME or not SMTP_PASSWORD:
            print("⚠️ Email credentials not configured")
            print(f"🔗 Verification link would be: {verification_link}")
            return True  # Fake success for development

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = "🎵 Verify your EchoWerk account"
            message["From"] = f"EchoWerk <{SMTP_USERNAME}>"
            message["To"] = to_email

            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Email Verification</title>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f23; color: #f8fafc; margin: 0; padding: 40px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.1); }}
                    .header {{ text-align: center; margin-bottom: 40px; }}
                    .logo {{ font-size: 2rem; font-weight: bold; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
                    .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3); }}
                    .footer {{ text-align: center; margin-top: 40px; color: #64748b; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🎵 EchoWerk</div>
                        <h1>Welcome to the Future of Music!</h1>
                    </div>
                    <p>Hi there! 👋</p>
                    <p>Thanks for joining EchoWerk! To complete your registration and unlock the full experience, please verify your email address:</p>
                    <div style="text-align: center;">
                        <a href="{verification_link}" class="button">✨ Verify Email Address</a>
                    </div>
                    <p>This link will expire in 24 hours for your security.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <div class="footer">
                        <p>🎵 EchoWerk - Modern Music Authentication</p>
                    </div>
                </div>
            </body>
            </html>
            """

            html_part = MIMEText(html_body, "html")
            message.attach(html_part)

            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SMTP_USERNAME, to_email, message.as_string())

            print(f"✅ Verification email sent to {to_email}")
            return True

        except Exception as e:
            print(f"❌ Failed to send email: {str(e)}")
            print(f"🔗 Verification link: {verification_link}")
            return False


# Routes
@app.get("/")
async def root():
    return {
        "message": "🎵 Welcome to EchoWerk API!",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "EchoWerk Backend",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/auth/register")
async def register_user(user_data: UserRegister, request: Request):
    """Register new user with email verification"""

    # Validate password strength
    is_strong, errors = PasswordStrengthValidator.validate(user_data.password)
    if not is_strong:
        raise HTTPException(
            status_code=400,
            detail=f"Password requirements not met: {', '.join(errors)}"
        )

    # Check if user already exists
    if user_data.email in users_db:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    if any(user.get("username") == user_data.username for user in users_db.values()):
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    verification_link = f"{FRONTEND_URL}/verify-email/{verification_token}"

    # Store user (unverified)
    user_id = f"user_{len(users_db) + 1}"
    users_db[user_data.email] = {
        "id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "password": user_data.password,  # In production: hash this!
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "is_verified": False,
        "is_2fa_enabled": False,
        "created_at": datetime.now().isoformat()
    }

    # Store verification token
    verification_tokens[verification_token] = {
        "email": user_data.email,
        "expires_at": (datetime.now() + timedelta(hours=24)).isoformat(),
        "used": False
    }

    # Send verification email
    email_sent = EmailService.send_verification_email(user_data.email, verification_link)

    print(f"🔗 Verification link for {user_data.email}: {verification_link}")

    return {
        "success": True,
        "message": "Registration successful! Please check your email to verify your account.",
        "user_id": user_id,
        "email_sent": email_sent,
        "verification_link": verification_link if not email_sent else None  # Only show link if email failed
    }


@app.get("/auth/verify-email/{token}")
async def verify_email(token: str):
    """Verify email address with token"""

    if token not in verification_tokens:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification token"
        )

    token_data = verification_tokens[token]

    if token_data["used"]:
        raise HTTPException(
            status_code=400,
            detail="Verification token already used"
        )

    # Check if token expired
    expires_at = datetime.fromisoformat(token_data["expires_at"])
    if datetime.now() > expires_at:
        raise HTTPException(
            status_code=400,
            detail="Verification token expired"
        )

    # Mark user as verified
    email = token_data["email"]
    if email in users_db:
        users_db[email]["is_verified"] = True
        verification_tokens[token]["used"] = True

        print(f"✅ Email verified for user: {email}")

        # Return HTML page with success message
        return HTMLResponse(content=f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verified - EchoWerk</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f23; color: #f8fafc; margin: 0; padding: 40px; text-align: center; }}
                .container {{ max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; padding: 60px 40px; border: 1px solid rgba(255,255,255,0.1); }}
                .logo {{ font-size: 3rem; margin-bottom: 20px; }}
                .title {{ font-size: 2rem; font-weight: bold; margin-bottom: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">🎉</div>
                <h1 class="title">Email Verified!</h1>
                <p>Your email has been successfully verified. You can now enjoy all features of EchoWerk!</p>
                <a href="{FRONTEND_URL}/login" class="button">Continue to Login</a>
            </div>
        </body>
        </html>
        """, status_code=200)

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )


@app.post("/auth/login")
async def login_user(login_data: UserLogin):
    """Login user with email verification check"""

    email = login_data.email

    if email not in users_db:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    user = users_db[email]

    # Check password (in production: verify hashed password)
    if user["password"] != login_data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Check if email is verified
    if not user["is_verified"]:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address before logging in"
        )

    # For now, return success (in production: generate JWT tokens)
    return {
        "success": True,
        "message": "Login successful",
        "access_token": f"fake_token_{user['id']}",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "is_verified": user["is_verified"],
            "is_2fa_enabled": user["is_2fa_enabled"]
        }
    }


@app.get("/auth/resend-verification/{email}")
async def resend_verification(email: str):
    """Resend verification email"""

    if email not in users_db:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user = users_db[email]

    if user["is_verified"]:
        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )

    # Generate new verification token
    verification_token = secrets.token_urlsafe(32)
    verification_link = f"{FRONTEND_URL}/verify-email/{verification_token}"

    # Store new verification token
    verification_tokens[verification_token] = {
        "email": email,
        "expires_at": (datetime.now() + timedelta(hours=24)).isoformat(),
        "used": False
    }

    # Send verification email
    email_sent = EmailService.send_verification_email(email, verification_link)

    return {
        "success": True,
        "message": "Verification email sent",
        "email_sent": email_sent
    }


# 🔐 Complete 2FA Implementation
# DATEI: backend/main.py (ERGÄNZUNG - füge diese Teile zur existing main.py hinzu)

import pyotp
import qrcode
from io import BytesIO
import base64
from fastapi.responses import JSONResponse


# Zusätzliche Pydantic Models (zu existing models hinzufügen)
class Setup2FA(BaseModel):
    password: str


class Enable2FA(BaseModel):
    totp_code: str


class Disable2FA(BaseModel):
    password: str


class TwoFactorAuth:
    @staticmethod
    def generate_secret() -> str:
        """Generate TOTP secret"""
        return pyotp.random_base32()

    @staticmethod
    def generate_qr_code(secret: str, email: str, app_name: str = "EchoWerk") -> str:
        """Generate QR code for TOTP setup and return as base64 string"""
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=email,
            issuer_name=app_name
        )

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # Convert to base64
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()

        return f"data:image/png;base64,{img_base64}"

    @staticmethod
    def verify_totp(secret: str, token: str, window: int = 1) -> bool:
        """Verify TOTP token"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=window)

    @staticmethod
    def generate_backup_codes(count: int = 8) -> list[str]:
        """Generate backup codes for 2FA"""
        return [secrets.token_hex(4).upper() for _ in range(count)]


# Ergänze diese Routen zur existing main.py:

@app.post("/auth/2fa/setup")
async def setup_2fa(setup_data: Setup2FA, request: Request):
    """Setup two-factor authentication"""

    # Get user from Authorization header (simplified for demo)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    # Extract fake token (in production: verify JWT)
    token = auth_header.replace("Bearer ", "")
    user_email = None

    # Find user by token (simplified)
    for email, user in users_db.items():
        if f"fake_token_{user['id']}" == token:
            user_email = email
            break

    if not user_email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = users_db[user_email]

    # Verify password
    if user["password"] != setup_data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    if user.get("is_2fa_enabled", False):
        raise HTTPException(
            status_code=400,
            detail="Two-factor authentication is already enabled"
        )

    # Generate TOTP secret
    secret = TwoFactorAuth.generate_secret()

    # Generate QR code
    qr_code_data = TwoFactorAuth.generate_qr_code(secret, user["email"])

    # Generate backup codes
    backup_codes = TwoFactorAuth.generate_backup_codes()

    # Store secret temporarily (user needs to verify it first)
    user["totp_secret_temp"] = secret
    user["backup_codes_temp"] = backup_codes

    return {
        "success": True,
        "secret": secret,
        "qr_code": qr_code_data,
        "backup_codes": backup_codes,
        "message": "Scan the QR code with your authenticator app and enter the code to enable 2FA"
    }


@app.post("/auth/2fa/enable")
async def enable_2fa(enable_data: Enable2FA, request: Request):
    """Enable two-factor authentication after verification"""

    # Get user (same auth logic as setup)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = auth_header.replace("Bearer ", "")
    user_email = None

    for email, user in users_db.items():
        if f"fake_token_{user['id']}" == token:
            user_email = email
            break

    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_db[user_email]

    if user.get("is_2fa_enabled", False):
        raise HTTPException(status_code=400, detail="2FA already enabled")

    if "totp_secret_temp" not in user:
        raise HTTPException(status_code=400, detail="Please setup 2FA first")

    # Verify TOTP code
    if not TwoFactorAuth.verify_totp(user["totp_secret_temp"], enable_data.totp_code):
        raise HTTPException(status_code=400, detail="Invalid TOTP code")

    # Enable 2FA
    user["is_2fa_enabled"] = True
    user["totp_secret"] = user["totp_secret_temp"]
    user["backup_codes"] = user["backup_codes_temp"]

    # Clean up temporary data
    del user["totp_secret_temp"]
    del user["backup_codes_temp"]

    print(f"✅ 2FA enabled for user: {user_email}")

    return {
        "success": True,
        "message": "Two-factor authentication enabled successfully",
        "backup_codes": user["backup_codes"]
    }


@app.post("/auth/2fa/disable")
async def disable_2fa(disable_data: Disable2FA, request: Request):
    """Disable two-factor authentication"""

    # Get user (same auth logic)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = auth_header.replace("Bearer ", "")
    user_email = None

    for email, user in users_db.items():
        if f"fake_token_{user['id']}" == token:
            user_email = email
            break

    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_db[user_email]

    # Verify password
    if user["password"] != disable_data.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    if not user.get("is_2fa_enabled", False):
        raise HTTPException(status_code=400, detail="2FA is not enabled")

    # Disable 2FA
    user["is_2fa_enabled"] = False
    user.pop("totp_secret", None)
    user.pop("backup_codes", None)

    print(f"⚠️ 2FA disabled for user: {user_email}")

    return {
        "success": True,
        "message": "Two-factor authentication disabled"
    }


@app.get("/auth/2fa/status")
async def get_2fa_status(request: Request):
    """Get 2FA status for current user"""

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = auth_header.replace("Bearer ", "")
    user_email = None

    for email, user in users_db.items():
        if f"fake_token_{user['id']}" == token:
            user_email = email
            break

    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_db[user_email]

    return {
        "is_2fa_enabled": user.get("is_2fa_enabled", False),
        "has_backup_codes": "backup_codes" in user and len(user.get("backup_codes", [])) > 0
    }


# Update the login endpoint to handle 2FA (replace existing login)
@app.post("/auth/login")
async def login_user(login_data: UserLogin):
    """Login user with 2FA support"""

    email = login_data.email

    if email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = users_db[email]

    # Check password
    if user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if email is verified
    if not user["is_verified"]:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address before logging in"
        )

    # Check 2FA if enabled
    if user.get("is_2fa_enabled", False):
        if not login_data.totp_code:
            return {
                "success": False,
                "requires_2fa": True,
                "message": "Two-factor authentication code required"
            }

        # Verify TOTP code
        if not TwoFactorAuth.verify_totp(user["totp_secret"], login_data.totp_code):
            raise HTTPException(status_code=401, detail="Invalid 2FA code")

    # Successful login
    return {
        "success": True,
        "message": "Login successful",
        "access_token": f"fake_token_{user['id']}",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "is_verified": user["is_verified"],
            "is_2fa_enabled": user.get("is_2fa_enabled", False)
        }
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)