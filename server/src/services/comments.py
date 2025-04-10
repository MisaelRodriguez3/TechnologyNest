from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.comments import Comment
from src.schemas.comments import CommentIn, CommentOut, CommentUpdate, PaginatedComments
from src.schemas.common import Author

def get_all_comments_by_post(
    _session: Session,
    post_id: UUID,
) -> list[CommentOut]:
    """Obtiene comentarios paginados por tema usando el helper de paginación"""
    try:
    
        comments = _session.exec(
            select(Comment)
            .where(Comment.post_id == post_id)
            .order_by(desc(Comment.created_at))
        ).all()
        
        # Convertir a modelo de salida
        comments_out = []
        for comment in comments:
            comments_out.append(CommentOut(
                **comment.model_dump(),
                author= Author(
                    id=comment.author.id,
                    username=comment.author.username
                )
            ))
        

        return comments_out
        
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

def create_comment(_session: Session, data: CommentIn, user_id: UUID) -> str:
    """Crea un nuevo comentario"""
    try:
        logger.info("Creando un nuevo comentario")
        comment_data = data.model_dump()
        comment_data["user_id"] = user_id
        comment = Comment(**comment_data)
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