from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://offboardly:offboardly@localhost:5432/offboardly"
    anthropic_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_index_name: str = "offboardly-knowledge"
    clerk_secret_key: str = ""
    clerk_webhook_secret: str = ""
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
