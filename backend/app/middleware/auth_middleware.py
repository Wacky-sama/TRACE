from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from datetime import datetime
from app.database import SessionLocal
from app.models.user_models import User, UserRole
from app.utils.security import decode_access_token
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PUBLIC_ROUTES = [
    "/users/login",
    "/users/register",
    "/gts_responses/register",
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        logger.info(f"[{datetime.utcnow()}] Incoming: {request.method} {path}")

        # Allow public routes without token
        if any(path.startswith(route) for route in PUBLIC_ROUTES):
            return await call_next(request)

        token = request.headers.get("Authorization")
        if token and token.startswith("Bearer "):
            token = token[7:]
            try:
                payload = decode_access_token(token)
                username = payload.get("sub")
                role = payload.get("role")
                exp = payload.get("exp")

                logger.info(f"Token OK: {username}, role={role}, exp={exp}")

                db = SessionLocal()
                try:
                    user = db.query(User).filter(User.username == username).first()
                    if not user:
                        return JSONResponse({"detail": "Invalid user"}, status_code=401)

                    # Update last_seen
                    old_last_seen = user.last_seen
                    user.last_seen = datetime.utcnow()
                    db.commit()
                    logger.info(f"last_seen updated for {username}: {old_last_seen} -> {user.last_seen}")

                    if path.startswith("/admin") and user.role != UserRole.admin:
                        return JSONResponse({"detail": "Admins only"}, status_code=403)

                finally:
                    db.close()

            except Exception as e:
                logger.error(f"Auth error: {str(e)}")
                return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)

        else:
            return JSONResponse({"detail": "Authorization required"}, status_code=401)

        return await call_next(request)
