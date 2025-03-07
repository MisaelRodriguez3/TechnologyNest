class ApiError(Exception):
    def __init__(self, status: int, message: str):
        self.status = status
        self.message = message

    def to_dict_response(self):
        """Crea un diccionario compatible con los mensajes de respuesta de FastAPI"""
        return {
            "description": f"HTTP {self.status} Response",
            "content": {
                "application/json": {
                    "example": {
                        "status": self.status,
                        "message": self.message
                    }
                }
            }
        }
    

class BadRequest(ApiError):
    def __init__(self, message = "Solicitud incorrecta."):
        super().__init__(
            status=400,
            message=message
        )

class UnauthorizedError(ApiError):
    def __init__(self, message = "El usuario no esta autenticado."):
        super().__init__(
            status=401,
            message=message
        )

class ForbiddenError(ApiError):
    def __init__(self, message = "El usuario no tiene autorización."):
        super().__init__(
            status=403,
            message=message
        )

class NotFound(ApiError):
    def __init__(self, message = "Registro no encontrado."):
        super().__init__(
            status=404,
            message=message
        )

class ConflictError(ApiError):
    def __init__(self, message = "Ya existe un registro con estos datos."):
        super().__init__(
            status=409,
            message=message
        )

class ServerError(ApiError):
    def __init__(self, message = "Error interno del servidor."):
        super().__init__(
            status=500,
            message=message
        )


# Crear los mensajes de respuesta (excepto las exitosas) para FastAPI
not_found_error = NotFound().to_dict_response()
conflict_error = ConflictError().to_dict_response()
bad_request_error = BadRequest().to_dict_response()
server_error = ServerError().to_dict_response()
unauthorized_error = UnauthorizedError().to_dict_response()
forbidden_error = ForbiddenError().to_dict_response()

# Diccionarios de respuestas para cada método HTTP
GET_RESPONSES = {
    204: {"description": "HTTP 204 Response"},
    400: bad_request_error,
    404: not_found_error,
    500: server_error
}

POST_RESPONSES = {
    400: bad_request_error,
    401: unauthorized_error,
    403: forbidden_error,
    409: conflict_error,
    500: server_error
}

PUT_RESPONSES = {
    400: bad_request_error,
    401: unauthorized_error,
    403: forbidden_error,
    404: not_found_error,
    409: conflict_error,
    500: server_error
}

DELETE_RESPONSES = {
    204: {"description": "HTTP 204 Response"},
    400: bad_request_error,
    401: unauthorized_error,
    403: forbidden_error,
    404: not_found_error,
    500: server_error
}

PROTECTED_GET_RESPONSES = {
    **GET_RESPONSES,
    401: unauthorized_error,
    403: forbidden_error
}