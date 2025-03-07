import logging
import logging.config
import os
from datetime import datetime, timezone

# Crear el directorio logs si no existe
log_dir = os.path.join(os.path.dirname(__file__), "../../logs")
os.makedirs(log_dir, exist_ok=True)

# Nombre del archivo con la fecha actual
log_file = os.path.join(log_dir, f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.log")

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG"
        },
        "file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": log_file,
            "when": "midnight",  # Rotar cada día
            "interval": 1,
            "backupCount": 7,  # Mantener logs de los últimos 7 días
            "formatter": "standard",
            "level": "INFO",
            "encoding": "utf-8"
        }
    },
    "loggers": {
        "app": {"handlers": ["console", "file"], "level": "DEBUG"},
        "sqlalchemy": {"handlers": ["file"], "level": "WARNING"},
        "uvicorn": {"handlers": ["console"], "level": "INFO"}
    }
})

logger = logging.getLogger("app")