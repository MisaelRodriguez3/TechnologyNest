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
from src.schemas.auth import TokenData, Token
from src.libs.logger import logger
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.exceptions import ConflictError, ServerError, UnauthorizedError, ForbiddenError
from src.libs.recaptcha import verify_captcha
from src.models.users import User
from src.core.security import decrypt_data
from src.routes.dependencies.dependencies import authenticate_user

def register(session: Session, data: BaseModel):
    """Registra a un unuevo usuario
    
    Args:
        data (BaseModel): Información necesaria para crear al usuario
    
    Raises:
        ConflictError: Datos duplicados
        ServerError: Ocurrió un error inesperado
    
    Returns:
        str: Retorna un mensaje de éxito
    """
    try:
        logger.info("Creando un nuevo Usuario")
        verify_captcha(data.recaptcha)
        user = User(**data.model_dump())
        session.add(user)
        session.commit()
        session.refresh(user)
        logger.info("Usuario creado correctamente")
        return "Usuario creado exitosamente"
    except IntegrityError as e:
        logger.error(f'Error Usuario con datos duplicados: {str(e)}', exc_info=True)
        session.rollback()
        raise ConflictError() from e
    except SQLAlchemyError as e:
        logger.error(f"Error al crear el Usuario: {str(e)}", exc_info=True)
        session.rollback()
        raise ServerError() from e
        
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
        raise UnauthorizedError()
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
    print("totp_code", totp_code)
    print("totp", totp)
    if not totp.verify(totp_code):
        raise UnauthorizedError()
    data = TokenData(
        username=user.username,
        email=user.email,
    )
    return send_access_token(data)