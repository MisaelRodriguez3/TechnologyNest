from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.core.database import get_session
from uuid import UUID
from src.services.users import get_all_users, get_one_user, create_user, update_user, delete_user
from src.schemas.users import UserIn, UserOut, UserUpdate
from src.utils.exceptions import GET_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_account

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", responses=GET_RESPONSES)
async def get_all(session: Session = Depends(get_session)):
    return get_all_users(session)

@router.get("/me", response_model=UserOut, responses=GET_RESPONSES)
async def get_user(session: Session = Depends(get_session), current_user = Depends(get_current_account)):
    return current_user

@router.post("", response_model=ApiResponse[str])
async def create( data: UserIn, session: Session = Depends(get_session)):
    response =  create_user(session, data)

    return ApiResponse(data=response)

@router.patch("/{id}", response_model=ApiResponse[str])
async def update(id: UUID, data: UserUpdate, session: Session = Depends(get_session)):
    response = update_user(session, id, data)
    return ApiResponse(data=response)