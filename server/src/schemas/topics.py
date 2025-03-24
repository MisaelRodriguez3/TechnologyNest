from uuid import UUID
from pydantic import Field, BaseModel
from .common import BaseOut

class TopicBase(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    image_url: str = Field(max_length=255)

class TopicIn(TopicBase):
    """Clase para validar los datos al crear un `topic`."""
    class Config:
        json_schema_extra = {
            "example": {
                "name": "python", 
                "image_url": "https://i0.wp.com/junilearning.com/wp-content/uploads/2020/06/python-programming-language.webp?fit=800%2C800&ssl=1",
            }
        }

class TopicUpdate(BaseModel):
    """Clase para validar los datos al actualizar un `topic`."""
    name: str | None = Field(default=None, max_length=50)
    image_url: str | None = Field(default=None, max_length=255)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Python"
            }
        }

class TopicOut(BaseOut, TopicBase):
    """Clase para tipar la salida de los `topics`."""
    class Config:
        json_schema_extra = {
            "example": {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                "name": "python", 
                "image_url": "https://i0.wp.com/junilearning.com/wp-content/uploads/2020/06/python-programming-language.webp?fit=800%2C800&ssl=1",
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }