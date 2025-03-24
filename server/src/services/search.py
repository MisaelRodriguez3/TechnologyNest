from sqlmodel import Session, select, or_, desc
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
import math

from src.schemas.search import SearchOut
from src.models.examples import Example
from src.models.challenges import Challenge
from src.models.posts import Post
from src.schemas.examples import ExampleOut
from src.schemas.challenges import ChallengeOut
from src.schemas.posts import PostOut
from src.utils.exceptions import ServerError
from src.libs.logger import logger
from src.helpers.db_helpers import pagination, set_author_and_topic_info

# Configuración de búsqueda
MODEL_CONFIG = {
    Post: {
        'search_fields': ['title', 'description', 'code'],
        'schema': PostOut  # Asegúrate de importar los esquemas
    },
    Example: {
        'search_fields': ['title', 'description', 'code'],
        'schema': ExampleOut
    },
    Challenge: {
        'search_fields': ['title', 'description'],
        'schema': ChallengeOut
    }
}

def query_model(
    _session: Session,
    model: type,
    search_term: Optional[str] = None,
    page: int = 1,
    page_size: int = 20
) -> dict:
    """Helper genérico para consultas paginadas con búsqueda"""
    try:
        config = MODEL_CONFIG[model]
        filters = []
        
        if search_term and search_term.strip():
            conditions = [getattr(model, field).ilike(f'%{search_term}%') 
                        for field in config['search_fields']]
            filters = [or_(*conditions)]

        pagination_data = pagination(
            session=_session,
            model=model,
            page=page,
            page_size=page_size,
            filters=filters
        )

        query = select(model).order_by(desc(model.created_at))
        
        if filters:
            query = query.where(*filters)
            
        query = query.offset(pagination_data['offset']).limit(pagination_data['page_size'])
        results = _session.exec(query).all()
        
        return {
            'data': set_author_and_topic_info(results, config['schema']),
            'pagination': pagination_data
        }
        
    except SQLAlchemyError as e:
        logger.error(f'Error en consulta {model.__name__}: {str(e)}')
        raise ServerError() from e

def search_entries(_session: Session, search_term: str, page: int = 1, page_size: int = 20) -> SearchOut:
    """Búsqueda unificada con paginación"""
    try:
        logger.info(f'Buscando: "{search_term}"')
        
        results = {}
        for model in [Post, Example, Challenge]:
            model_data = query_model(
                _session=_session,
                model=model,
                search_term=search_term,
                page=page,
                page_size=page_size
            )
            results[model.__name__.lower()] = model_data['data']
            results[f'{model.__name__.lower()}_pagination'] = model_data['pagination']

        return SearchOut(
            posts=results['post'],
            examples=results['example'],
            challenges=results['challenge'],
            page=page,
            total_pages=math.ceil(
                max(
                    results['post_pagination']['total_pages'],
                    results['example_pagination']['total_pages'],
                    results['challenge_pagination']['total_pages']
                )
            )
        )
        
    except SQLAlchemyError as e:
        logger.error(f'Error en búsqueda: {str(e)}')
        raise ServerError() from e
