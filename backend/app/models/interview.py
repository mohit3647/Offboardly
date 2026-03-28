import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    employee_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("employees.id"))
    session_number: Mapped[int] = mapped_column(Integer, default=1)
    topic: Mapped[str] = mapped_column(String(100), default="general")
    status: Mapped[str] = mapped_column(String(50), default="not_started")
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    employee = relationship("Employee", back_populates="interview_sessions")
    messages = relationship("InterviewMessage", back_populates="session", cascade="all, delete-orphan", order_by="InterviewMessage.sequence")


class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("interview_sessions.id"))
    role: Mapped[str] = mapped_column(String(20))  # "assistant" or "user"
    content: Mapped[str] = mapped_column(Text)
    sequence: Mapped[int] = mapped_column(Integer)

    session = relationship("InterviewSession", back_populates="messages")
