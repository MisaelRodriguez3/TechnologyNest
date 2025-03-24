from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, model_validator, HttpUrl
from .common import BaseOut

class UserBase(BaseModel):
    """Modelo base de datos de usuario"""
    first_name: str = Field(min_length=5, max_length=100)
    last_name: str = Field(min_length=5, max_length=100)
    username: str = Field(min_length=5, max_length=20)
    email: EmailStr

class UserIn(UserBase):
    """Validación de registro en el back-end"""
    password: str = Field(min_length=8, max_length=50)
    confirm_password: str = Field(min_length=8, max_length=50)
    recaptcha: str = Field(min_length=1)
    

    @model_validator(mode="before")
    def validate_password(cls, values):
        password = values.get("password")
        confirmation = values.get("confirm_password")

        if password != confirmation:
            raise ValueError("Las contraseñas no coinciden")
        return values

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "Misael",
                "last_name": "Rodríguez",
                "username": "Mictla",
                "email": "elgranmictla@gmail.com",
                "password": "ContraseñaSegura123",
                "confirm_password": "ContraseñaSegura123",
                "recaptcha": "defuhcuinjifncuienincenjisnuixbqub"
            }
        }

class UserUpdate(BaseModel):
    """Modelo para actualización de datos de usuarios"""
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    username: str | None = Field(default=None, max_length=20)
    email: EmailStr | None  = Field(default=None)
    image_url: str | None = Field(default=None, max_length=255)
    mfa_active: bool | None = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "Abrahm"
            }
        }

class UserOut(UserBase, BaseOut):
    """Modelo para la salida de datos del usuario"""
    image_url: HttpUrl = Field(max_length=255)
    mfa_active: bool = Field(default=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "first_name": "Misael",
                "last_name": "Rodríguez",
                "usarname": "Mictla",
                "email": "elgranmictla@gmail.com",
                "mfa_active": False,
                "image_url": "https://i0.wp.com/junilearning.com/wp-content/uploads/2020/06/python-programming-language.webp?fit=800%2C800&ssl=1",
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

#Creado por Misael Rodríguez