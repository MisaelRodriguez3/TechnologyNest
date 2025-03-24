from pydantic import BaseModel, Field
from .common import BaseOut, Author, TopicInfo
from uuid import UUID

class ExampleBase(BaseModel):
    """Clase base para el esquema de `ejemplos`."""
    topic_id: UUID

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
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52"
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

class ExampleOut(BaseOut):
    """Clase para typar los datos de salida de los `ejemplos`."""
    title: str
    description: str
    code: str
    author: Author
    topic: TopicInfo

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
                "author": {
                  "id": "47162d6c-6583-4142-8c64-33c4bfa25bad",
                  "username": "El Mictla"
                },
                "topic": {
                  "id": "4cff4a89-ecd2-4cca-8aa2-60e80dba6467",
                  "name": "python"
                },
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

class PaginatedExamples(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    examples: list[ExampleOut]