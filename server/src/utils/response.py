from pydantic import BaseModel, Field
from typing import Generic, TypeVar

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    "Clase para mantener un estandar en las respuestas al cliente."
    status: int = Field(200, ge=100, le=599)
    data: T