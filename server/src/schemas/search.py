from pydantic import BaseModel
from .posts import PostOut
from .examples import ExampleOut
from .challenges import ChallengeOut

class SearchOut(BaseModel):
    total_pages: int
    page: int
    posts: list[PostOut]
    challenges: list[ChallengeOut]
    examples: list[ExampleOut]