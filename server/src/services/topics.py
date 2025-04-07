from sqlalchemy import desc
from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.models.users import User
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.topics import Topic
from src.models.posts import Post
from src.models.challenges import Challenge
from src.models.examples import Example
from src.schemas.topics import TopicIn, TopicOut, TopicUpdate, PaginatedContentByTopic
from src.schemas.challenges import ChallengeOut
from src.schemas.posts import PostOut
from src.schemas.examples import ExampleOut
from src.helpers.db_helpers import pagination, set_author_and_topic_info

def get_all_topics(_session: Session) -> list[TopicOut]:
    """Obtiene todos los topics de una tabla"""
    try:
        logger.info("Listando todos los topics")
        return _session.exec(select(Topic)).all()
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener los topics: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_topic(_session: Session, data: TopicIn) -> str:
    """Crea un nuevo topic"""
    try:
        logger.info("Creando un nuevo topic")
        topic = Topic(**data.model_dump())
        _session.add(topic)
        _session.commit()
        _session.refresh(topic)
        logger.info("Topic creado correctamente")
        return "Topic creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error topic con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el topic: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_topic(_session: Session, id: UUID, data: TopicUpdate) -> str:
    """Actualiza un topic existente"""
    try:
        logger.info(f"Actulizando el topic con el id: {id}")
        topic = _session.get(Topic, id)
        if not topic:
            logger.warning(f"Topic con id: {id}, no encontrado.")
            raise NotFound(id)

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(topic, key, value)
        
        _session.commit()
        _session.refresh(topic)
        logger.info(f"Topic con el id: {id} actualizado correctamente")
        return "Topic actualizado correctamente"
    except IntegrityError as e:
        logger.error(f'Error topic con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el topic: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_topic(_session: Session, id: UUID) -> str:
    """Elimina un topic por su ID"""
    try:
        logger.info(f"Eliminando topic con el id: {id}")
        topic = _session.get(Topic, id)
        if not topic:
            logger.warning(f"Topic con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(topic)
        _session.commit()
        logger.info(f"Topic con id: {id} eliminado correctamente")
        return "Topic eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"Topic con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el topic con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def get_content_by_topic(_session: Session, id: UUID, page: int):
    models = [Post, Challenge, Example]
    models_out = [PostOut, ChallengeOut, ExampleOut]

    max_total_pages = 0

    pagination_data = {}
    results = {}

    for model, model_out in zip(models, models_out):
        _pagination = pagination(
            session=_session,
            model=model,
            page=page,
            filters=[model.topic_id == id]
        )
        print('pagination', _pagination)
        pagination_data[f'{model.__name__.lower()}'] = _pagination
        print('pag_data', pagination_data)
        if _pagination['total_pages'] > max_total_pages:
            max_total_pages = _pagination['total_pages']
            print('max_pages', max_total_pages)
        result = _session.exec(
            select(model)
            .where(model.topic_id == id)
            .join(Topic)  # Cargar datos del tema en una sola consulta
            .join(User)   # Cargar datos del usuario en una sola consulta
            .order_by(desc(model.created_at))
            .offset(_pagination["offset"])
            .limit(_pagination["page_size"])
        ).all()
        result_out = set_author_and_topic_info(result, model_out)
        results[f'{model.__name__.lower()}'] = result_out
    return PaginatedContentByTopic(
        page=page,
        total_pages=max_total_pages,
        posts=results['post'],
        examples=results['example'],
        challenges=results['challenge']
    )