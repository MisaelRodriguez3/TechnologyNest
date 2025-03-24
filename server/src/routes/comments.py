from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.comments import get_all_comments_by_post, get_one_comment, create_comment, update_comment, delete_comment
from src.schemas.comments import CommentIn, CommentUpdate, PaginatedComments
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_active_account

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.get("/", response_model=ApiResponse[PaginatedComments], responses=GET_RESPONSES)
async def get_comments_paginated(session: Session = Depends(get_session), page: int = Query(1, ge=1), post_id: UUID = Query()):
    comments: PaginatedComments = get_all_comments_by_post(session, post_id, page)
    if isinstance(comments, str):
        return Response(status_code=204)
    return ApiResponse(data=comments.model_dump())

@router.post("/", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: CommentIn, session: Session = Depends(get_session), current_user = Depends(get_current_active_account)):
    response = create_comment(session, data, current_user.id)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str], responses=PUT_RESPONSES)
async def update(id: UUID, data: CommentUpdate, session: Session = Depends(get_session), _ = Depends(get_current_active_account)):
    response = update_comment(session, id, data)

    return ApiResponse(data=response)

@router.delete("/{id}", response_model=ApiResponse[str], responses=DELETE_RESPONSES)
async def delete(id: UUID, session: Session = Depends(get_session), _ = Depends(get_current_active_account)):
    response = delete_comment(session, id)

    return ApiResponse(data=response)