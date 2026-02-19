from langchain_core.runnables import RunnableWithMessageHistory
from typing import List, Dict
from app.core.llm import llm
from app.core.prompt import prompt
from app.core.memory import get_session_history

chain = prompt | llm

chatbot = RunnableWithMessageHistory(chain, get_session_history, input_messages_key="input", history_messages_key="history")


def get_user_history(session_id: str) -> List[Dict]:
    history = get_session_history(session_id)
    return [
        {
            "role": msg.type,
            "content": msg.content
        }
        for msg in history.messages
    ]
