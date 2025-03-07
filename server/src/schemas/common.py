from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class BaseOut(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
