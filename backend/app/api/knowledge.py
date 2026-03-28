import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models.employee import Employee
from app.models.knowledge_base import KnowledgeBase, KnowledgeEntry
from app.schemas.knowledge import KnowledgeBaseDetail, KnowledgeEntryResponse
from app.services.knowledge_synthesis import synthesize_knowledge
from app.services.export_service import export_markdown

router = APIRouter()


@router.post("/employees/{employee_id}/synthesize")
async def trigger_synthesis(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
    background_tasks: BackgroundTasks,
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee.status = "synthesizing"
    await db.commit()

    # Run synthesis (in a real app, this would be a background job)
    kb = await synthesize_knowledge(db, employee)
    return {"status": "complete", "knowledge_base_id": str(kb.id)}


@router.get(
    "/employees/{employee_id}",
    response_model=KnowledgeBaseDetail,
)
async def get_knowledge_base(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Employee not found")

    kb_result = await db.execute(
        select(KnowledgeBase).where(KnowledgeBase.employee_id == employee_id)
    )
    kb = kb_result.scalar_one_or_none()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")

    entries_result = await db.execute(
        select(KnowledgeEntry)
        .where(KnowledgeEntry.knowledge_base_id == kb.id)
        .order_by(KnowledgeEntry.category, KnowledgeEntry.title)
    )
    kb.entries = entries_result.scalars().all()
    return kb


@router.get("/{entry_id}", response_model=KnowledgeEntryResponse)
async def get_knowledge_entry(db: DbSession, entry_id: uuid.UUID):
    result = await db.execute(
        select(KnowledgeEntry).where(KnowledgeEntry.id == entry_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.get("/employees/{employee_id}/export")
async def export_knowledge(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
    format: str = "markdown",
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if format == "markdown":
        md = await export_markdown(db, employee)
        return PlainTextResponse(
            content=md,
            media_type="text/markdown",
            headers={
                "Content-Disposition": f'attachment; filename="{employee.full_name}_knowledge.md"'
            },
        )

    raise HTTPException(status_code=400, detail="Unsupported format. Use 'markdown'.")
