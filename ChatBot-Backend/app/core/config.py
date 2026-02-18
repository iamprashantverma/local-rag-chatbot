from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., alias="DATABASE_URL")
    APP_NAME: str = "FastAPI App"
    DEBUG: bool = False
    SECRET_KEY:str = Field(...,alias="SECRET_KEY") 
    ALGORITHM:str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES :int = 30
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
