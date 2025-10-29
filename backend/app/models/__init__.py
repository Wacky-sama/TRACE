from app.database import Base

# Import all models so Alembic and SQLAlchemy see them
from app.models.activity_logs_models import ActivityLog
from app.models.event_attendance_models import EventAttendance
from app.models.events_models import Events
from app.models.gts_responses_models import GTSResponses
from app.models.trainings_models import Training
from app.models.users_models import Users
