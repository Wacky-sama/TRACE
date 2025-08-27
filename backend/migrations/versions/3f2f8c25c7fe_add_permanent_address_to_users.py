"""add permanent_address to users

Revision ID: 3f2f8c25c7fe
Revises: c8f871c63375
Create Date: 2025-08-27 16:57:15.268151

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f2f8c25c7fe'
down_revision: Union[str, Sequence[str], None] = 'c8f871c63375'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('permanent_address', sa.String(), nullable=True))
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'permanent_address')
    pass
