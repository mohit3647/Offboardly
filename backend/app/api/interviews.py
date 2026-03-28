import uuid
import json

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models.base import get_session
from app.models.employee import Employee
from app.models.interview import InterviewMessage, InterviewSession
from app.schemas.interview import (
    InterviewSessionCreate,
    InterviewSessionDetail,
    InterviewSessionResponse,
)
from app.services import interview_engine

router = APIRouter()


@router.post(
    "/employees/{employee_id}/sessions",
    response_model=InterviewSessionResponse,
    status_code=201,
)
async def create_interview_session(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
    payload: InterviewSessionCreate,
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    session = await interview_engine.create_session(db, employee_id, payload.topic)

    # Update employee status
    employee.status = "interviewing"
    await db.commit()

    # Generate opening message
    await interview_engine.get_opening_message(db, session, employee)

    await db.refresh(session)
    return session


@router.get(
    "/employees/{employee_id}/sessions",
    response_model=list[InterviewSessionResponse],
)
async def list_interview_sessions(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
):
    # Verify employee belongs to user's org
    emp_result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    if not emp_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Employee not found")

    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.employee_id == employee_id)
        .order_by(InterviewSession.session_number)
    )
    return result.scalars().all()


@router.get("/{session_id}", response_model=InterviewSessionDetail)
async def get_interview_session(db: DbSession, session_id: uuid.UUID):
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msgs_result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session_id)
        .order_by(InterviewMessage.sequence)
    )
    session.messages = msgs_result.scalars().all()
    return session


@router.post("/{session_id}/message")
async def send_interview_message(
    db: DbSession,
    session_id: uuid.UUID,
    body: dict,
):
    """Send a message in an interview session (non-streaming fallback)."""
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    emp_result = await db.execute(
        select(Employee).where(Employee.id == session.employee_id)
    )
    employee = emp_result.scalar_one()

    message = body.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    response = await interview_engine.process_message(db, session, employee, message)
    return {"response": response}


@router.post("/{session_id}/end")
async def end_interview_session(db: DbSession, session_id: uuid.UUID):
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    emp_result = await db.execute(
        select(Employee).where(Employee.id == session.employee_id)
    )
    employee = emp_result.scalar_one()

    summary = await interview_engine.end_session(db, session, employee)
    return {"summary": summary}


@router.websocket("/{session_id}/ws")
async def interview_websocket(websocket: WebSocket, session_id: uuid.UUID):
    """WebSocket endpoint for real-time interview streaming."""
    await websocket.accept()

    try:
        async for db in get_session():
            result = await db.execute(
                select(InterviewSession).where(InterviewSession.id == session_id)
            )
            session = result.scalar_one_or_none()
            if not session:
                await websocket.close(code=4004, reason="Session not found")
                return

            emp_result = await db.execute(
                select(Employee).where(Employee.id == session.employee_id)
            )
            employee = emp_result.scalar_one()

            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                user_message = message_data.get("message", "")

                if not user_message:
                    continue

                # Stream response
                async for token in interview_engine.stream_message(
                    db, session, employee, user_message
                ):
                    await websocket.send_json({"type": "token", "content": token})

                await websocket.send_json({"type": "done"})

    except WebSocketDisconnect:
        pass
