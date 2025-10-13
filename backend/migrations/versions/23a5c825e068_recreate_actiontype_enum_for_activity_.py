"""Recreate actiontype enum for activity_logs

Revision ID: 23a5c825e068
Revises: b8d32189342b
Create Date: 2025-10-13 16:00:42.004869

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '23a5c825e068'
down_revision: Union[str, Sequence[str], None] = 'b8d32189342b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'actiontype') THEN
                CREATE TYPE actiontype AS ENUM (
                    'register',
                    'approve',
                    'decline',
                    'delete',
                    'update',
                    'login',
                    'logout'
                );
            END IF;
        END$$;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'actiontype') THEN
                DROP TYPE actiontype;
            END IF;
        END$$;
    """)

