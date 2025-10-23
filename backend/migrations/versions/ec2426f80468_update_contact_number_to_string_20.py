"""Update contact_number to String(20)

Revision ID: ec2426f80468
Revises: d40858bd6e3f
Create Date: 2025-10-23 23:33:51.229126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ec2426f80468'
down_revision: Union[str, Sequence[str], None] = 'd40858bd6e3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('users', 'contact_number',
                    existing_type=sa.String(),
                    type_=sa.String(20),
                    existing_nullable=True
                    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'contact_number',
                    existing_type=sa.String(20),
                    type_=sa.String(),
                    existing_nullable=True
                    )
