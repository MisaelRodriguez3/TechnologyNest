from uuid import UUID
from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import func
from sqlmodel import Session, select
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from src.models.users import User
from src.schemas.auth import TokenData
from src.core.config import CONFIG
from src.core.database import get_session
from src.core.security import verify_password, ALGORITHM
from src.utils.exceptions import UnauthorizedError, ServerError, ForbiddenError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")
router = APIRouter()

def get_account_by_username(session: Session, username: str):
    """Obtén la cuenta de un usuario en base a su username

    Args:
        username (str): Apodo o nick del usuario

    Returns:
        User: Devuelve un objecto de la clase del usuario o empresa (próximamnte).
        Si no se encuntra al usuario no regresa nada
    """
    result = session.exec(select(User, func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")).where(User.username == username)).first()
    if result:
        print(result)
        account, decrypted_email = result
        account.email = decrypted_email
        return account

def authenticate_user(session: Session, username: str, password: str):
    """Verifica que las credenciales del usuario sean correctas
    
    Args:
        username (str): Apodo o nick del usuario
        password (str): Contraseña del usuario
    
    Returns:
        User: Si las credenciales son correctas devuelve la cuenta en caso contrario devuelve false
    """    
    account = get_account_by_username(session, username)
    if not account:
        return False
    if not verify_password(password, account.password):
        return False
    return account

async def get_current_account(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    """Obtén la cuenta del usuario que realiza la petición
    
    Args:
        token (str, optional): Token JWT de para la autorización. Defaults to Depends(oauth2_scheme).
    
    Raises:
        UnauthorizedError: El usuario no esta autenticado
        ServerError: Ocurrió un error inesperado
    
    Returns:
        User: Retorna la cuenta del usuario
    """    
    try:
        payload = jwt.decode(token, CONFIG.SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")
        if username is None:
            raise UnauthorizedError()
        account = get_account_by_username(session, username)
        if account is None:
            raise UnauthorizedError()
        return account
    except InvalidTokenError as e:
        raise UnauthorizedError() from e
    except ExpiredSignatureError as e:
        raise UnauthorizedError()
    except Exception as e:
        raise ServerError() from e

async def get_current_active_account(current_user: User = Depends(get_current_account)):
    """Verifica que la cuenta este activa, es decir, que el usuario la haya confirmado
    
    Args:
        current_user (User, optional): Información del usuario actual Defaults to Depends(get_current_account).
    
    Raises:
        UnauthorizedError: El usuario no esta confirmado
    
    Returns:
        User: Retorna la cuenta del usuario
    """    
    if not current_user.is_confirmed:
        raise UnauthorizedError()
    return current_user

async def is_author(author_id: UUID, current_user: User = Depends(get_current_active_account)):
    """Verifica que el usuario sea el autor de la entrada
    
    Args:
        author_id (uuid.UUID): Identificador único del usuario (autor)
        current_user (User, optional): Información del usuario actual. Defaults to Depends(get_current_active_account).
    
    Raises:
        ForbiddenError: EL usuario no es es autor
    
    Returns:
        bool: Retorna True si es usuario es al autor
    """    
    if current_user.id != author_id:
        raise ForbiddenError()
    return True