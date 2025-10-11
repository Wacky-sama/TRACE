"""Create activity_logs table (manual)

Revision ID: 91aa86d45000
Revises: bb6bc3755793
Create Date: 2025-10-11 23:22:05.293775
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "91aa86d45000"
down_revision: Union[str, Sequence[str], None] = "bb6bc3755793"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ensure extension for uuid_generate_v4 exists
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # Reference the existing enum without trying to recreate it
    action_type_enum = postgresql.ENUM(
        "register", "approve", "decline", "delete", "update", "login", "logout",
        name="action_type_enum", create_type=False
    )


    # Create the table
    op.create_table(
        "activity_logs",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
            server_default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("action_type", sa.Enum(name="action_type_enum"), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column(
            "target_user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("meta_data", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("activity_logs")
    postgresql.ENUM(name="action_type_enum").drop(op.get_bind(), checkfirst=True)
