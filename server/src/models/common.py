from sqlmodel import SQLModel, Field
from sqlalchemy import event
from uuid import UUID, uuid4
from datetime import datetime, timezone

class Base(SQLModel):
    """Common fields in the tables of the database."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@event.listens_for(Base, "before_update", propagate=True)
def update_timesatamps(mapper, connection, target: Base):
    """Method to update the `updated_at` field of the tables when updating the record."""
    target.updated_at = datetime.now(timezone.utc)
