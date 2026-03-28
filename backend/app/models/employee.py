import uuid
from datetime import date
from typing import Optional

from sqlalchemy import Date, ForeignKey, String, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Employee(Base):
    __tablename__ = "employees"

    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    created_by_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    job_title: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(255))
    tenure_years: Mapped[float] = mapped_column(Float, default=0.0)
    last_day: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    role_context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    organization = relationship("Organization", back_populates="employees")
    interview_sessions = relationship("InterviewSession", back_populates="employee", cascade="all, delete-orphan")
    knowledge_base = relationship("KnowledgeBase", back_populates="employee", uselist=False, cascade="all, delete-orphan")
