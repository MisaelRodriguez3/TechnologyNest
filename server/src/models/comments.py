from uuid import UUID
from sqlmodel import Field, Relationship
from .common import Base
from .users import User

class Comment(Base, table=True):
    """"Representation of the `tbl_comments` table of the database"""

    __tablename__ = "tbl_comments"
    
    comment: str = Field(nullable=False, min_length=5, max_length=2500)
    post_id: UUID = Field(nullable=False, index=True, foreign_key="tbl_posts.id")
    user_id: UUID = Field(nullable=False, foreign_key="tbl_users.id")

    author: User = Relationship(back_populates='comments')