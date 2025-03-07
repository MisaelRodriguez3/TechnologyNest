from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.comments import Comment
from src.models.posts import Post
from src.schemas.comments import CommentIn, CommentOut, CommentUpdate, PaginatedComments
from src.helpers.db_helpers import pagination

def get_all_comments_by_post(
    _session: Session,
    post_id: UUID,
    page: int
) -> PaginatedComments | str:
    """Obtiene comentarios paginados por tema usando el helper de paginación"""
    try:
        # Obtener datos de paginación
        pagination_data = pagination(
            session=_session,
            model=Comment,
            page=page,
            filters=[Comment.post_id == post_id],
            joins=[Post]
        )
        
        # Verificar si hay resultados
        if pagination_data["total_items"] == 0:
            # Validar existencia del tema
            if not _session.get(Post, post_id):
                raise BadRequest()
            return "Sin comentarios para este tema"
        
        # Obtener resultados paginados
        comments = _session.exec(
            select(Comment)
            .where(Comment.post_id == post_id)
            .order_by(desc(Comment.created_at))
            .offset(pagination_data["offset"])
            .limit(pagination_data["page_size"])
        ).all()
        
        # Convertir a modelo de salida
        comments_out = [CommentOut.model_validate(c) for c in comments]
        
        return PaginatedComments(
            total_pages=pagination_data["total_pages"],
            page=pagination_data["page"],
            comments=comments_out
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Error en base de datos: {str(e)}")
        raise ServerError("Error al obtener los comentarios")

def get_one_comment(_session: Session, id: UUID) -> CommentOut:
    """Obtiene un comentario por su clave primaria"""
    try:
        logger.info(f"Obteniendo el comentario con el id: {id}")    
        comment = _session.get(Comment, id)

        if not comment:
            logger.warning(f"comentario con id: {id}, no encontrado.")
            raise NotFound()

        return comment
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener el comentario con id {id} de comentario: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_comment(_session: Session, data: CommentIn) -> str:
    """Crea un nuevo comentario"""
    try:
        logger.info("Creando un nuevo comentario")
        comment = Comment(**data.model_dump())
        _session.add(comment)
        _session.commit()
        _session.refresh(comment)
        logger.info("Comentario creado correctamente")
        return "Comentario creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error comentario con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el comentario: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_comment(_session: Session, id: UUID, data: CommentUpdate) -> str:
    """Actualiza un comentario existente"""
    try:
        logger.info(f"Actulizando el comentario con el id: {id}")
        comment = _session.get(Comment, id)
        if not comment:
            logger.warning(f"Comentario con id: {id}, no encontrado.")
            raise NotFound()

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(comment, key, value)
        
        _session.commit()
        _session.refresh(comment)
        logger.info(f"Comentario con el id: {id} actualizado correctamente")
        return "Comentario actualizado correctamente"
    except IntegrityError as e:
        logger.error(f'Error comentario con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el comentario: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_comment(_session: Session, id: UUID) -> str:
    """Elimina un comentario por su ID"""
    try:
        logger.info(f"Eliminando comentario con el id: {id}")
        comment = _session.get(Comment, id)
        if not comment:
            logger.warning(f"Comentario con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(comment)
        _session.commit()
        logger.info(f"Comentario con id: {id} eliminado correctamente")
        return "Comentario eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"Comentario con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el comentario con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e