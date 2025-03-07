from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.posts import get_all_posts_by_topic, get_one_post, create_post, update_post, delete_post
from src.schemas.posts import PostIn, PostUpdate, PostOut, PaginatedPosts
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.utils.response import ApiResponse

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/", response_model=ApiResponse[PaginatedPosts], responses=GET_RESPONSES)
async def get_posts_paginated(session: Session = Depends(get_session), page: int = Query(1, ge=1), topic_id: UUID = Query()):
    posts: PaginatedPosts = get_all_posts_by_topic(session, topic_id, page)
    if isinstance(posts, str):
        return Response(status_code=204)
    return ApiResponse(data=posts.model_dump())

@router.get("/{id}", response_model=ApiResponse[PostOut], responses=GET_RESPONSES)
async def get_post(id: UUID, session: Session = Depends(get_session)):
    post = get_one_post(session, id)
    
    return ApiResponse(data=post.model_dump())

@router.post("/", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: PostIn, session: Session = Depends(get_session)):
    response = create_post(session, data)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str], responses=PUT_RESPONSES)
async def update(id: UUID, data: PostUpdate, session: Session = Depends(get_session)):
    response = update_post(session, id, data)

    return ApiResponse(data=response)

@router.delete("/{id}", response_model=ApiResponse[str], responses=DELETE_RESPONSES)
async def delete(id: UUID, session: Session = Depends(get_session)):
    response = delete_post(session, id)

    return ApiResponse(data=response)