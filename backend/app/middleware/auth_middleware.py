from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from datetime import datetime
from app.database import SessionLocal
from app.models.user import User
from app.utils.security import decode_access_token
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UpdateLastSeenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log every request to see if middleware is running
        logger.info(f"Middleware processing: {request.method} {request.url}")
        
        token = request.headers.get("Authorization")
        logger.info(f"Authorization header: {token[:50] if token else 'None'}...")
        
        if token and token.startswith("Bearer "):
            token = token[7:]
            logger.info(f"Processing request with token: {token[:20]}...")
            
            try:
                payload = decode_access_token(token)
                username = payload.get("sub")
                logger.info(f"Decoded username: {username}")
                
                db = SessionLocal()
                user = db.query(User).filter(User.username == username).first()
                
                if user:
                    old_last_seen = user.last_seen
                    user.last_seen = datetime.utcnow()
                    db.commit()
                    logger.info(f"Updated last_seen for {username} ({user.role.value}): " f"{old_last_seen} -> {user.last_seen}")
                else:
                    logger.warning(f"User not found: {username}")
                    
                db.close()
            except Exception as e:
                logger.error(f"Error in middleware: {str(e)}")
        else:
            logger.info("No valid authorization token found")
            
        response = await call_next(request)
        return response