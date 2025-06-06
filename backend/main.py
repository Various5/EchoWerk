# main.py - Complete Production-Ready Backend
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime, timedelta, timezone
from typing import Optional, List
import secrets
import os
import asyncio
import logging
from contextlib import asynccontextmanager

# Import our modules
from database import get_db, User, EmailVerification, PasswordReset, RefreshToken, LoginAttempt, settings
from auth_utils import (
    SecurityUtils, JWTManager, TwoFactorAuth, RateLimiter,
    SessionManager, redis_client
)
from email_service import email_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting EchoWerk Authentication API")
    try:
        # Test Redis connection
        await redis_client.ping()
        logger.info("✅ Redis connection established")
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {e}")

    yield

    # Shutdown
    logger.info("🛑 Shutting down EchoWerk API")
    await redis_client.close()


# FastAPI app
app = FastAPI(
    title="🎵 EchoWerk Authentication API",
    description="Modern music authentication with email verification, 2FA, and enterprise security",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://10.0.1.10:3000", "https://echowerk.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# PYDANTIC MODELS
# ================================

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: str
    last_name: str

    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not v.replace('_', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v.lower()

    @validator('password')
    def validate_password(cls, v):
        is_valid, errors = SecurityUtils.validate_password_strength(v)
        if not is_valid:
            raise ValueError(f"Password requirements: {', '.join(errors)}")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None
    backup_code: Optional[str] = None


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @validator('new_password')
    def validate_new_password(cls, v):
        is_valid, errors = SecurityUtils.validate_password_strength(v)
        if not is_valid:
            raise ValueError(f"Password requirements: {', '.join(errors)}")
        return v


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class Setup2FARequest(BaseModel):
    password: str


class Enable2FARequest(BaseModel):
    totp_code: str


class Disable2FARequest(BaseModel):
    password: str


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


class LoginResponse(BaseModel):
    success: bool
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[UserResponse] = None
    requires_2fa: Optional[bool] = None
    message: str


# ================================
# DEPENDENCIES
# ================================

async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        payload = JWTManager.verify_token(credentials.credentials, "access")
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        # Get user from database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        return user

    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


async def rate_limit_check(request: Request, limit: int = 5, window: int = 300):
    """Rate limiting dependency"""
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"

    if not await RateLimiter.check_rate_limit(key, limit, window):
        remaining = await RateLimiter.get_remaining_attempts(key, limit)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. {remaining} attempts remaining."
        )


# ================================
# UTILITY FUNCTIONS
# ================================

async def log_login_attempt(db: AsyncSession, email: str, ip_address: str,
                            user_agent: str, success: bool, failure_reason: str = None):
    """Log login attempt"""
    attempt = LoginAttempt(
        email=email,
        ip_address=ip_address,
        user_agent=user_agent,
        success=success,
        failure_reason=failure_reason
    )
    db.add(attempt)
    await db.commit()


async def create_verification_token(db: AsyncSession, user_id: str) -> str:
    """Create email verification token"""
    token = SecurityUtils.generate_secure_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.email_verification_expire_hours)

    verification = EmailVerification(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )
    db.add(verification)
    await db.commit()

    return token


async def send_verification_email_async(email: str, token: str):
    """Send verification email in background"""
    verification_link = f"http://localhost:3000/verify-email/{token}"
    await email_service.send_verification_email(email, verification_link)


# ================================
# ROUTES
# ================================

@app.get("/")
async def root():
    """API Root endpoint"""
    return {
        "name": "🎵 EchoWerk Authentication API",
        "version": "2.0.0",
        "status": "operational",
        "documentation": "/docs",
        "health": "/health",
        "features": [
            "🔐 Enterprise-grade authentication",
            "📧 Email verification",
            "🛡️ Two-factor authentication",
            "🔄 JWT token management",
            "⚡ Redis caching",
            "📊 Rate limiting",
            "🎯 Modern security practices"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Redis
        await redis_client.ping()
        redis_status = "healthy"
    except:
        redis_status = "unhealthy"

    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "api": "healthy",
            "redis": redis_status,
            "database": "healthy"  # Could add DB ping here
        }
    }


@app.post("/auth/register", response_model=dict)
async def register_user(
        user_data: UserRegister,
        background_tasks: BackgroundTasks,
        request: Request,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(lambda r: rate_limit_check(r, 3, 300))
):
    """Register new user with email verification"""

    # Check if user already exists
    existing_user = await db.execute(
        select(User).where(
            (User.email == user_data.email) | (User.username == user_data.username)
        )
    )

    if existing_user.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already registered"
        )

    # Create user
    hashed_password = SecurityUtils.hash_password(user_data.password)

    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_active=True,
        is_verified=False
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Create verification token
    token = await create_verification_token(db, str(user.id))

    # Send verification email in background
    background_tasks.add_task(send_verification_email_async, user.email, token)

    logger.info(f"✅ User registered: {user.email}")

    return {
        "success": True,
        "message": "Registration successful! Please check your email to verify your account.",
        "user_id": str(user.id)
    }


