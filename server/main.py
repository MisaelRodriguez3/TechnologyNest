import uvicorn
from src.app import create_app

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
    uvicorn.run(app)