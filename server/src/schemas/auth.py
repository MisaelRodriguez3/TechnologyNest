from enum import StrEnum
from fastapi import Form
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field, model_validator

class AccountType(StrEnum):
    USER = "user"
    ENTERPRISE = "enterprise"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = Field(min_length=5, max_length=20)
    email: EmailStr

class ChangePassword(BaseModel):
    """Validación para el cambio o recuperación de contraseñas"""
    password: str = Field(min_length=8, max_length=50)
    confirm_password: str = Field(min_length=8, max_length=50)

    @model_validator(mode="before")
    def validate_password(cls, values):
        password = values.get("password")
        confirmation = values.get("confirm_password")

        if password != confirmation:
            raise ValueError("Las contraseñas no coinciden")
        return values


class OAuth2PasswordRequestFormWithRecaptcha(OAuth2PasswordRequestForm):
    def __init__(
        self, 
        grant_type: str = Form(default="password"),
        username: str = Form(),
        password: str = Form(),
        scope: str = Form(default=""),
        client_id: str | None = Form(default=None),
        client_secret: str | None = Form(default=None),
        recaptcha: str = Form(...)
    ):
        super().__init__(
            grant_type=grant_type, 
            username=username, 
            password=password, 
            scope=scope, 
            client_id=client_id, 
            client_secret=client_secret
        )
        self.recaptcha = recaptcha

class OTPIn(BaseModel):
    totp_code: str
    username: str