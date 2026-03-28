import uuid

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate

router = APIRouter()


@router.get("/", response_model=list[EmployeeResponse])
async def list_employees(
    db: DbSession,
    user: CurrentUser,
    status: str | None = None,
):
    query = select(Employee).where(Employee.organization_id == user.organization_id)
    if status:
        query = query.where(Employee.status == status)
    query = query.order_by(Employee.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=EmployeeResponse, status_code=201)
async def create_employee(db: DbSession, user: CurrentUser, payload: EmployeeCreate):
    employee = Employee(
        organization_id=user.organization_id,
        created_by_user_id=user.id,
        **payload.model_dump(),
    )
    db.add(employee)
    await db.commit()
    await db.refresh(employee)
    return employee


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(db: DbSession, user: CurrentUser, employee_id: uuid.UUID):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.patch("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    db: DbSession,
    user: CurrentUser,
    employee_id: uuid.UUID,
    payload: EmployeeUpdate,
):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)

    await db.commit()
    await db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=204)
async def delete_employee(db: DbSession, user: CurrentUser, employee_id: uuid.UUID):
    result = await db.execute(
        select(Employee)
        .where(Employee.id == employee_id)
        .where(Employee.organization_id == user.organization_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    await db.delete(employee)
    await db.commit()
