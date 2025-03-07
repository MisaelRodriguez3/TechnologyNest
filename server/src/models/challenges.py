from sqlmodel import Field
from .common import Base
from uuid import UUID

class Challenge(Base, table=True):
    """"Representation of the `tbl_challenges` table of the database"""
    
    __tablename__ = "tbl_challenges"

    title: str = Field(nullable=False, min_length=5, max_length=100, index=True)
    description: str = Field(nullable=False, min_length=20, max_length=500)
    difficulty: str = Field(nullable=False, max_length=20)
    topic_id: UUID = Field(nullable=False, foreign_key="tbl_topics.id")
    user_id: UUID = Field(nullable=False, foreign_key="tbl_users.id")