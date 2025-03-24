from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.examples import get_all_examples, get_all_examples_by_topic, get_one_example, create_example, update_example, delete_example
from src.schemas.examples import ExampleIn, ExampleUpdate, ExampleOut, PaginatedExamples
from src.utils.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_active_account

router = APIRouter(prefix="/examples", tags=["Examples"])

@router.get("/", response_model=ApiResponse[PaginatedExamples], responses=GET_RESPONSES)
async def get_examples_paginated(session: Session = Depends(get_session), page: int = Query(1, ge=1), topic_id: UUID | None = Query(default=None)):
    if topic_id:
        examples = get_all_examples_by_topic(session, topic_id, page)
    else: 
        examples = get_all_examples(session, page)
    if isinstance(examples, str):
        return Response(status_code=204)
    return ApiResponse(data=examples.model_dump())

@router.get("/{id}", response_model=ApiResponse[ExampleOut], responses=GET_RESPONSES)
async def get_example(id: UUID, session: Session = Depends(get_session)):
    example = get_one_example(session, id)
    
    return ApiResponse(data=example.model_dump())

@router.post("/", response_model=ApiResponse[str], status_code=201, responses=POST_RESPONSES)
async def create(data: ExampleIn, session: Session = Depends(get_session), current_user = Depends(get_current_active_account)):
    response = create_example(session, data, current_user.id)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str], responses=PUT_RESPONSES)
async def update(id: UUID, data: ExampleUpdate, session: Session = Depends(get_session), _ = Depends(get_current_active_account)):
    response = update_example(session, id, data)

    return ApiResponse(data=response)

@router.delete("/{id}", response_model=ApiResponse[str], responses=DELETE_RESPONSES)
async def delete(id: UUID, session: Session = Depends(get_session), _ = Depends(get_current_active_account)):
    response = delete_example(session, id)

    return ApiResponse(data=response)