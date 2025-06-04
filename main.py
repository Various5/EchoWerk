# main.py
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timedelta, timezone
import logging
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import our modules
from database import get_db, User, EmailVerification, PasswordReset, RefreshToken, LoginAttempt, settings
from auth_utils import SecurityUtils, JWTManager, TwoFactorAuth, RateLimiter, SessionManager
from email_service import email_service

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# FastAPI app
app = FastAPI(
    title="Music App Authentication API",
    description="Modern authentication system with 2FA, email verification, and advanced security",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourapp.com"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "yourapp.com"]  # Add your domains
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security schemes
security = HTTPBearer()


# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = Field(None, description="TOTP code for 2FA")
    backup_code: Optional[str] = Field(None, description="Backup code for 2FA")


class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


class Enable2FA(BaseModel):
    totp_code: str = Field(..., description="TOTP code to verify setup")


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_verified: bool
    is_2fa_enabled: bool
    created_at: datetime
    last_login: Optional[datetime]


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class TwoFASetupResponse(BaseModel):
    secret: str
    qr_code_url: str
    backup_codes: List[str]


# Dependencies
async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        payload = JWTManager.verify_token(credentials.credentials, "access")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )

    return user


async def get_verified_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current verified user"""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    return current_user


# Helper functions
async def log_login_attempt(
        db: AsyncSession,
        email: str,
        ip_address: str,
        user_agent: str,
        success: bool,
        failure_reason: Optional[str] = None
):
    """Log login attempt"""
    login_attempt = LoginAttempt(
        email=email,
        ip_address=ip_address,
        user_agent=user_agent,
        success=success,
        failure_reason=failure_reason
    )
    db.add(login_attempt)
    await db.commit()


# Authentication endpoints
@app.post("/auth/register", response_model=dict, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(
        user_data: UserRegister,
        request: Request,
        db: AsyncSession = Depends(get_db)
):
    """Register new user"""
    # Validate email format
    if not SecurityUtils.validate_email_format(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Validate password strength
    is_strong, errors = SecurityUtils.validate_password_strength(user_data.password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Password does not meet requirements", "errors": errors}
        )

    # Check if user already exists
    result = await db.execute(
        select(User).where(
            (User.email == user_data.email) | (User.username == user_data.username)
        )
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Create new user
    hashed_password = SecurityUtils.hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_active=True
    )

    db.add(new_user)
    await db.flush()  # Flush to get the user ID

    # Generate email verification token
    verification_token = SecurityUtils.generate_secure_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.email_verification_expire_hours)

    email_verification = EmailVerification(
        user_id=new_user.id,
        token=verification_token,
        expires_at=expires_at
    )

    db.add(email_verification)
    await db.commit()

    # Send verification email
    verification_link = f"http://localhost:8000/auth/verify-email/{verification_token}"
    await email_service.send_verification_email(user_data.email, verification_link)

    return {
        "message": "User registered successfully. Please check your email to verify your account.",
        "user_id": str(new_user.id)
    }


@app.post("/auth/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
        user_data: UserLogin,
        request: Request,
        db: AsyncSession = Depends(get_db)
):
    """Login user"""
    ip_address = get_remote_address(request)
    user_agent = request.headers.get("User-Agent", "")

    # Check rate limiting for this IP
    rate_limit_key = f"login_attempts:{ip_address}"
    if not await RateLimiter.check_rate_limit(rate_limit_key, 10, 900):  # 10 attempts per 15 minutes
        await log_login_attempt(db, user_data.email, ip_address, user_agent, False, "Rate limited")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )

    # Find user by email
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    if not user or not SecurityUtils.verify_password(user_data.password, user.hashed_password):
        await log_login_attempt(db, user_data.email, ip_address, user_agent, False, "Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        await log_login_attempt(db, user_data.email, ip_address, user_agent, False, "Account inactive")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )

    # Check 2FA if enabled
    if user.is_2fa_enabled:
        if not user_data.totp_code and not user_data.backup_code:
            await log_login_attempt(db, user_data.email, ip_address, user_agent, False, "2FA required")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Two-factor authentication code required"
            )

        totp_valid = False
        if user_data.totp_code:
            totp_valid = TwoFactorAuth.verify_totp(user.totp_secret, user_data.totp_code)

        backup_valid = False
        if user_data.backup_code and user.backup_codes:
            backup_valid, updated_codes = TwoFactorAuth.verify_backup_code(
                user.backup_codes, user_data.backup_code
            )
            if backup_valid:
                user.backup_codes = updated_codes
                await db.commit()

        if not totp_valid and not backup_valid:
            await log_login_attempt(db, user_data.email, ip_address, user_agent, False, "Invalid 2FA code")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid two-factor authentication code"
            )

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    # Log successful login
    await log_login_attempt(db, user_data.email, ip_address, user_agent, True)

    # Create tokens
    access_token = JWTManager.create_access_token({"sub": str(user.id)})
    refresh_token = JWTManager.create_refresh_token({"sub": str(user.id)})

    # Store refresh token
    refresh_token_record = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
        device_info=user_agent
    )
    db.add(refresh_token_record)
    await db.commit()

    # Create session
    session_id = await SessionManager.create_session(str(user.id), user_agent)

    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_verified=user.is_verified,
        is_2fa_enabled=user.is_2fa_enabled,
        created_at=user.created_at,
        last_login=user.last_login
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
        user=user_response
    )


@app.get("/auth/verify-email/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    """Verify email address"""
    result = await db.execute(
        select(EmailVerification).where(
            and_(
                EmailVerification.token == token,
                EmailVerification.expires_at > datetime.now(timezone.utc),
                EmailVerification.is_used == False
            )
        )
    )
    verification = result.scalar_one_or_none()

    if not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    # Get user and update verification status
    user_result = await db.execute(select(User).where(User.id == verification.user_id))
    user = user_result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.is_verified = True
    verification.is_used = True

    await db.commit()

    return {"message": "Email verified successfully"}


@app.post("/auth/2fa/setup", response_model=TwoFASetupResponse)
async def setup_2fa(current_user: User = Depends(get_verified_user)):
    """Setup two-factor authentication"""
    if current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is already enabled"
        )

    # Generate TOTP secret
    secret = TwoFactorAuth.generate_secret()

    # Generate QR code
    qr_code_buffer = TwoFactorAuth.generate_qr_code(secret, current_user.email)

    # Generate backup codes
    backup_codes = TwoFactorAuth.generate_backup_codes()

    # Store the secret temporarily (user needs to verify it)
    current_user.totp_secret = secret

    return TwoFASetupResponse(
        secret=secret,
        qr_code_url="/auth/2fa/qr",  # We'll create this endpoint
        backup_codes=backup_codes
    )


@app.post("/auth/2fa/enable")
async def enable_2fa(
        enable_data: Enable2FA,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_verified_user)
):
    """Enable two-factor authentication"""
    if current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is already enabled"
        )

    if not current_user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please setup 2FA first"
        )

    # Verify TOTP code
    if not TwoFactorAuth.verify_totp(current_user.totp_secret, enable_data.totp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code"
        )

    # Generate and store backup codes
    backup_codes = TwoFactorAuth.generate_backup_codes()
    hashed_backup_codes = TwoFactorAuth.hash_backup_codes(backup_codes)

    current_user.is_2fa_enabled = True
    current_user.backup_codes = hashed_backup_codes

    await db.commit()

    # Send notification email
    await email_service.send_2fa_enabled_notification(current_user.email)

    return {
        "message": "Two-factor authentication enabled successfully",
        "backup_codes": backup_codes
    }


@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        is_verified=current_user.is_verified,
        is_2fa_enabled=current_user.is_2fa_enabled,
        created_at=current_user.created_at,
        last_login=current_user.last_login
    )


@app.post("/auth/logout")
async def logout(
        request: Request,
        current_user: User = Depends(get_current_user),
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db)
):
    """Logout user"""
    # Revoke refresh token
    result = await db.execute(
        select(RefreshToken).where(
            and_(
                RefreshToken.user_id == current_user.id,
                RefreshToken.is_revoked == False
            )
        )
    )
    refresh_tokens = result.scalars().all()

    for token in refresh_tokens:
        token.is_revoked = True

    await db.commit()

    # Delete all user sessions
    await SessionManager.delete_all_user_sessions(str(current_user.id))

    return {"message": "Logged out successfully"}


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)