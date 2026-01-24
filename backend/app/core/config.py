from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Compliance AI"
    debug: bool = False
    database_url: str = "postgresql://compliance:compliance@localhost:5432/compliance_ai"


settings = Settings()
