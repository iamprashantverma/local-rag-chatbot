from sqlalchemy.orm import Session
from app.models.chat import Chat


def get_chats_by_user_email(db: Session, email: str):
    return (
        db.query(Chat)
        .filter(Chat.user_email == email, Chat.role != "tool")
        .order_by(Chat.id.asc())
        .all()
    )


def create_chat_by_user_email(db: Session, email: str, role: str, content: str, tool_call_id: str | None = None):
    chat = Chat(user_email=email, role=role, content=content, tool_call_id=tool_call_id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_last_5_chats_by_user_email(db: Session, email: str):
    chats = (
        db.query(Chat)
        .filter(Chat.user_email == email)
        .order_by(Chat.id.desc())
        .limit(5)
        .all()
    )
    return list(reversed(chats))


def delete_chat_by_chat_id(db: Session, chat_id: int):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat: return None
    db.delete(chat)
    db.commit()
    return chat