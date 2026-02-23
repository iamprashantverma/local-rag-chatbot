# from langchain_core.runnables import RunnableWithMessageHistory
from langchain_core.messages import ToolMessage
from typing import List, Dict
from app.core.llm import llm
from app.core.prompt import prompt
from app.core.memory import get_session_history
from app.tools.langchain_tools import available_tools

llm_with_tools = llm.bind_tools(available_tools)

chain = prompt | llm_with_tools

#  to be implemented..
# chatbot = RunnableWithMessageHistory(chain, get_session_history, input_messages_key="input", history_messages_key="history")


async def run_chat(message: str, context: str, session_id: str):

    tool_map = {tool.name: tool for tool in available_tools}
    history = get_session_history(session_id)
    history.add_user_message(message)

    response = await chain.ainvoke({
        "input": message,
        "context": context,
        "history": history.messages
    })
         
    while getattr(response, "tool_calls", None):

        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call.get("args", {})
            tool_id = tool_call["id"]

            result = await tool_map[tool_name].ainvoke(tool_args)

            tool_msg = ToolMessage(
                content=str(result),
                tool_call_id=tool_id,
            )

            history.add_message(tool_msg)

        # Call LLM again with updated history
        response = await chain.ainvoke({
            "input": message,
            "context": context,
            "history": history.messages
        })

    #  Only store final clean AI message
    if response.content:
        history.add_ai_message(response.content)

    return response.content


def get_user_history(session_id: str) -> List[Dict]:
    history = get_session_history(session_id)
    return [
        {
            "role": msg.type,
            "content": msg.content
        }
        for msg in history.messages
    ]