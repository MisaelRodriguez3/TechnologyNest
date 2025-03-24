from fastapi import APIRouter, Depends, Response
from sqlmodel import Session
from src.core.database import get_session
from src.models.users import User
from src.services.users import get_all_users, create_user, update_user, delete_user
from src.schemas.users import UserIn, UserOut, UserUpdate
from src.utils.exceptions import GET_RESPONSES
from src.utils.response import ApiResponse
from .dependencies.dependencies import get_current_account, get_current_active_account

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("",response_model=ApiResponse[list], responses=GET_RESPONSES)
async def get_all(session: Session = Depends(get_session)):
    users= get_all_users(session)
    return ApiResponse(data=users)

@router.get("/me", response_model=ApiResponse[UserOut], responses=GET_RESPONSES)
async def get_user(current_user: User = Depends(get_current_active_account)):
    return ApiResponse(data=current_user)

@router.post("", response_model=ApiResponse[str])
async def create( data: UserIn, session: Session = Depends(get_session)):
    response = create_user(session, data)

    return ApiResponse(data=response)

@router.patch("", response_model=ApiResponse[UserOut])
async def update(data: UserUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_account)):
    print("current user",current_user)
    response = update_user(session, current_user.id, data)
    return ApiResponse(data=response)