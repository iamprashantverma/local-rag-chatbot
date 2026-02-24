from typing import List, Dict
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from app.core.llm import llm
from app.core.prompt import prompt
from app.tools.langchain_tools import available_tools
from app.crud.chat import create_chat_by_user_email, get_last_5_chats_by_user_email, get_chats_by_user_email

llm_with_tools = llm.bind_tools(available_tools)
chain = prompt | llm_with_tools


def format_history(db_chats):
    messages = []
    for chat in db_chats:
        if chat.role == "human": messages.append(HumanMessage(content=chat.content))
        elif chat.role == "ai": messages.append(AIMessage(content=chat.content))
        elif chat.role == "tool": messages.append(ToolMessage(content=chat.content, tool_call_id=chat.tool_call_id))
    return messages


async def run_chat(db: Session, message: str, context: str, user_email: str):
    tool_map = {tool.name: tool for tool in available_tools}
    previous_chats = get_last_5_chats_by_user_email(db, user_email)
    history_messages = format_history(previous_chats)
    create_chat_by_user_email(db, user_email, "human", message)
    history_messages.append(HumanMessage(content=message))

    response = await chain.ainvoke({"input": message, "context": context, "history": history_messages})

    while getattr(response, "tool_calls", None):
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]; tool_args = tool_call.get("args", {}); tool_id = tool_call["id"]
            result = await tool_map[tool_name].ainvoke(tool_args)
            tool_message = ToolMessage(content=str(result), tool_call_id=tool_id)
            history_messages.append(tool_message)
            create_chat_by_user_email(db, user_email, "tool", str(result), tool_id)

        response = await chain.ainvoke({"input": message, "context": context, "history": history_messages})

    if response.content: create_chat_by_user_email(db, user_email, "ai", response.content)
    return response.content


def get_user_history(db: Session, user_email: str) -> List[Dict]:
    chats = get_chats_by_user_email(db, user_email)
    return [{"id":chat.id, "role": chat.role, "content": chat.content} for chat in chats]