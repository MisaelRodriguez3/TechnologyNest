from pydantic import Field, BaseModel
from .common import Author, BaseOut, TopicInfo
from uuid import UUID

class PostBase(BaseModel):
    """Clase base para los esquemas de `posts`."""
    topic_id: UUID

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
                "topic_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52"
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

class PostOut(BaseOut):
    title: str
    description: str
    code: str | None
    author: Author
    topic: TopicInfo

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

class PaginatedPosts(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    posts: list[PostOut]