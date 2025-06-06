# backend/main.py - FIXED VERSION for Pydantic 2.0
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Union
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
    try:
        await redis_client.close()
    except:
        pass


# FastAPI app
app = FastAPI(
    title="🎵 EchoWerk Authentication API",
    description="Modern music authentication with email verification, 2FA, and enterprise security",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration - FIXED with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.0.1.10:3000",
        "https://echowerk.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ================================
# FIXED PYDANTIC MODELS - Pydantic 2.0 Compatible
# ================================

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: str
    last_name: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not v or len(v.strip()) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not v.replace('_', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v.lower().strip()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError('Password is required')
        is_valid, errors = SecurityUtils.validate_password_strength(v)
        if not is_valid:
            raise ValueError(f"Password requirements: {', '.join(errors)}")
        return v

    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v: str) -> str:
        if not v or len(v.strip()) < 1:
            raise ValueError('First name is required')
        return v.strip()

    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v: str) -> str:
        if not v or len(v.strip()) < 1:
            raise ValueError('Last name is required')
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    # FIXED: Optional fields with explicit None defaults for Pydantic 2.0
    totp_code: Optional[str] = None
    backup_code: Optional[str] = None

    @field_validator('totp_code', 'backup_code', mode='before')
    @classmethod
    def empty_str_to_none(cls, v):
        """Convert empty strings to None"""
        if v == "" or v is None:
            return None
        return str(v).strip() if v else None


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        is_valid, errors = SecurityUtils.validate_password_strength(v)
        if not is_valid:
            raise ValueError(f"Password requirements: {', '.join(errors)}")
        return v


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_verified: bool
    is_2fa_enabled: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    success: bool
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[UserResponse] = None
    requires_2fa: Optional[bool] = None
    message: str


class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


# ================================
# ENHANCED ERROR HANDLING - FIXED
# ================================

class APIError(Exception):
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code


@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
            "error_code": exc.error_code,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with clearer messages"""
    errors = []
    for error in exc.errors():
        # FIXED: Better error location parsing
        field_path = []
        for loc_item in error['loc']:
            if isinstance(loc_item, str):
                field_path.append(loc_item)
            elif isinstance(loc_item, int):
                field_path.append(f"[{loc_item}]")

        field = ".".join(field_path) if field_path else 'field'
        message = error['msg']

        # Skip 'body' prefix for cleaner error messages
        if field.startswith('body.'):
            field = field[5:]

        errors.append(f"{field}: {message}")

    error_message = "; ".join(errors)
    logger.error(f"Validation error: {error_message}")
    logger.error(f"Full validation errors: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "detail": error_message,
            "errors": exc.errors(),
            "status_code": 422
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "detail": "Internal server error",
            "status_code": 500
        }
    )


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
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                error_code="INVALID_TOKEN"
            )

        # Get user from database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                error_code="USER_INACTIVE"
            )

        return user

    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise APIError(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            error_code="AUTH_FAILED"
        )


async def rate_limit_check(request: Request, limit: int = 5, window: int = 300):
    """Rate limiting dependency"""
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"

    if not await RateLimiter.check_rate_limit(key, limit, window):
        remaining = await RateLimiter.get_remaining_attempts(key, limit)
        raise APIError(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. {remaining} attempts remaining.",
            error_code="RATE_LIMIT_EXCEEDED"
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
# ROUTES - FIXED
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
            "database": "healthy"
        }
    }


@app.post("/auth/register", response_model=StandardResponse)
async def register_user(
        user_data: UserRegister,
        background_tasks: BackgroundTasks,
        request: Request,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(lambda r: rate_limit_check(r, 3, 300))
):
    """Register new user with email verification"""

    logger.info(f"Registration attempt for email: {user_data.email}")
    logger.info(f"Registration data: {user_data.model_dump(exclude={'password'})}")

    try:
        # Check if user already exists
        existing_user = await db.execute(
            select(User).where(
                (User.email == user_data.email) | (User.username == user_data.username)
            )
        )

        if existing_user.scalar_one_or_none():
            raise APIError(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email or username already registered",
                error_code="USER_EXISTS"
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

        logger.info(f"✅ User registered successfully: {user.email}")

        return StandardResponse(
            success=True,
            message="Registration successful! Please check your email to verify your account.",
            data={"user_id": str(user.id)}
        )

    except APIError:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to server error",
            error_code="SERVER_ERROR"
        )


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

    logger.info(f"Login attempt for email: {login_data.email}")
    logger.info(f"Login data: {login_data.model_dump(exclude={'password'})}")

    try:
        # Find user
        result = await db.execute(select(User).where(User.email == login_data.email))
        user = result.scalar_one_or_none()

        if not user or not SecurityUtils.verify_password(login_data.password, user.hashed_password):
            await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "invalid_credentials")
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                error_code="INVALID_CREDENTIALS"
            )

        if not user.is_active:
            await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "account_inactive")
            raise APIError(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive",
                error_code="ACCOUNT_INACTIVE"
            )

        if not user.is_verified:
            await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "email_unverified")
            raise APIError(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email address before logging in",
                error_code="EMAIL_UNVERIFIED"
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
                    raise APIError(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid 2FA code",
                        error_code="INVALID_2FA"
                    )
            elif login_data.backup_code:
                if not user.backup_codes:
                    await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "no_backup_codes")
                    raise APIError(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="No backup codes available",
                        error_code="NO_BACKUP_CODES"
                    )

                # Verify and remove used backup code
                is_valid, updated_codes = TwoFactorAuth.verify_backup_code(user.backup_codes, login_data.backup_code)
                if not is_valid:
                    await log_login_attempt(db, login_data.email, client_ip, user_agent, False, "invalid_backup_code")
                    raise APIError(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid backup code",
                        error_code="INVALID_BACKUP_CODE"
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

        logger.info(f"✅ User logged in successfully: {user.email}")

        return LoginResponse(
            success=True,
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user),
            message="Login successful"
        )

    except APIError:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise APIError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed due to server error",
            error_code="SERVER_ERROR"
        )


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
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
            error_code="INVALID_TOKEN"
        )

    # Check if expired
    if datetime.now(timezone.utc) > verification.expires_at:
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired",
            error_code="TOKEN_EXPIRED"
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


@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.model_validate(current_user)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )