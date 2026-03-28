import uuid

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationResponse

router = APIRouter()


@router.get("/me", response_model=OrganizationResponse)
async def get_my_organization(db: DbSession, user: CurrentUser):
    result = await db.execute(
        select(Organization).where(Organization.id == user.organization_id)
    )
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.post("/", response_model=OrganizationResponse)
async def create_organization(db: DbSession, payload: OrganizationCreate):
    org = Organization(name=payload.name, clerk_org_id=payload.clerk_org_id)
    db.add(org)
    await db.commit()
    await db.refresh(org)
    return org
