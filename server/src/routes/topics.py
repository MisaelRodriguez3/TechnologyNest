from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.topics import get_all_topics, create_topic, update_topic, delete_topic
from src.schemas.topics import TopicIn, TopicUpdate, TopicOut
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES
from src.utils.response import ApiResponse

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("/", response_model=ApiResponse[list[TopicOut]], responses=GET_RESPONSES)
async def get_topics(session: Session = Depends(get_session)):
    topics = get_all_topics(session)

    return ApiResponse(data=topics)

@router.post("/", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: TopicIn, session: Session = Depends(get_session)):
    response =  create_topic(session, data)

    return ApiResponse(status=201,data=response)