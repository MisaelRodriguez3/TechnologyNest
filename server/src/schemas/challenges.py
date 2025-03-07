from pydantic import Field, BaseModel
from .common import BaseOut
from uuid import UUID
from src.utils.response import ApiResponse

class ChallengeBase(BaseModel):
    """Clase base para los esquemas de `retos`."""
    topic_id: UUID
    user_id: UUID

class ChallengeIn(ChallengeBase):
    """Clase para validar los datos necesarios para crear un `reto`."""
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=20, max_length=500)
    difficulty: str = Field(max_length=20)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Generador de contraseñas seguras",
                "description": "Crea un programa que genere contraseñas aleatorias seguras, utilizando letras mayúsculas, minúsculas, números y símbolos. El usuario debe poder especificar la longitud de la contraseña.",
                "difficulty": "intermedio", 
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1"
            }
        }

class ChallengeUpdate(BaseModel):
    """Clase para validar los datos para actualizar un `reto`."""
    title: str | None = Field(max_length=100)
    description: str | None = Field(max_length=500)
    difficulty: str | None = Field(max_length=20)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Generar contraseñas seguras"
            }
        }

class ChallengeOut(BaseOut, ChallengeIn):
    """Clase para tipar la salida de los datos"""

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "title": "Generador de contraseñas seguras",
                "description": "Crea un programa que genere contraseñas aleatorias seguras, utilizando letras mayúsculas, minúsculas, números y símbolos. El usuario debe poder especificar la longitud de la contraseña.",
                "difficulty": "intermedio", 
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1",
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

class PaginatedChallenges(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    challenges: list[ChallengeOut]