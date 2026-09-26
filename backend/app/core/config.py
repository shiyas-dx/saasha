import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SAASHA B2B Wholesale Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "saasha_super_secret_b2b_wholesale_key_2026_998877")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./saasha.db")
    
    # Superadmin ENV Configuration
    SUPERADMIN_EMAIL: str = os.getenv("SUPERADMIN_EMAIL", "superadmin@saasha.com")
    SUPERADMIN_PASSWORD: str = os.getenv("SUPERADMIN_PASSWORD", "superadmin123")
    SUPERADMIN_NAME: str = os.getenv("SUPERADMIN_NAME", "SAASHA Master Superadmin")

    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://localhost",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
