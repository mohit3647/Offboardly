import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class KnowledgeBaseResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    status: str
    synthesis_completed_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeEntryResponse(BaseModel):
    id: uuid.UUID
    category: str
    title: str
    content: str
    tags: Optional[str]
    source_session_id: Optional[uuid.UUID]
    created_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeBaseDetail(KnowledgeBaseResponse):
    entries: list[KnowledgeEntryResponse] = []
