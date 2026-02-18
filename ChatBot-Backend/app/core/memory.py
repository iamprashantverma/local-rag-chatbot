from langchain_community.chat_message_histories import ChatMessageHistory

MAX_CONTEXT_CHARS = 2000  # ~2KB

store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()

    history = store[session_id]

    # Trim history to last ~2KB
    total_chars = 0
    trimmed_messages = []

    # Go from newest → oldest
    for msg in reversed(history.messages):
        msg_length = len(msg.content)

        if total_chars + msg_length > MAX_CONTEXT_CHARS:
            break

        trimmed_messages.insert(0, msg)
        total_chars += msg_length

    history.messages = trimmed_messages
    return history
