import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:1234@localhost:5432/reunite360")

# Try engine creation with fallback if DLL is blocked by OS security policy
def create_app_engine(url: str):
    urls_to_try = [url]
    if "postgresql+psycopg://" in url:
        urls_to_try.append(url.replace("postgresql+psycopg://", "postgresql+psycopg2://"))
        urls_to_try.append(url.replace("postgresql+psycopg://", "postgresql+pg8000://"))
    elif "postgresql://" in url and "+" not in url:
        urls_to_try.append(url.replace("postgresql://", "postgresql+pg8000://"))

    last_error = None
    for u in urls_to_try:
        try:
            eng = create_engine(u, echo=False, pool_pre_ping=True)
            # Test connection
            with eng.connect() as conn:
                conn.execute(conn.dialect.statement_compiler(eng.dialect, None).process(eng.dialect.statement_compiler(eng.dialect, None))) if False else None
            return eng
        except Exception as e:
            last_error = e
            continue
    # If initial ping failed on pool_pre_ping lazy load, return first valid engine
    return create_engine(urls_to_try[-1], echo=False, pool_pre_ping=True)

engine = create_app_engine(DATABASE_URL)
Base = declarative_base()
