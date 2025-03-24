from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from cryptography.fernet import Fernet
from src.core.config import CONFIG
from src.schemas.auth import TokenData

ALGORITHM = "HS256"
cipher = Fernet(CONFIG.CIPHER_KEY.encode())

def hash_password(password: str) -> str:
     """Método para generar un hash de la contraseña del usuario

     Args:
         password (str): Contraseña en texto plano del usuario   

     Returns:
         str: Hash de la contraseña del usuario
     """
     return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, pwd_hash: str) -> bool:
     """Método para verificar que la contraseña proporcionada por el usuario coincida con la alamacenada en la base de datos

     Args:
         password (str): Contraseña en texto plano del usuario
         pwd_hash (str): Hash de la contraseña del usuario alamacenada en la bas de datos

     Returns:
         bool: Retorna True si coinciden y False si no.
     """
     return bcrypt.checkpw(password.encode("utf-8"), pwd_hash.encode("utf-8"))

def encrypt_data(data:str) -> str:
     """Método para encryptar cadenas de texto

     Args:
         data (str): Texto a encriptar

     Returns:
         str: Texto encriptado
     """
     return cipher.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
     """Método para desencriptar el texto encriptado

     Args:
         encrypted_data (str): Cadena de texto encriptada

     Returns:
         str: Texto desencriptado
     """
     return cipher.decrypt(encrypted_data.encode()).decode()

def create_access_token(data: TokenData, expires_delta: timedelta) -> str:
     """Método para crear el token jwt para el usuario

     Args:
         data (TokenData): Información sobre el usuario que será almacenada como metadatos
         expires_delta (timedelta): Tiempo de duración del token (24h por defecto)

     Returns:
         str: Token de autenticación y autorización del usuario
     """
     to_encode = data.model_dump()
     expire = datetime.now(timezone.utc) + expires_delta
     to_encode.update({"exp": expire})
     encoded_jwt = jwt.encode(to_encode, CONFIG.SECRET_KEY, algorithm=ALGORITHM)
     return encoded_jwt