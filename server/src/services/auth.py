import uuid
from datetime import timedelta
import base64

from pydantic import BaseModel
from sqlmodel import Session
import pyotp
import qrcode
from io import BytesIO

from src.core.config import CONFIG
from src.core.security import create_access_token
from src.schemas.auth import TokenData, Token, ChangePassword, ForgotPassword
from src.libs.logger import logger
from sqlalchemy.exc import SQLAlchemyError
from src.utils.exceptions import NotFound, UnauthorizedError, BadRequest, ServerError
from src.libs.recaptcha import verify_captcha
from src.models.users import User
from src.services.users import create_user
from src.core.security import decrypt_data, verify_password
from src.routes.dependencies.dependencies import authenticate_user, get_account_by_username

def register(session: Session, data: BaseModel):
    """Registra a un unuevo usuario
    
    Args:
        session (Session): Conexión a la base de datos
        data (BaseModel): Información necesaria para crear al usuario
    
    Raises:
        ConflictError: Datos duplicados
        ServerError: Ocurrió un error inesperado
    
    Returns:
        str: Retorna un mensaje de éxito
    """
    logger.info("Creando un nuevo Usuario")
    verify_captcha(data.recaptcha)
    user = create_user(session, data)
    logger.info("Usuario creado correctamente")
    return user
        
def login(session: Session, username: str, password: str, recaptcha: str):
    """Inicio de sesión 
    
    Args:
        username (str): Apodo o nick del usuario
        password (str): Contraseña del usuario
        recaptcha (str): token del recpatcha
    
    Raises:
        UnauthorizedError: El usuario no esta autenticado
    
    Returns:
        Token: retorna el token de autorización
    """
    verify_captcha(recaptcha)
    account = authenticate_user(session, username, password)
    if not account:
        raise BadRequest("Usuario o contraseña inválidas")
    data = TokenData(
        username=account.username,
        email=account.email,
    )
    if not account.mfa_active:
        return send_access_token(data)
    return {"mfa_active": True}
        

def send_access_token(data: TokenData):
    access_expires_token = timedelta(minutes=CONFIG.TOKEN_EXPIRES_IN_MINUTES)
    access_token = create_access_token(data=data, expires_delta=access_expires_token)
    return Token(access_token=access_token, token_type="bearer")

def change_password(session: Session, data: ChangePassword, current_user: User):
    logger.info(f"Cambio de contraseña del usuario: {current_user.id}")
    try:
        if not verify_password(data.previus_password, current_user.password):
            raise BadRequest()
        current_user.password = data.password
        session.commit()
        session.refresh(current_user)
        logger.info(f"Contraseña del usuarios {current_user.id} cambiada correctamente ")
        return "Contraseña cambiada correctemente"
    except SQLAlchemyError as e:
        logger.error(f"Error al cambiar la contraseña: {str(e)}", exc_info=True)
        session.rollback()
        raise ServerError() from e

def forgot_password(session: Session, data: ForgotPassword):
    logger.info(f"Solicitud de recupración de contraseña por parte del usuario: {data.username}")
    user = get_account_by_username(session, data.username)
    if not user:
        raise NotFound(f"No existe un  usuario llamado {data.username}")
    if user.email != data.email:
        raise BadRequest("Los correos no coinciden")
    return user
    
def reset_password(session: Session, username: str, password: str):
    logger.info(f"Restablecer contraseña del usuario {username}")
    try:
        user = get_account_by_username(session, username)
        if not user:
            raise NotFound()
        user.password = password
        session.commit()
        session.refresh(user)
        logger.info(f"Contraseña de {username} restablecida correctamente")
        return "Contraseña restablecida correctamente"
    except SQLAlchemyError as e:
        logger.error(f"Error al restablacer la contraseña de {username}", exc_info=True)
        session.rollback()
        raise ServerError()  from e


def generate_qr_totp(user: User):
    secret = decrypt_data(user.totp_secret)
    totp = pyotp.TOTP(secret)

    url = totp.provisioning_uri(user.username, issuer_name="Technology Nest")
    img = qrcode.make(url)
    buffered = BytesIO()
    img.save(buffered, format="PNG")

    return base64.b64encode(buffered.getvalue()).decode()


def verify_totp(totp_code: str, user: User):
    totp = pyotp.TOTP(decrypt_data(user.totp_secret))
    if not totp.verify(totp_code):
        raise UnauthorizedError()
    data = TokenData(
        username=user.username,
        email=user.email,
    )
    return send_access_token(data)