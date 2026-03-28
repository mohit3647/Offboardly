import uuid
from datetime import datetime, timezone
from typing import AsyncGenerator

import anthropic
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.employee import Employee
from app.models.interview import InterviewMessage, InterviewSession
from app.prompts.interview_system import build_interview_prompt


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def create_session(
    db: AsyncSession,
    employee_id: uuid.UUID,
    topic: str = "general",
) -> InterviewSession:
    """Create a new interview session for an employee."""
    count_result = await db.execute(
        select(func.count()).where(InterviewSession.employee_id == employee_id)
    )
    session_number = count_result.scalar() + 1

    session = InterviewSession(
        employee_id=employee_id,
        session_number=session_number,
        topic=topic,
        status="in_progress",
        started_at=datetime.now(timezone.utc),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_opening_message(
    db: AsyncSession,
    session: InterviewSession,
    employee: Employee,
) -> str:
    """Generate the AI interviewer's opening message."""
    system_prompt = build_interview_prompt(
        employee_name=employee.full_name,
        job_title=employee.job_title,
        department=employee.department,
        tenure_years=employee.tenure_years,
        role_context=employee.role_context,
        topic=session.topic,
    )

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": "Please begin the interview with a warm greeting and your first question.",
            }
        ],
    )

    opening = response.content[0].text

    # Save as first message
    msg = InterviewMessage(
        session_id=session.id,
        role="assistant",
        content=opening,
        sequence=1,
    )
    db.add(msg)
    await db.commit()

    return opening


async def process_message(
    db: AsyncSession,
    session: InterviewSession,
    employee: Employee,
    user_message: str,
) -> str:
    """Process a user message and return the AI interviewer's response."""
    # Load existing messages
    result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session.id)
        .order_by(InterviewMessage.sequence)
    )
    existing_messages = result.scalars().all()

    next_seq = len(existing_messages) + 1

    # Save user message
    user_msg = InterviewMessage(
        session_id=session.id,
        role="user",
        content=user_message,
        sequence=next_seq,
    )
    db.add(user_msg)

    # Build conversation history for Claude
    system_prompt = build_interview_prompt(
        employee_name=employee.full_name,
        job_title=employee.job_title,
        department=employee.department,
        tenure_years=employee.tenure_years,
        role_context=employee.role_context,
        topic=session.topic,
    )

    messages = []
    for msg in existing_messages:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    # Call Claude
    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        system=system_prompt,
        messages=messages,
    )

    assistant_text = response.content[0].text

    # Save assistant message
    assistant_msg = InterviewMessage(
        session_id=session.id,
        role="assistant",
        content=assistant_text,
        sequence=next_seq + 1,
    )
    db.add(assistant_msg)
    await db.commit()

    return assistant_text


async def stream_message(
    db: AsyncSession,
    session: InterviewSession,
    employee: Employee,
    user_message: str,
) -> AsyncGenerator[str, None]:
    """Stream the AI interviewer's response token by token."""
    result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session.id)
        .order_by(InterviewMessage.sequence)
    )
    existing_messages = result.scalars().all()
    next_seq = len(existing_messages) + 1

    # Save user message
    user_msg = InterviewMessage(
        session_id=session.id,
        role="user",
        content=user_message,
        sequence=next_seq,
    )
    db.add(user_msg)
    await db.flush()

    system_prompt = build_interview_prompt(
        employee_name=employee.full_name,
        job_title=employee.job_title,
        department=employee.department,
        tenure_years=employee.tenure_years,
        role_context=employee.role_context,
        topic=session.topic,
    )

    messages = []
    for msg in existing_messages:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    full_response = ""
    async with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        system=system_prompt,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            full_response += text
            yield text

    # Save complete assistant message
    assistant_msg = InterviewMessage(
        session_id=session.id,
        role="assistant",
        content=full_response,
        sequence=next_seq + 1,
    )
    db.add(assistant_msg)
    await db.commit()


async def end_session(
    db: AsyncSession,
    session: InterviewSession,
    employee: Employee,
) -> str:
    """End an interview session and generate a summary."""
    result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session.id)
        .order_by(InterviewMessage.sequence)
    )
    messages = result.scalars().all()

    transcript = "\n\n".join(
        f"**{msg.role.title()}:** {msg.content}" for msg in messages
    )

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""Summarize the key knowledge captured in this interview session. \
Focus on actionable insights, undocumented knowledge, and critical information for the successor.

Interview with {employee.full_name} ({employee.job_title}, {employee.department}):

{transcript}

Provide a concise summary organized by topic area.""",
            }
        ],
    )

    summary = response.content[0].text
    session.status = "completed"
    session.completed_at = datetime.now(timezone.utc)
    session.summary = summary
    await db.commit()

    return summary
