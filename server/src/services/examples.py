from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.examples import Example
from src.models.topics import Topic
from src.schemas.examples import ExampleIn, ExampleOut, ExampleUpdate, PaginatedExamples
from src.helpers.db_helpers import pagination

def get_all_examples_by_topic(
    _session: Session,
    topic_id: UUID,
    page: int
) -> PaginatedExamples | str:
    """Obtiene ejemplos paginados por tema usando el helper de paginación"""
    try:
        # Obtener datos de paginación
        pagination_data = pagination(
            session=_session,
            model=Example,
            page=page,
            filters=[Example.topic_id == topic_id],
            joins=[Topic]
        )
        
        # Verificar si hay resultados
        if pagination_data["total_items"] == 0:
            # Validar existencia del tema
            if not _session.get(Topic, topic_id):
                raise BadRequest()
            return "Sin ejemplos para este tema"
        
        # Obtener resultados paginados
        examples = _session.exec(
            select(Example)
            .where(Example.topic_id == topic_id)
            .order_by(desc(Example.created_at))
            .offset(pagination_data["offset"])
            .limit(pagination_data["page_size"])
        ).all()
        
        # Convertir a modelo de salida
        examples_out = [ExampleOut.model_validate(c) for c in examples]
        
        return PaginatedExamples(
            total_pages=pagination_data["total_pages"],
            page=pagination_data["page"],
            examples=examples_out
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Error en base de datos: {str(e)}")
        raise ServerError("Error al obtener los ejemplos")

def get_one_example(_session: Session, id: UUID) -> ExampleOut:
    """Obtiene un ejemplo por su clave primaria"""
    try:
        logger.info(f"Obteniendo el ejemplo con el id: {id}")    
        example = _session.get(Example, id)

        if not example:
            logger.warning(f"ejemplo con id: {id}, no encontrado.")
            raise NotFound()

        return example
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener el ejemplo con id {id} de ejemplo: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_example(_session: Session, data: ExampleIn) -> str:
    """Crea un nuevo ejemplo"""
    try:
        logger.info("Creando un nuevo ejemplo")
        example = Example(**data.model_dump())
        _session.add(example)
        _session.commit()
        _session.refresh(example)
        logger.info("Ejemplo creado correctamente")
        return "Ejemplo creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error ejemplo con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el ejemplo: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_example(_session: Session, id: UUID, data: ExampleUpdate) -> str:
    """Actualiza un ejemplo existente"""
    try:
        logger.info(f"Actulizando el ejemplo con el id: {id}")
        example = _session.get(Example, id)
        if not example:
            logger.warning(f"Ejemplo con id: {id}, no encontrado.")
            raise NotFound()

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(example, key, value)
        
        _session.commit()
        _session.refresh(example)
        logger.info(f"Ejemplo con el id: {id} actualizado correctamente")
        return "Ejemplo actualizado correctamente"
    except IntegrityError as e:
        logger.error(f'Error ejemplo con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el ejemplo: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_example(_session: Session, id: UUID) -> str:
    """Elimina un ejemplo por su ID"""
    try:
        logger.info(f"Eliminando ejemplo con el id: {id}")
        example = _session.get(Example, id)
        if not example:
            logger.warning(f"Ejemplo con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(example)
        _session.commit()
        logger.info(f"Ejemplo con id: {id} eliminado correctamente")
        return "Ejemplo eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"Ejemplo con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el ejemplo con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e