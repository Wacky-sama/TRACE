"""Change description column to JSON in activity_logs

Revision ID: 484dfc9ecb55
Revises: fa69877969ae
Create Date: 2025-10-13 16:26:49.266352
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "484dfc9ecb55"
down_revision = "fa69877969ae"
branch_labels = None
depends_on = None


def upgrade():
    # Alter the column from TEXT to JSON
    op.alter_column(
        "activity_logs",
        "description",
        type_=sa.JSON(),
        existing_type=sa.Text(),
        postgresql_using="description::json"
    )


def downgrade():
    # Revert back to TEXT if needed
    op.alter_column(
        "activity_logs",
        "description",
        type_=sa.Text(),
        existing_type=sa.JSON(),
        postgresql_using="description::text"
    )
