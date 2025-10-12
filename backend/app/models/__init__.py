from app.database import Base

# Import all models so Alembic and SQLAlchemy see them
from app.models.users_models import User
from app.models.events_models import Event
from app.models.gts_responses_models import GTSResponse
from app.models.event_attendance_models import EventAttendance
from app.models.activity_logs_models import ActivityLog
