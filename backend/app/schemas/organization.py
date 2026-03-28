import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    name: str
    clerk_org_id: Optional[str] = None


class OrganizationResponse(BaseModel):
    id: uuid.UUID
    name: str
    plan: str
    created_at: datetime

    model_config = {"from_attributes": True}