@app.get("/auth/verify-email/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    """Verify email address"""

    # Find verification token
    result = await db.execute(
        select(EmailVerification).where(
            EmailVerification.token == token,
            EmailVerification.is_used == False
        )
    )
    verification = result.scalar_one_or_none()

    if not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    # Check if expired
    if datetime.now(timezone.utc) > verification.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired"
        )

    # Update user as verified
    await db.execute(
        update(User)
        .where(User.id == verification.user_id)
        .values(is_verified=True)
    )

    # Mark token as used
    verification.is_used = True
    await db.commit()

    logger.info(f"✅ Email verified for user: {verification.user_id}")

    # Return success HTML page
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>✅ Email Verified - EchoWerk</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                color: #f8fafc;
                margin: 0;
                padding: 40px;
                text-align: center;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }}
            .container {{
                max-width: 500px;
                background: rgba(26, 26, 46, 0.8);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 60px 40px;
                border: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            }}
            .icon {{ font-size: 4rem; margin-bottom: 24px; }}
            .title {{
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }}
            .message {{ font-size: 1.1rem; margin-bottom: 32px; color: #cbd5e1; }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                transition: transform 0.3s ease;
            }}
            .button:hover {{ transform: translateY(-2px); }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🎉</div>
            <h1 class="title">Email Verified!</h1>
            <p class="message">Welcome to EchoWerk! Your email has been successfully verified. You can now access all features and start your musical journey.</p>
            <a href="http://localhost:3000/login" class="button">Continue to Login →</a>
        </div>
    </body>
    </html>
    """, status_code=200)


@app.post("/auth/login", response_model=LoginResponse)
async def login_user(
        login_data: UserLogin,
        request: Request,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(lambda r: rate_limit_check(r, 5, 300))
):
    """Authenticate user with optional 2FA"""

    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")

    # Find user
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not SecurityUtils.verify_password(login_data.password, user.hashed_password):
        await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "invalid_credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "account_inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    if not user.is_verified:
        await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "email_unverified")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before logging in"
        )

    # Check 2FA if enabled
    if user.is_2fa_enabled:
        if not login_data.totp_code and not login_data.backup_code:
            return LoginResponse(
                success=False,
                requires_2fa=True,
                message="Two-factor authentication code required"
            )

        # Verify 2FA
        if login_data.totp_code:
            if not TwoFactorAuth.verify_totp(user.totp_secret, login_data.totp_code):
                await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "invalid_2fa")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid 2FA code"
                )
        elif login_data.backup_code:
            if not user.backup_codes:
                await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "no_backup_codes")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="No backup codes available"
                )

            # Verify and remove used backup code
            is_valid, updated_codes = TwoFactorAuth.verify_backup_code(user.backup_codes, login_data.backup_code)
            if not is_valid:
                await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "invalid_backup_code")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid backup code"
                )

            # Update user's backup codes
            user.backup_codes = updated_codes
            await db.commit()

    # Successful login - create tokens
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = JWTManager.create_access_token(token_data)
    refresh_token = JWTManager.create_refresh_token(token_data)

    # Store refresh token
    refresh_token_obj = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
        device_info=user_agent
    )
    db.add(refresh_token_obj)

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    await log_login_attempt(db, login_data.email, client_ip, user_agent, True)

    logger.info(f"✅ User logged in: {user.email}")

    return LoginResponse(
        success=True,
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            is_verified=user.is_verified,
            is_2fa_enabled=user.is_2fa_enabled,
            created_at=user.created_at,
            last_login=user.last_login
        ),
        message="Login successful"
    )


@app.post("/auth/refresh")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    """Refresh access token"""

    # Verify refresh token
    try:
        payload = JWTManager.verify_token(refresh_token, "refresh")
        user_id = payload.get("sub")
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Check if refresh token exists and is not revoked
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False
        )
    )
    token_obj = result.scalar_one_or_none()

    if not token_obj or datetime.now(timezone.utc) > token_obj.expires_at:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired or invalid"
        )

    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # Create new access token
    token_data = {"sub": str(user.id), "email": user.email}
    new_access_token = JWTManager.create_access_token(token_data)

    return {"access_token": new_access_token}


