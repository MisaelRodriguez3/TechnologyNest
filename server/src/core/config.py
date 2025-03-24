from decouple import config
from pydantic import BaseModel

class Config(BaseModel):
    "Configuration class, save all enviroment variables to use."
    #Nativas
    PORT: int = config('PORT')
    SECRET_KEY: str = config("SECRET_KEY")
    DB_URL: str = config("DB_URL")
    DEBUG: bool = config("DEBUG", cast=bool, default=False)
    TOKEN_EXPIRES_IN_MINUTES: int = config("TOKEN_EXPIRES_IN_MINUTES", cast=int)
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    CIPHER_KEY: str = config("CIPHER_KEY")
    CLIENT_URL: str = config("CLIENT_URL", default="http://localhost:5173")
    ENVIROMENT: str = config("ENVIROMENT")

    #API's Externas
    RECAPTCHA_SECRET_KEY: str = config("RECAPTCHA_SECRET_KEY")
    DEEPL_API: str = config("DEEPL_API")

    #Correo
    SMTP_SERVER: str = config("SMTP_SERVER")
    SMTP_PORT: int = config("SMTP_PORT")
    EMAIL_USER: str = config("EMAIL_USER")
    EMAIL_PASSWORD: str = config("EMAIL_PASSWORD")

CONFIG = Config()