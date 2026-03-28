import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    full_name: str
    email: str
    job_title: str
    department: str
    tenure_years: float = 0.0
    last_day: date
    role_context: Optional[str] = None


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    tenure_years: Optional[float] = None
    last_day: Optional[date] = None
    status: Optional[str] = None
    role_context: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    job_title: str
    department: str
    tenure_years: float
    last_day: date
    status: str
    role_context: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
