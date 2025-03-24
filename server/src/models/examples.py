from uuid import UUID
from sqlmodel import Field, Relationship
from .common import Base
from .topics import Topic
from .users import User

class Example(Base, table=True):
    """"Representation of the `tbl_examples` table of the database"""

    __tablename__ = "tbl_examples"
    
    title: str = Field(nullable=False, min_length=5, max_length=100, index=True)
    description: str = Field(nullable=False, min_length=10, max_length=500)
    code: str = Field(nullable=False, max_length=5000)
    topic_id: UUID = Field(nullable=False, index=True, foreign_key="tbl_topics.id")
    user_id: UUID = Field(nullable=False, index=True, foreign_key="tbl_users.id")

    topic: Topic = Relationship(back_populates='examples')
    author: User = Relationship(back_populates='examples')