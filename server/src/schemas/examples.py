from pydantic import BaseModel, Field
from .common import BaseOut
from uuid import UUID

class ExampleBase(BaseModel):
    """Clase base para el esquema de `ejemplos`."""
    topic_id: UUID
    user_id: UUID

class ExampleIn(ExampleBase):
    """Clase para validar los datos para crear un `ejemplo`."""
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=10, max_length=500)
    code: str = Field(max_length=5000)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Calculadora de números primos",
                "description": "Código en Python para identificar si un número ingresado por el usuario es primo.",
                "code": """
                    def es_primo(numero):
                        if numero < 2:
                            return False
                        for i in range(2, int(numero ** 0.5) + 1):
                            if numero % i == 0:
                                return False
                        return True

                    numero = int(input('Ingresa un número: '))
                    if es_primo(numero):
                        print(f'{numero} es un número primo.')
                    else:
                        print(f'{numero} no es un número primo.')
                """,
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1"
            }
        }

class ExampleUpdate(BaseModel):
    """Clase para validar los datos al actualizar un `ejemplo`."""
    title: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    code: str | None = Field(default=None, max_length=5000)

    class Config:
        json_schema_extra = {
            "example": {
                "titulo": "Calculadora de números primos"
            }
        }

class ExampleOut(BaseOut, ExampleIn):
    """Clase para typar los datos de salida de los `ejemplos`."""
    class Config:
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "title": "Calculadora de números primos",
                "description": "Código en Python para identificar si un número ingresado por el usuario es primo.",
                "code": """
                    def es_primo(numero):
                        if numero < 2:
                            return False
                        for i in range(2, int(numero ** 0.5) + 1):
                            if numero % i == 0:
                                return False
                        return True

                    numero = int(input('Ingresa un número: '))
                    if es_primo(numero):
                        print(f'{numero} es un número primo.')
                    else:
                        print(f'{numero} no es un número primo.')
                """,
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1",
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

class PaginatedExamples(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    examples: list[ExampleOut]