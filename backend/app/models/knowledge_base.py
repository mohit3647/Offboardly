import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import ARRAY, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    employee_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("employees.id"), unique=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    status: Mapped[str] = mapped_column(String(50), default="pending")
    synthesis_completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    employee = relationship("Employee", back_populates="knowledge_base")
    entries = relationship("KnowledgeEntry", back_populates="knowledge_base", cascade="all, delete-orphan")


class KnowledgeEntry(Base):
    __tablename__ = "knowledge_entries"

    knowledge_base_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("knowledge_bases.id"))
    category: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text)
    tags: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string for portability
    embedding_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_session_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("interview_sessions.id"), nullable=True
    )

    knowledge_base = relationship("KnowledgeBase", back_populates="entries")
