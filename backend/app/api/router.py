from fastapi import APIRouter

from app.api.employees import router as employees_router
from app.api.interviews import router as interviews_router
from app.api.knowledge import router as knowledge_router
from app.api.chatbot import router as chatbot_router
from app.api.organizations import router as organizations_router
from app.api.webhooks import router as webhooks_router

api_router = APIRouter()

api_router.include_router(organizations_router, prefix="/organizations", tags=["Organizations"])
api_router.include_router(employees_router, prefix="/employees", tags=["Employees"])
api_router.include_router(interviews_router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(knowledge_router, prefix="/knowledge", tags=["Knowledge"])
api_router.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])
api_router.include_router(webhooks_router, prefix="/webhooks", tags=["Webhooks"])
