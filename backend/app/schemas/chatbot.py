import uuid
from typing import Optional

from pydantic import BaseModel


class ChatbotQuery(BaseModel):
    employee_id: uuid.UUID
    question: str


class SourceCitation(BaseModel):
    entry_id: uuid.UUID
    title: str
    category: str


class ChatbotResponse(BaseModel):
    answer: str
    sources: list[SourceCitation] = []
