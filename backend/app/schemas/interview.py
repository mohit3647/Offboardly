import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InterviewSessionCreate(BaseModel):
    topic: str = "general"


class InterviewSessionResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    session_number: int
    topic: str
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    summary: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class InterviewMessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    sequence: int
    created_at: datetime

    model_config = {"from_attributes": True}


class InterviewSessionDetail(InterviewSessionResponse):
    messages: list[InterviewMessageResponse] = []
