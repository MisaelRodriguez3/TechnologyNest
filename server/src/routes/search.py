from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from src.core.database import get_session
from src.services.search import search_entries
from src.schemas.search import SearchOut
from src.utils.response import ApiResponse
from src.utils.exceptions import GET_RESPONSES

router = APIRouter(prefix='/search', tags=['Search'])

@router.post('', response_model=ApiResponse[SearchOut], responses=GET_RESPONSES)
async def search(session: Session = Depends(get_session), q: str = Query(''), page: int = Query(1, ge=1)):
    result = search_entries(_session=session, search_term=q, page=page)
    return ApiResponse(data=result.model_dump())
