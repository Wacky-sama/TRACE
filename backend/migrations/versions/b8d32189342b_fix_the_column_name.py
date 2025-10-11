"""Fix the column name

Revision ID: b8d32189342b
Revises: 91aa86d45000
Create Date: 2025-10-11 23:40:58.392710

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b8d32189342b'
down_revision: Union[str, Sequence[str], None] = '91aa86d45000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
