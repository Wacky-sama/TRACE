import logging
from datetime import datetime

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.database import SessionLocal
from app.models.users_models import UserRole, Users
from app.utils.security import decode_access_token

# Configure logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("auth_middleware")

PUBLIC_ROUTES = [
    "/users/login",
    "/users/register",
    "/users/check-email",
    "/users/check-username",
    "/gts_responses/register",
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        # Skip authentication for public routes
        if any(path.startswith(route) for route in PUBLIC_ROUTES):
            logger.debug(f"Public route accessed: {method} {path}")
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            logger.warning(f"Unauthorized access attempt: {method} {path}")
            return JSONResponse({"detail": "Authorization required"}, status_code=401)

        token = token[7:]
        db = SessionLocal()

        try:
            payload = decode_access_token(token)
            username = payload.get("sub")
            role = payload.get("role", "unknown")

            if not username:
                raise ValueError("Missing username in token payload")

            # Validate user existence
            user = db.query(Users).filter(Users.username == username).first()
            if not user:
                logger.warning(f"Invalid user token: {username}")
                return JSONResponse({"detail": "Invalid user"}, status_code=401)

            # Role restriction check
            if path.startswith("/admin") and user.role != UserRole.admin:
                logger.warning(f"Unauthorized admin access: {username}")
                return JSONResponse({"detail": "Admins only"}, status_code=403)

            # Update last_seen only if > 10s difference to reduce DB writes
            now = datetime.utcnow()
            if not user.last_seen or (now - user.last_seen).total_seconds() > 10:
                old_seen = user.last_seen
                user.last_seen = now
                db.commit()
                logger.debug(f"{username} last_seen updated ({old_seen} → {now})")

            logger.info(f"{method} {path} | user={username} | role={role} | OK")

        except Exception as e:
            logger.error(f"Auth error for {method} {path}: {str(e)}")
            return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)

        finally:
            db.close()

        return await call_next(request)
