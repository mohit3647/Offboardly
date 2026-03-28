from fastapi import APIRouter, Request

from app.deps import DbSession
from app.models.organization import Organization
from app.models.user import User

router = APIRouter()


@router.post("/clerk")
async def clerk_webhook(request: Request, db: DbSession):
    """Handle Clerk webhook events for user/org sync.

    In production, verify the webhook signature using CLERK_WEBHOOK_SECRET.
    """
    payload = await request.json()
    event_type = payload.get("type", "")

    if event_type == "user.created":
        data = payload["data"]

        # Create org if needed
        org = Organization(
            name=data.get("organization_memberships", [{}])[0].get("organization", {}).get("name", "Default Org")
        )
        db.add(org)
        await db.flush()

        user = User(
            clerk_user_id=data["id"],
            email=data["email_addresses"][0]["email_address"],
            full_name=f"{data.get('first_name', '')} {data.get('last_name', '')}".strip(),
            organization_id=org.id,
        )
        db.add(user)
        await db.commit()

    return {"status": "ok"}
