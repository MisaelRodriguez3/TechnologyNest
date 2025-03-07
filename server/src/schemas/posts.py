from pydantic import Field, BaseModel
from .common import BaseOut
from uuid import UUID

class PostBase(BaseModel):
    """Clase base para los esquemas de `posts`."""
    topic_id: UUID
    user_id: UUID

class PostIn(PostBase):
    """Clase para validar los datos al crear un `post`."""
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=20, max_length=500)
    code: str | None = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "¿Cómo manejar excepciones anidadas en Python?", 
                "description": "Estoy trabajando en un programa donde necesito manejar diferentes tipos de excepciones en distintos niveles de anidación. ¿Cuál sería la mejor manera de implementar esto sin hacer el código difícil de leer?", 
                "code": """
                    try:
                        x = int(input("Ingrese un número: "))
                        try:
                            result = 10 / x
                        except ZeroDivisionError:
                            print("No se puede dividir entre cero.")
                        else:
                            print("Resultado:", result)
                    except ValueError:
                        print("Debe ingresar un número válido.")

                """,
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1"
            }
        }

class PostUpdate(BaseModel):
    """Clase para validar los datos al actualizar un `post`."""
    title: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    code: str | None = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "¿Cómo puedo manejar excepciones anidadas en Python?, soy principiante"
            }
        }

class PostOut(BaseOut, PostIn):
    class Config:
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "title": "¿Cómo manejar excepciones anidadas en Python?", 
                "description": "Estoy trabajando en un programa donde necesito manejar diferentes tipos de excepciones en distintos niveles de anidación. ¿Cuál sería la mejor manera de implementar esto sin hacer el código difícil de leer?", 
                "code": """
                    try:
                        x = int(input("Ingrese un número: "))
                        try:
                            result = 10 / x
                        except ZeroDivisionError:
                            print("No se puede dividir entre cero.")
                        else:
                            print("Resultado:", result)
                    except ValueError:
                        print("Debe ingresar un número válido.")

                """,
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "user_id": "c5f1e4b8-76cf-4cb1-8eb1-3b062b86a5d1",
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

class PaginatedPosts(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    posts: list[PostOut]