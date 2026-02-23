from fastapi import APIRouter, Depends, Request
from app.schemas.chat import ChatRequest
from app.services.chat_service import run_chat, get_user_history
from app.rag.retriever import retriever
from app.api.deps import get_current_user
from app.models.user import User
import asyncio

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("")
async def chat( req: ChatRequest, request: Request, current_user: User = Depends(get_current_user)):
    user_email = current_user["sub"]

    # Build RAG context
    docs = retriever.invoke(req.message)
    context = "\n".join(d.page_content for d in docs)

    task = asyncio.create_task( run_chat(req.message, context, user_email))

    while not task.done():
        if await request.is_disconnected():
            task.cancel()
            return
        await asyncio.sleep(0.1)

    reply = await task

    return {"reply": reply}


@router.get("")
async def get_chat_history(current_user: User = Depends(get_current_user)):
    return get_user_history(current_user["sub"])