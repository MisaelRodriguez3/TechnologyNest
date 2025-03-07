from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.challenges import Challenge
from src.models.topics import Topic
from src.schemas.challenges import ChallengeIn, ChallengeOut, ChallengeUpdate, PaginatedChallenges
from src.helpers.db_helpers import pagination

def get_all_challenges_by_topic(
    _session: Session,
    topic_id: UUID,
    page: int
) -> PaginatedChallenges | str:
    """Obtiene retos paginados por tema usando el helper de paginación"""
    try:
        # Obtener datos de paginación
        pagination_data = pagination(
            session=_session,
            model=Challenge,
            page=page,
            filters=[Challenge.topic_id == topic_id],
            joins=[Topic]
        )
        
        # Verificar si hay resultados
        if pagination_data["total_items"] == 0:
            # Validar existencia del tema
            if not _session.get(Topic, topic_id):
                raise BadRequest()
            return "Sin retos para este tema"
        
        # Obtener resultados paginados
        challenges = _session.exec(
            select(Challenge)
            .where(Challenge.topic_id == topic_id)
            .order_by(desc(Challenge.created_at))
            .offset(pagination_data["offset"])
            .limit(pagination_data["page_size"])
        ).all()
        
        # Convertir a modelo de salida
        challenges_out = [ChallengeOut.model_validate(c) for c in challenges]
        
        return PaginatedChallenges(
            total_pages=pagination_data["total_pages"],
            page=pagination_data["page"],
            challenges=challenges_out
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Error en base de datos: {str(e)}")
        raise ServerError("Error al obtener los retos")

def get_one_challenge(_session: Session, id: UUID) -> ChallengeOut:
    """Obtiene un reto por su clave primaria"""
    try:
        logger.info(f"Obteniendo el reto con el id: {id}")    
        challenge = _session.get(Challenge, id)

        if not challenge:
            logger.warning(f"reto con id: {id}, no encontrado.")
            raise NotFound()

        return challenge
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener el reto con id {id} de reto: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_challenge(_session: Session, data: ChallengeIn) -> str:
    """Crea un nuevo reto"""
    try:
        logger.info("Creando un nuevo reto")
        challenge = Challenge(**data.model_dump())
        _session.add(challenge)
        _session.commit()
        _session.refresh(challenge)
        logger.info("Reto creado correctamente")
        return "Reto creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error reto con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el reto: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_challenge(_session: Session, id: UUID, data: ChallengeUpdate) -> str:
    """Actualiza un reto existente"""
    try:
        logger.info(f"Actulizando el reto con el id: {id}")
        challenge = _session.get(Challenge, id)
        if not challenge:
            logger.warning(f"Reto con id: {id}, no encontrado.")
            raise NotFound()

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(challenge, key, value)
        
        _session.commit()
        _session.refresh(challenge)
        logger.info(f"Reto con el id: {id} actualizado correctamente")
        return "Reto actualizado correctamente"
    except IntegrityError as e:
        logger.error(f'Error reto con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el reto: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_challenge(_session: Session, id: UUID) -> str:
    """Elimina un reto por su ID"""
    try:
        logger.info(f"Eliminando reto con el id: {id}")
        challenge = _session.get(Challenge, id)
        if not challenge:
            logger.warning(f"Reto con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(challenge)
        _session.commit()
        logger.info(f"Reto con id: {id} eliminado correctamente")
        return "Reto eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"Reto con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el reto con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e