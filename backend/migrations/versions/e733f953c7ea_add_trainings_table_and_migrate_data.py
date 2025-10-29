"""Add trainings table and migrate data

Revision ID: e733f953c7ea
Revises: ac1e1f3e9ea5
Create Date: 2025-10-29 22:12:55.187391

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid

# revision identifiers, used by Alembic.
revision: str = 'e733f953c7ea'
down_revision: Union[str, Sequence[str], None] = 'ac1e1f3e9ea5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema: Add trainings table (if not exists), migrate data, drop old column."""
    connection = op.get_bind()
    
    # Check if trainings table already exists
    result = connection.execute(sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trainings')")).fetchone()
    table_exists = result[0]
    
    if not table_exists:
        # Create the trainings table only if it doesn't exist
        op.create_table(
            'trainings',
            sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
            sa.Column('gts_id', UUID(as_uuid=True), sa.ForeignKey('gts_responses.id'), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('duration', sa.String(), nullable=True),
            sa.Column('credits_earned', sa.String(), nullable=True),
            sa.Column('institution', sa.String(), nullable=True),
        )
    
    # Migrate existing JSONB data to the new table (only if not already migrated)
    gts_responses = connection.execute(sa.text("SELECT id, trainings FROM gts_responses WHERE trainings IS NOT NULL")).fetchall()
    for gts_id, trainings_json in gts_responses:
        if trainings_json and isinstance(trainings_json, list):
            # Check if data is already migrated (avoid duplicates)
            existing_count = connection.execute(sa.text("SELECT COUNT(*) FROM trainings WHERE gts_id = :gts_id"), {'gts_id': gts_id}).fetchone()[0]
            if existing_count == 0:  # Only migrate if no trainings exist for this gts_id
                for item in trainings_json:
                    connection.execute(
                        sa.text("INSERT INTO trainings (id, gts_id, title, duration, credits_earned, institution) VALUES (:id, :gts_id, :title, :duration, :credits_earned, :institution)"),
                        {
                            'id': str(uuid.uuid4()),
                            'gts_id': gts_id,
                            'title': item.get('title', ''),
                            'duration': item.get('duration'),
                            'credits_earned': item.get('credits_earned'),
                            'institution': item.get('institution'),
                        }
                    )
    
    # Drop the old trainings column (check if it exists)
    column_exists = connection.execute(sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gts_responses' AND column_name = 'trainings')")).fetchone()[0]
    if column_exists:
        op.drop_column('gts_responses', 'trainings')


def downgrade() -> None:
    """Downgrade schema: Add back trainings column, migrate data back."""
    # Add back the JSONB column
    op.add_column('gts_responses', sa.Column('trainings', sa.JSON(), nullable=True))
    
    # Migrate data back from trainings table to JSONB
    connection = op.get_bind()
    gts_ids = connection.execute(sa.text("SELECT DISTINCT gts_id FROM trainings")).fetchall()
    for (gts_id,) in gts_ids:
        trainings = connection.execute(sa.text("SELECT title, duration, credits_earned, institution FROM trainings WHERE gts_id = :gts_id"), {'gts_id': gts_id}).fetchall()
        trainings_list = [
            {'title': t[0], 'duration': t[1], 'credits_earned': t[2], 'institution': t[3]}
            for t in trainings
        ]
        connection.execute(sa.text("UPDATE gts_responses SET trainings = :trainings WHERE id = :gts_id"), {'trainings': trainings_list, 'gts_id': gts_id})
    
    # Drop the trainings table
    op.drop_table('trainings')
