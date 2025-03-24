from sqlalchemy import func
from sqlmodel import Session
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.core.config import CONFIG
from src.utils.exceptions import ConflictError, ServerError, NotFound, BadRequest
from src.libs.logger import logger
from src.models.users import User
from src.schemas.users import UserIn, UserOut, UserUpdate

def get_all_users(_session: Session):
    """Obtiene todos los users de una tabla"""
    try:
        logger.info("Listando todos los users")
        users = _session.exec(
            select(
                User,
                func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
            )
        ).all()
        # Convertir los resultados a diccionarios optimizados
        result = [
            {
                **user.model_dump(), 
                "encrypted_email": str(user.email), 
                "email": decrypted_email
            }
            for user, decrypted_email in users
        ]
        
        return result
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener los users: {str(e)}", exc_info=True)
        raise ServerError() from e

def get_one_user(_session: Session, id: UUID):
    """Obtiene un user por su clave primaria"""
    try:
        logger.info(f"Obteniendo el user con el id: {id}")    
        result = _session.exec(
            select(
                User,
                func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
            ).where(User.id == id)
        ).first()
        if not result:
            logger.warning(f"user con id: {id}, no encontrado.")
            raise NotFound(id)
        user, decrypted_email = result
        user.email = decrypted_email
        return user
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener el user con id {id} de user: {str(e)}", exc_info=True)
        raise ServerError() from e

def create_user(_session: Session, data: UserIn) -> str:
    """Crea un nuevo usuario"""
    try:
        logger.info("Creando un nuevo user")
        user = User(**data.model_dump())
        _session.add(user)
        _session.commit()
        _session.refresh(user)
        logger.info("User creado correctamente")
        return "User creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error user con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el user: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def update_user(_session: Session, id: UUID, data: UserUpdate) -> User:
    """Actualiza un user existente"""
    try:
        logger.info(f"Actulizando el user con el id: {id}")
        user = get_one_user(_session, id)

        new_data = data.model_dump(exclude_unset=True)
        for key, value in new_data.items():
            setattr(user, key, value)
        
        _session.commit()
        _session.refresh(user)
        logger.info(f"User con el id: {id} actualizado correctamente")
        email = _session.exec(select(func.pgp_sym_decrypt(user.email, CONFIG.CIPHER_KEY).label("decrypted_email"))).first()
        user.email = email
        return user
    except IntegrityError as e:
        logger.error(f'Error user con datos duplicados: {str(e)}', exc_info=True)
        _session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al actualizar el user: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e

def delete_user(_session: Session, id: UUID) -> str:
    """Elimina un user por su ID"""
    try:
        logger.info(f"Eliminando user con el id: {id}")
        user = _session.get(User, id)
        if not user:
            logger.warning(f"User con id: {id}, no encontrado.")
            raise NotFound(id)

        _session.delete(user)
        _session.commit()
        logger.info(f"User con id: {id} eliminado correctamente")
        return "User eliminado correctamente"
    except IntegrityError as e:
        logger.error(f"User con id: {id} no se pudo eliminar: {str(e)}", exc_info=True)
        _session.rollback()
        raise BadRequest() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al eliminar el user con id {id}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e
    
def get_user_by_email(_session: Session, email: str):
    try:
        result = _session.exec(
            select(
                User, 
                func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
            ).where(func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY) == email)
            ).first()
        if not result:
            raise NotFound()
        user, decrypted_email = result
        user.email = decrypted_email
        return user
    except SQLAlchemyError as e:
        logger.error(f"Error al obtener usuario con email {email}: {str(e)}", exc_info=True)
        raise ServerError() from e

def active_account(_session: Session, email: str):
    try:
        logger.info(f"Activando cuenta con email: {email}")
        user = get_user_by_email(_session, email)
        user.is_confirmed = True
        _session.commit()
        _session.refresh(user)
        logger.info("Cuenta activada correctamente")
        return "Cuenta activada correctamente"
    except SQLAlchemyError as e:
        logger.error(f"Error al activar cuenta con email {email}: {str(e)}", exc_info=True)
        _session.rollback()
        raise ServerError() from e