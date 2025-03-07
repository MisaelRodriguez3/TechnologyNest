from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.challenges import get_all_challenges_by_topic, get_one_challenge, create_challenge, update_challenge, delete_challenge
from src.schemas.challenges import ChallengeIn, ChallengeUpdate, ChallengeOut, PaginatedChallenges
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.utils.response import ApiResponse

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.get("/", response_model=ApiResponse[PaginatedChallenges], responses=GET_RESPONSES)
async def get_challenges_paginated(session: Session = Depends(get_session), page: int = Query(1, ge=1), topic_id: UUID = Query()):
    challenges: PaginatedChallenges = get_all_challenges_by_topic(session, topic_id, page)
    if isinstance(challenges, str):
        return Response(status_code=204)
    return ApiResponse(data=challenges.model_dump())

@router.get("/{id}", response_model=ApiResponse[ChallengeOut], responses=GET_RESPONSES)
async def get_challenge(id: UUID, session: Session = Depends(get_session)):
    challenge = get_one_challenge(session, id)
    
    return ApiResponse(data=challenge.model_dump())

@router.post("/", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: ChallengeIn, session: Session = Depends(get_session)):
    response = create_challenge(session, data)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str], responses=PUT_RESPONSES)
async def update(id: UUID, data: ChallengeUpdate, session: Session = Depends(get_session)):
    response = update_challenge(session, id, data)

    return ApiResponse(data=response)

@router.delete("/{id}", response_model=ApiResponse[str], responses=DELETE_RESPONSES)
async def delete(id: UUID, session: Session = Depends(get_session)):
    response = delete_challenge(session, id)

    return ApiResponse(data=response)