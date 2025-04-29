from uuid import UUID
from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session
from src.core.database import get_session
from src.services.challenges import (
    get_all_challenges,
    get_all_challenges_by_topic, 
    get_one_challenge, 
    create_challenge, 
    update_challenge, 
    delete_challenge
)
from src.schemas.challenges import ChallengeIn, ChallengeUpdate, ChallengeOut, PaginatedChallenges
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_active_account, is_author

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.get("", response_model=ApiResponse[PaginatedChallenges], responses=GET_RESPONSES)
async def get_challenges_paginated(session: Session = Depends(get_session), page: int = Query(1, ge=1), topic_id: UUID | None = Query(default=None)):
    if topic_id:
        challenges = get_all_challenges_by_topic(session, topic_id, page)
    else:
        challenges = get_all_challenges(session, page)

    if isinstance(challenges, str):
        return Response(status_code=204)

    return ApiResponse(data=challenges.model_dump())

@router.get("/{id}", response_model=ApiResponse[ChallengeOut], responses=GET_RESPONSES)
async def get_challenge(id: UUID, session: Session = Depends(get_session)):
    challenge = get_one_challenge(session, id)
    
    return ApiResponse(data=challenge.model_dump())

@router.post("", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: ChallengeIn, session: Session = Depends(get_session), currrent_user = Depends(get_current_active_account)):
    response = create_challenge(session, data, currrent_user.id)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str], responses=PUT_RESPONSES)
async def update(id: UUID, data: ChallengeUpdate, session: Session = Depends(get_session), _ = Depends(is_author('challenges'))):
    response = update_challenge(session, id, data)

    return ApiResponse(data=response)

@router.delete("/{id}", response_model=ApiResponse[str], responses=DELETE_RESPONSES)
async def delete(id: UUID, session: Session = Depends(get_session), _ = Depends(is_author('challenges'))):
    response = delete_challenge(session, id)

    return ApiResponse(data=response)