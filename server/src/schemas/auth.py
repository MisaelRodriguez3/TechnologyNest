from pydantic import BaseModel, EmailStr, Field, model_validator

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = Field(min_length=5, max_length=20)
    email: EmailStr

class ChangePassword(BaseModel):
    """Validación para el cambio de contraseñas"""
    previus_password: str = Field(min_length=8, max_length=50)
    password: str = Field(min_length=8, max_length=50)
    confirm_password: str = Field(min_length=8, max_length=50)

    @model_validator(mode="before")
    def validate_password(cls, values):
        password = values.get("password")
        confirmation = values.get("confirm_password")

        if password != confirmation:
            raise ValueError("Las contraseñas no coinciden")
        return values

class ForgotPassword(BaseModel):
    username: str = Field(min_length=5, max_length=20)
    email: EmailStr

class ResetPassword(BaseModel):
    password: str = Field(min_length=8, max_length=50)
    confirm_password: str = Field(min_length=8, max_length=50)

class OTPIn(BaseModel):
    totp_code: str
    username: str