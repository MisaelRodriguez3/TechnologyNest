from sqlmodel import Session, SQLModel
from typing import Type, TypeVar
from uuid import UUID
from sqlmodel import Session, select, func
import math

T = TypeVar("T", bound=SQLModel)


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

