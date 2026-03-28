import json
import uuid
from datetime import datetime, timezone

import anthropic
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.employee import Employee
from app.models.interview import InterviewMessage, InterviewSession
from app.models.knowledge_base import KnowledgeBase, KnowledgeEntry
from app.prompts.synthesis_prompt import build_synthesis_prompt
from app.services.embedding_service import upsert_embedding

client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def synthesize_knowledge(
    db: AsyncSession,
    employee: Employee,
) -> KnowledgeBase:
    """Run the full knowledge synthesis pipeline for an employee."""

    # 1. Collect all interview transcripts
    sessions_result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.employee_id == employee.id)
        .where(InterviewSession.status == "completed")
    )
    sessions = sessions_result.scalars().all()

    if not sessions:
        raise ValueError("No completed interview sessions to synthesize")

    # Build full transcript
    all_transcripts = []
    session_map = {}

    for session in sessions:
        msgs_result = await db.execute(
            select(InterviewMessage)
            .where(InterviewMessage.session_id == session.id)
            .order_by(InterviewMessage.sequence)
        )
        messages = msgs_result.scalars().all()
        session_map[session.topic] = session.id

        transcript = f"\n--- Session: {session.topic} (Session #{session.session_number}) ---\n\n"
        transcript += "\n\n".join(
            f"{msg.role.upper()}: {msg.content}" for msg in messages
        )
        all_transcripts.append(transcript)

    full_transcript = "\n\n".join(all_transcripts)

    # 2. Call Claude for synthesis
    system_prompt = build_synthesis_prompt(
        employee_name=employee.full_name,
        job_title=employee.job_title,
        department=employee.department,
    )

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": f"Here are the interview transcripts to synthesize:\n\n{full_transcript}",
            }
        ],
    )

    raw_output = response.content[0].text

    # 3. Parse the structured output
    # Strip markdown code fences if present
    cleaned = raw_output.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

    entries_data = json.loads(cleaned)

    # 4. Create or get knowledge base
    kb_result = await db.execute(
        select(KnowledgeBase).where(KnowledgeBase.employee_id == employee.id)
    )
    kb = kb_result.scalar_one_or_none()

    if kb is None:
        kb = KnowledgeBase(
            employee_id=employee.id,
            organization_id=employee.organization_id,
            status="processing",
        )
        db.add(kb)
        await db.flush()
    else:
        kb.status = "processing"
        # Clear existing entries for re-synthesis
        for entry in kb.entries:
            await db.delete(entry)
        await db.flush()

    # 5. Create knowledge entries and embed them
    for entry_data in entries_data:
        entry = KnowledgeEntry(
            knowledge_base_id=kb.id,
            category=entry_data["category"],
            title=entry_data["title"],
            content=entry_data["content"],
            tags=json.dumps(entry_data.get("tags", [])),
        )
        db.add(entry)
        await db.flush()

        # Embed for RAG retrieval
        embed_text = f"{entry.title}\n\n{entry.content}"
        embedding_id = await upsert_embedding(
            entry_id=entry.id,
            text=embed_text,
            metadata={
                "employee_id": str(employee.id),
                "category": entry.category,
                "title": entry.title,
            },
        )
        if embedding_id:
            entry.embedding_id = embedding_id

    # 6. Mark as complete
    kb.status = "ready"
    kb.synthesis_completed_at = datetime.now(timezone.utc)
    employee.status = "complete"
    await db.commit()
    await db.refresh(kb)

    return kb
