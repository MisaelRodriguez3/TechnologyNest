from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.posts import Post
from src.models.topics import Topic
from src.schemas.posts import PostIn, PostOut, PostUpdate, PaginatedPosts
from src.helpers.db_helpers import pagination

def get_all_posts_by_topic(
    _session: Session,
    topic_id: UUID,
    page: int
) -> PaginatedPosts | str:
    """Obtiene posts paginados por tema usando el helper de paginación"""
    try:
        # Obtener datos de paginación
        pagination_data = pagination(
            session=_session,
            model=Post,
            page=page,
            filters=[Post.topic_id == topic_id],
            joins=[Topic]
        )
        
        # Verificar si hay resultados
        if pagination_data["total_items"] == 0:
            # Validar existencia del tema
            if not _session.get(Topic, topic_id):
                raise BadRequest()
            return "Sin posts para este tema"
        
        # Obtener resultados paginados
        posts = _session.exec(
            select(Post)
            .where(Post.topic_id == topic_id)
            .order_by(desc(Post.created_at))
            .offset(pagination_data["offset"])
            .limit(pagination_data["page_size"])
        ).all()
        
        # Convertir a modelo de salida
        posts_out = [PostOut.model_validate(c) for c in posts]
        
        return PaginatedPosts(
            total_pages=pagination_data["total_pages"],
            page=pagination_data["page"],
            posts=posts_out
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Error en base de datos: {str(e)}")
        raise ServerError("Error al obtener los posts")

def get_one_post(_session: Session, id: UUID) -> PostOut:
    """Obtiene un post por su clave primaria"""
    try:
        logger.info(f"Obteniendo el post con el id: {id}")    
        post = _session.get(Post, id)

        if not post:
            logger.warning(f"post con id: {id}, no encontrado.")
            raise NotFound()

        return post
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener el post con id {id} de post: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_post(_session: Session, data: PostIn) -> str:
    """Crea un nuevo post"""
    try:
        logger.info("Creando un nuevo post")
        post = Post(**data.model_dump())
        _session.add(post)
        _session.commit()
        _session.refresh(post)
        logger.info("Post creado correctamente")
        return "Post creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error post con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el post: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_post(_session: Session, id: UUID, data: PostUpdate) -> str:
    """Actualiza un post existente"""
    try:
        logger.info(f"Actulizando el post con el id: {id}")
        post = _session.get(Post, id)
        if not post:
            logger.warning(f"Post con id: {id}, no encontrado.")
            raise NotFound()

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(post, key, value)
        
        _session.commit()
        _session.refresh(post)
        logger.info(f"Post con el id: {id} actualizado correctamente")
        return "Post actualizado correctamente"
    except IntegrityError as e:
        logger.error(f'Error post con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el post: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_post(_session: Session, id: UUID) -> str:
    """Elimina un post por su ID"""
    try:
        logger.info(f"Eliminando post con el id: {id}")
        post = _session.get(Post, id)
        if not post:
            logger.warning(f"Post con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(post)
        _session.commit()
        logger.info(f"Post con id: {id} eliminado correctamente")
        return "Post eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"Post con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el post con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e