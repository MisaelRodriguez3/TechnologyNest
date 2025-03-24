import uvicorn
from src.app import create_app
from src.core.config import CONFIG

title = "Foro TechnologyNest."
summary = "API para las operaciones de TechnologyNest."
description = """
Backend de TechnologyNest desarrollado con FastAPI y sqlmodel. Permite la lectura, creación, edición y eliminación de 
publicaiones en las diferentes secciones
"""

info = {
    "title": title,
    "summary": summary,
    "description": description
}

app = create_app(info)


if __name__ == "__main__":
    config = {
        'app': 'main:app',
        'port': int(CONFIG.PORT)
    }

    if CONFIG.ENVIROMENT == 'dev':
        cert_path = "../certs/localhost.pem"
        key_path = "../certs/localhost-key.pem"

        config.update({
            "ssl_keyfile": key_path,
            "ssl_certfile": cert_path
        })
    else: 
        config.update({
            'host': '0.0.0.0'
        })
    uvicorn.run(**config)