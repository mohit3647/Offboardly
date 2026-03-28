from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models.employee import Employee
from app.schemas.chatbot import ChatbotQuery, ChatbotResponse
from app.services.chatbot_service import query_knowledge

router = APIRouter()


@router.post("/query", response_model=ChatbotResponse)
async def chatbot_query(
    db: DbSession,
    user: CurrentUser,
    payload: ChatbotQuery,
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == payload.employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return await query_knowledge(db, employee, payload.question)
