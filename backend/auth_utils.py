# auth_utils.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Union
import secrets
import json
import hashlib
import base64
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import pyotp
import qrcode
from io import BytesIO
import redis.asyncio as redis
from jose import JWTError, jwt
from fastapi import HTTPException, status
from email_validator import validate_email, EmailNotValidError
from database import settings

# Password hashing with Argon2
ph = PasswordHasher(
    time_cost=2,  # Number of iterations
    memory_cost=65536,  # Memory usage in KiB
    parallelism=1,  # Number of parallel threads
    hash_len=32,  # Hash length
    salt_len=16  # Salt length
)

# Redis connection
redis_client = redis.from_url(settings.redis_url, decode_responses=True)


class SecurityUtils:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using Argon2"""
        return ph.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        try:
            ph.verify(hashed_password, plain_password)
            return True
        except VerifyMismatchError:
            return False

    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate cryptographically secure random token"""
        return secrets.token_urlsafe(length)

    @staticmethod
    def validate_email_format(email: str) -> bool:
        """Validate email format"""
        try:
            validate_email(email)
            return True
        except EmailNotValidError:
            return False

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, list[str]]:
        """Validate password strength"""
        errors = []

        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        if len(password) > 128:
            errors.append("Password must be less than 128 characters")
        if not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        if not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one number")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            errors.append("Password must contain at least one special character")

        return len(errors) == 0, errors


class JWTManager:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)

        to_encode.update({"exp": expire, "type": "access"})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

    @staticmethod
    def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT refresh token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)

        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> dict:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )


class TwoFactorAuth:
    @staticmethod
    def generate_secret() -> str:
        """Generate TOTP secret"""
        return pyotp.random_base32()

    @staticmethod
    def generate_qr_code(secret: str, email: str, app_name: str = None) -> BytesIO:
        """Generate QR code for TOTP setup"""
        if app_name is None:
            app_name = settings.app_name

        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=email,
            issuer_name=app_name
        )

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        return img_buffer

    @staticmethod
    def verify_totp(secret: str, token: str, window: int = 1) -> bool:
        """Verify TOTP token"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=window)

    @staticmethod
    def generate_backup_codes(count: int = 8) -> list[str]:
        """Generate backup codes for 2FA"""
        return [secrets.token_hex(4).upper() for _ in range(count)]

    @staticmethod
    def hash_backup_codes(codes: list[str]) -> str:
        """Hash backup codes for storage"""
        hashed_codes = []
        for code in codes:
            # Use SHA-256 for backup codes (less computationally expensive than Argon2)
            hashed = hashlib.sha256(code.encode()).hexdigest()
            hashed_codes.append(hashed)
        return json.dumps(hashed_codes)

    @staticmethod
    def verify_backup_code(stored_codes: str, code: str) -> tuple[bool, str]:
        """Verify backup code and return updated codes list"""
        try:
            codes_list = json.loads(stored_codes)
            code_hash = hashlib.sha256(code.upper().encode()).hexdigest()

            if code_hash in codes_list:
                codes_list.remove(code_hash)  # Remove used code
                return True, json.dumps(codes_list)
            return False, stored_codes
        except (json.JSONDecodeError, ValueError):
            return False, stored_codes


class RateLimiter:
    @staticmethod
    async def check_rate_limit(key: str, limit: int, window: int) -> bool:
        """Check if rate limit is exceeded"""
        current = await redis_client.get(key)
        if current is None:
            await redis_client.setex(key, window, 1)
            return True
        elif int(current) < limit:
            await redis_client.incr(key)
            return True
        return False

    @staticmethod
    async def get_remaining_attempts(key: str, limit: int) -> int:
        """Get remaining attempts for rate limit"""
        current = await redis_client.get(key)
        if current is None:
            return limit
        return max(0, limit - int(current))


class SessionManager:
    @staticmethod
    async def create_session(user_id: str, device_info: str = None) -> str:
        """Create user session"""
        session_id = SecurityUtils.generate_secure_token()
        session_data = {
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "device_info": device_info
        }

        # Store session for 24 hours
        await redis_client.setex(
            f"session:{session_id}",
            86400,
            json.dumps(session_data)
        )
        return session_id

    @staticmethod
    async def get_session(session_id: str) -> Optional[dict]:
        """Get session data"""
        session_data = await redis_client.get(f"session:{session_id}")
        if session_data:
            return json.loads(session_data)
        return None

    @staticmethod
    async def delete_session(session_id: str) -> bool:
        """Delete session"""
        result = await redis_client.delete(f"session:{session_id}")
        return result > 0

    @staticmethod
    async def delete_all_user_sessions(user_id: str) -> int:
        """Delete all sessions for a user"""
        pattern = "session:*"
        keys = await redis_client.keys(pattern)
        deleted = 0

        for key in keys:
            session_data = await redis_client.get(key)
            if session_data:
                data = json.loads(session_data)
                if data.get("user_id") == user_id:
                    await redis_client.delete(key)
                    deleted += 1

        return deleted