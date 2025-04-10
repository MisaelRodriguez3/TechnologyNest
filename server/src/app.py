from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.core.database import create_db_and_tables
from src.core.config import CONFIG
from src.utils.exceptions import ApiError
from src.middlewares import logger_middleware
from src.libs.logger import logger
from src.routes import topics, challenges, comments, examples, posts, users, auth, search

def create_app(info: dict[str, str]) -> FastAPI:
    logger.info("Iniciando aplicación.")
    app = FastAPI(
        title=info.get("title"),
        summary=info.get("summary"),
        description=info.get("description")
    )

    create_db_and_tables()

    #Manejador de errores
    @app.exception_handler(ApiError)
    def my_error_handler(request: Request, exc: ApiError):
        if exc.status == 500:
            logger.critical(f"HTTP exception {exc.message}", extra={"status": exc.status, "error_message": exc.message})
        else:
            logger.error(f"HTTP exception {exc.message}", extra={"status": exc.status, "error_message": exc.message})
        return JSONResponse(
            status_code=exc.status,
            content=exc.__dict__
        )
    
    #Middlewares
    app.add_middleware(logger_middleware.LoggingMiddleware)
    app.add_middleware(
    CORSMiddleware,
    allow_origins=[CONFIG.CLIENT_URL],  # Cambia esto por dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los headers
)
    @app.middleware("http")
    async def log_background_tasks(request: Request, call_next):
        response = await call_next(request)
        if hasattr(request.state, "background_tasks"):
            print(f"Tareas en segundo plano registradas: {request.state.background_tasks.tasks}")
        return response

    @app.middleware("http")
    async def add_cache_control_header(request: Request, call_next):
        response = await call_next(request)

        exclude_paths: set[str] = {"/docs", "/redoc", "/openapi.json"}

        if request.method == "GET":
            if request.url.path not in exclude_paths:
                response.headers.setdefault("Cache-Control", "public, max-age=60")

        elif request.method in {"POST", "PATCH", "DELETE"}:
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"

        return response

    #Rutas
    api_router = APIRouter(prefix="/api")

    api_router.include_router(topics.router)
    api_router.include_router(challenges.router)
    api_router.include_router(posts.router)
    api_router.include_router(examples.router)
    api_router.include_router(comments.router)
    api_router.include_router(users.router)
    api_router.include_router(auth.router)
    api_router.include_router(search.router)


    app.include_router(api_router)

    return app