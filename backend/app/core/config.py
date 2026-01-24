from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Application
    app_name: str = "Compliance AI"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql://compliance:compliance@localhost:5432/compliance_ai"

    # AI/Anthropic
    anthropic_api_key: str | None = None
    ai_model: str = "claude-sonnet-4-20250514"
    ai_max_tokens: int = 4096
    ai_temperature: float = 0.3

    # File uploads
    max_upload_size_mb: int = 10
    allowed_control_extensions: list[str] = [".csv", ".xlsx", ".xls"]
    allowed_policy_extensions: list[str] = [".pdf", ".docx", ".doc", ".txt", ".md"]

    # Scoring
    default_confidence_threshold: float = 0.5


settings = Settings()
