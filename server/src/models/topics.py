from sqlmodel import Field, Relationship
from .common import Base

class Topic(Base, table=True):
    """"Representation of the `tbl_topics` table of the database"""

    __tablename__ = "tbl_topics"

    name: str = Field(nullable=False, min_length=1, max_length=50, unique=True, index=True)
    image_url: str = Field(nullable=False, max_length=255)

    challenges: list['Challenge'] = Relationship(back_populates='topic')
    examples: list['Example'] = Relationship(back_populates='topic')
    posts: list['Post'] = Relationship(back_populates='topic')