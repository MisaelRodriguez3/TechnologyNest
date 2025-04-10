from pydantic import BaseModel, Field
from uuid import UUID
from .common import BaseOut, Author

class CommentBase(BaseModel):
    """Clase base del esquema de los comentarios"""
    post_id: UUID

class CommentIn(CommentBase):
    """Validación de los comentarios en el back-end"""
    comment: str = Field(min_length=1, max_length=2500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "comment": "Puedes buscar en la documentación.",
                "post_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52"
            }
        }

class CommentUpdate(BaseModel):
    """Esquema de validación para la actualización de comentarios"""
    comment: str = Field(min_length=1, max_length=2500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "comment": "Puedes ver tutoriales."
            }
        }

class CommentOut(BaseOut,CommentIn):
    """Esquema de salida de los datos"""
    author: Author

    class Config:
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "comment": "Puedes buscar en la documentación.",
                "post_id": "3f8a07d5-2b3c-4d23-9b2b-91b2c82a8d52",
                "author": {
                  "id": "47162d6c-6583-4142-8c64-33c4bfa25bad",
                  "username": "El Mictla"
                },
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }

class PaginatedComments(BaseModel):
    total_pages: int = Field(ge=1)
    page: int = Field(ge=1)
    comments: list[CommentOut]