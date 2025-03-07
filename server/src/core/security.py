from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from cryptography.fernet import Fernet
from pydantic import BaseModel
from src.core.config import CONFIG

ALGORITHM = "HS256"
cipher = Fernet(CONFIG.CIPHER_KEY.encode())

def hash_password(password: str) -> str:
    """Método para hashear la contraseña del usuario."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, pwd_hash: str) -> bool:
        """Método para verificar la contraseña del usuario."""
        return bcrypt.checkpw(password.encode("utf-8"), pwd_hash.encode("utf-8"))

def encrypt_data(data:str):
     return cipher.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data:str):
     return cipher.decrypt(encrypted_data.encode()).decode()

def create_access_token(data: BaseModel, expires_delta: timedelta) -> str:
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, CONFIG.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt