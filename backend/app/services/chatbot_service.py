import uuid

import anthropic
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.employee import Employee
from app.models.knowledge_base import KnowledgeBase, KnowledgeEntry
from app.prompts.chatbot_system import build_chatbot_prompt
from app.schemas.chatbot import ChatbotResponse, SourceCitation
from app.services.embedding_service import query_similar

client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def query_knowledge(
    db: AsyncSession,
    employee: Employee,
    question: str,
) -> ChatbotResponse:
    """Answer a question using the employee's captured knowledge base."""

    # 1. Try vector search first
    similar = await query_similar(question, employee.id, top_k=5)

    if similar:
        entry_ids = [uuid.UUID(s["id"]) for s in similar]
        result = await db.execute(
            select(KnowledgeEntry).where(KnowledgeEntry.id.in_(entry_ids))
        )
        entries = result.scalars().all()
    else:
        # Fallback: load all entries for this employee (small KB in MVP)
        kb_result = await db.execute(
            select(KnowledgeBase).where(KnowledgeBase.employee_id == employee.id)
        )
        kb = kb_result.scalar_one_or_none()
        if not kb:
            return ChatbotResponse(
                answer="No knowledge base has been created for this employee yet. "
                "Please complete the interview sessions and run knowledge synthesis first.",
                sources=[],
            )

        result = await db.execute(
            select(KnowledgeEntry).where(KnowledgeEntry.knowledge_base_id == kb.id)
        )
        entries = result.scalars().all()

    if not entries:
        return ChatbotResponse(
            answer="I don't have any knowledge entries to reference. "
            "Please ensure interviews have been completed and synthesized.",
            sources=[],
        )

    # 2. Build context from retrieved entries
    knowledge_context = ""
    for entry in entries:
        knowledge_context += f"\n### [{entry.title}] (Category: {entry.category})\n{entry.content}\n"

    # 3. Call Claude with RAG context
    system_prompt = build_chatbot_prompt(
        employee_name=employee.full_name,
        job_title=employee.job_title,
        department=employee.department,
        knowledge_context=knowledge_context,
    )

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system_prompt,
        messages=[{"role": "user", "content": question}],
    )

    answer = response.content[0].text

    # 4. Build source citations
    sources = [
        SourceCitation(
            entry_id=entry.id,
            title=entry.title,
            category=entry.category,
        )
        for entry in entries
    ]

    return ChatbotResponse(answer=answer, sources=sources)
