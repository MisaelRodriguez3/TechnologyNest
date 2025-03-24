import math
from typing import Sequence, Type, TypeVar
from pydantic import BaseModel
from sqlmodel import Session, SQLModel
from sqlmodel import Session, select, func
from src.schemas.common import Author, TopicInfo

T = TypeVar("T", bound=SQLModel)
Model = TypeVar("T", bound=BaseModel)

def pagination(
    session: Session,
    model: Type[T],
    page: int,
    page_size: int = 20,
    filters: list | None = None,
    joins: list | None = None
) -> dict:
    """Helper de paginación mejorado con conteo y joins"""
    filters = filters or []
    joins = joins or []
    
    # Query base
    query = select(func.count()).select_from(model)
    
    # Aplicar joins
    for join_clause in joins:
        query = query.join(join_clause)
    
    # Aplicar filtros
    if filters:
        query = query.where(*filters)
    
    # Ejecutar conteo
    total_items = session.exec(query).first() or 0
    
    # Calcular páginas
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    current_page = max(page, 1)
    
    return {
        "total_items": total_items,
        "total_pages": total_pages,
        "page": current_page,
        "page_size": page_size,
        "offset": (current_page - 1) * page_size
    }

def set_author_and_topic_info(data: Sequence[SQLModel] | SQLModel, model:Type[Model]) -> list[Model] | Model:
    if isinstance(data, SQLModel):
        return model(
            **data.model_dump(),
            author=Author(
                id=data.author.id,
                username=data.author.username
            ),
            topic=TopicInfo(
                id=data.topic.id,
                name=data.topic.name
            )
        )
    
    return [
        model(
            **d.model_dump(),
            author=Author(
                id=d.author.id,
                username=d.author.username
            ),
            topic=TopicInfo(
                id=d.topic.id,
                name=d.topic.name
            )
        ) for d in data
    ]
