from sqlalchemy import text
from sqlmodel import create_engine, Session, SQLModel

from .config import CONFIG

engine = create_engine(CONFIG.DB_URL, echo=True)

def get_engine():
    return engine


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    enable_pgcrypto()

def enable_pgcrypto():
    """Habilita la extensión pgcrypto en PostgreSQL"""
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto;"))
        connection.commit()

def get_session():
    with Session(engine) as session:
        yield session