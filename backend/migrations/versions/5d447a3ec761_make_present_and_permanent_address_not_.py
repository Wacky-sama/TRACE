"""Make present and permanent address not null, and contact_number unique

Revision ID: 5d447a3ec761
Revises: 2d70cb796108
Create Date: 2025-10-24 04:05:54.806219

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d447a3ec761'
down_revision: Union[str, Sequence[str], None] = '2d70cb796108'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Handle NULL values in present_address and permanent_address before making them NOT NULL
    op.execute("UPDATE users SET present_address = '' WHERE present_address IS NULL")
    op.execute("UPDATE users SET permanent_address = '' WHERE permanent_address IS NULL")
    
    # Check for duplicates in contact_number before adding unique constraint
    # If duplicates exist, this will fail—manually fix data or adjust logic
    op.create_unique_constraint('uq_users_contact_number', 'users', ['contact_number'])
    
    # Now alter columns to NOT NULL
    op.alter_column('users', 'present_address',
                   existing_type=sa.VARCHAR(),
                   nullable=False)
    op.alter_column('users', 'permanent_address',
                   existing_type=sa.VARCHAR(),
                   nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'permanent_address',
                   existing_type=sa.VARCHAR(),
                   nullable=True)
    op.alter_column('users', 'present_address',
                   existing_type=sa.VARCHAR(),
                   nullable=True)
    op.drop_constraint('uq_users_contact_number', 'users', type_='unique')
    # ### end Alembic commands ###
