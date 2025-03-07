from sqlmodel import Field
from .common import Base
from uuid import UUID

class Post(Base, table=True):
    """"Representation of the `tbl_posts` table of the database"""

    __tablename__ = "tbl_posts"
    
    title: str = Field(nullable=False, min_length=5, max_length=100, index=True)
    description: str = Field(nullable=False, min_length=20, max_length=500)
    code: str | None = Field(nullable=True, default=None)
    topic_id: UUID = Field(nullable=False, index=True, foreign_key="tbl_topics.id")
    user_id: UUID = Field(nullable=False, index=True, foreign_key="tbl_users.id")