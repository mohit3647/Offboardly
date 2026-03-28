import uuid
from typing import Annotated

from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_session
from app.models.user import User

DbSession = Annotated[AsyncSession, Depends(get_session)]


async def get_current_user(
    db: DbSession,
    x_user_id: str = Header(default=""),
) -> User:
    """Get current user from header.

    In production, this would validate a Clerk JWT.
    For MVP, we accept a clerk_user_id header for simplicity.
    """
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header")

    result = await db.execute(
        select(User).where(User.clerk_user_id == x_user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