@app.post("/auth/logout")
async def logout_user(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Logout user and revoke refresh tokens"""

    # Revoke all refresh tokens for this user
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == current_user.id)
        .values(is_revoked=True)
    )
    await db.commit()

    logger.info(f"✅ User logged out: {current_user.email}")

    return {"message": "Logged out successfully"}


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


@app.put("/auth/profile", response_model=UserResponse)
async def update_profile(
        profile_data: UserUpdate,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Update user profile"""

    # Check if username is taken
    if profile_data.username and profile_data.username != current_user.username:
        existing = await db.execute(
            select(User).where(
                User.username == profile_data.username,
                User.id != current_user.id
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken"
            )

    # Update user
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    logger.info(f"✅ Profile updated: {current_user.email}")

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


@app.post("/auth/change-password")
async def change_password(
        password_data: PasswordChange,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Change user password"""

    # Verify current password
    if not SecurityUtils.verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Hash new password
    new_hashed_password = SecurityUtils.hash_password(password_data.new_password)
    current_user.hashed_password = new_hashed_password

    # Revoke all refresh tokens (force re-login)
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == current_user.id)
        .values(is_revoked=True)
    )

    await db.commit()

    logger.info(f"✅ Password changed: {current_user.email}")

    return {"message": "Password changed successfully"}


# ================================
# 2FA ENDPOINTS
# ================================

@app.post("/auth/2fa/setup")
async def setup_2fa(
        setup_data: Setup2FARequest,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Setup two-factor authentication"""

    # Verify password
    if not SecurityUtils.verify_password(setup_data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )

    if current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is already enabled"
        )

    # Generate TOTP secret and QR code
    secret = TwoFactorAuth.generate_secret()
    qr_code_data = TwoFactorAuth.generate_qr_code(secret, current_user.email)
    backup_codes = TwoFactorAuth.generate_backup_codes()

    # Store temporary secret in Redis (expires in 10 minutes)
    await redis_client.setex(
        f"2fa_setup:{current_user.id}",
        600,
        f"{secret}:{TwoFactorAuth.hash_backup_codes(backup_codes)}"
    )

    return {
        "secret": secret,
        "qr_code": qr_code_data,
        "backup_codes": backup_codes,
        "message": "Scan the QR code with your authenticator app"
    }


@app.post("/auth/2fa/enable")
async def enable_2fa(
        enable_data: Enable2FARequest,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Enable two-factor authentication"""

    # Get temporary secret from Redis
    setup_data = await redis_client.get(f"2fa_setup:{current_user.id}")
    if not setup_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No 2FA setup in progress. Please start setup first."
        )

    secret, hashed_backup_codes = setup_data.split(":", 1)

    # Verify TOTP code
    if not TwoFactorAuth.verify_totp(secret, enable_data.totp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code"
        )

    # Enable 2FA for user
    current_user.is_2fa_enabled = True
    current_user.totp_secret = secret
    current_user.backup_codes = hashed_backup_codes

    await db.commit()

    # Clean up Redis
    await redis_client.delete(f"2fa_setup:{current_user.id}")

    logger.info(f"✅ 2FA enabled: {current_user.email}")

    return {"message": "Two-factor authentication enabled successfully"}


@app.post("/auth/2fa/disable")
async def disable_2fa(
        disable_data: Disable2FARequest,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """Disable two-factor authentication"""

    # Verify password
    if not SecurityUtils.verify_password(disable_data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )

    if not current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is not enabled"
        )

    # Disable 2FA
    current_user.is_2fa_enabled = False
    current_user.totp_secret = None
    current_user.backup_codes = None

    await db.commit()

    logger.info(f"⚠️ 2FA disabled: {current_user.email}")

    return {"message": "Two-factor authentication disabled"}


# ================================
# PASSWORD RESET ENDPOINTS
# ================================

@app.post("/auth/forgot-password")
async def forgot_password(
        request_data: PasswordResetRequest,
        background_tasks: BackgroundTasks,
        db: AsyncSession = Depends(get_db)
):
    """Request password reset"""

    # Find user
    result = await db.execute(select(User).where(User.email == request_data.email))
    user = result.scalar_one_or_none()

    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent"}

    # Create reset token
    token = SecurityUtils.generate_secure_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

    reset = PasswordReset(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(reset)
    await db.commit()

    # Send reset email
    reset_link = f"http://localhost:3000/reset-password/{token}"
    background_tasks.add_task(email_service.send_password_reset_email, user.email, reset_link)

    return {"message": "If the email exists, a reset link has been sent"}


@app.post("/auth/reset-password")
async def reset_password(
        reset_data: PasswordResetConfirm,
        db: AsyncSession = Depends(get_db)
):
    """Reset password with token"""

    # Find reset token
    result = await db.execute(
        select(PasswordReset).where(
            PasswordReset.token == reset_data.token,
            PasswordReset.is_used == False
        )
    )
    reset = result.scalar_one_or_none()

    if not reset or datetime.now(timezone.utc) > reset.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Get user
    result = await db.execute(select(User).where(User.id == reset.user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update password
    user.hashed_password = SecurityUtils.hash_password(reset_data.new_password)
    reset.is_used = True

    # Revoke all refresh tokens
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user.id)
        .values(is_revoked=True)
    )

    await db.commit()

    logger.info(f"✅ Password reset: {user.email}")

    return {"message": "Password reset successfully"}


# ================================
# ERROR HANDLERS
# ================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )