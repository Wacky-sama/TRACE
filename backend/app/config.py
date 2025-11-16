from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    SMTP_HOST: str
    SMTP_PORT: str
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str

    # Accept either comma-separated string or list
    CORS_ORIGINS: List[str] = []

    model_config = SettingsConfigDict(env_file=".env", env_prefix="")

    @classmethod
    def _parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    def __init__(self, **values):
        super().__init__(**values)
        # Ensure CORS_ORIGINS is parsed correctly
        self.CORS_ORIGINS = self._parse_cors_origins(self.CORS_ORIGINS)

settings = Settings()
