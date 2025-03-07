from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import time
from src.libs.logger import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        logger.info(f"\"{request.method} {request.url.path}\"", extra={
            "client": request.client.host if request.client else "unknown"
        })

        try:
            response = await call_next(request)
        except Exception as exc:
            logger.error(f"Request failed: {str(exc)}", exc_info=True, extra={
                "status_code": 500
            })
            raise exc from None

        duration = time.time() - start_time
        
        logger.info(f"Request completed: {response.status_code} in {duration:.4f}s", extra={
            "status_code": response.status_code,
            "duration": duration
        })
        
        return response