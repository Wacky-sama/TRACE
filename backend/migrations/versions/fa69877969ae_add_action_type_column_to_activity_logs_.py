"""Add action_type column to activity_logs using actiontype enum

Revision ID: fa69877969ae
Revises: 23a5c825e068
Create Date: 2025-10-13 16:18:02.709980

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fa69877969ae"
down_revision = "23a5c825e068"
branch_labels = None
depends_on = None


def upgrade():
    # Define the existing enum type
    actiontype_enum = sa.Enum(
        "register", "approve", "decline", "delete", "update", "login", "logout",
        name="actiontype"
    )

    # Ensure the enum type exists in PostgreSQL (safe even if already there)
    actiontype_enum.create(op.get_bind(), checkfirst=True)

    # Add the new column to activity_logs
    op.add_column(
        "activity_logs",
        sa.Column("action_type", actiontype_enum, nullable=False, server_default="register")
    )

    # Remove the server_default so new rows must explicitly set it
    op.alter_column("activity_logs", "action_type", server_default=None)


def downgrade():
    op.drop_column("activity_logs", "action_type")
