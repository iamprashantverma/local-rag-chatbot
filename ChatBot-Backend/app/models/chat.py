from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20))
    content = Column(String(2000))
    user_email = Column(String(50), ForeignKey("users.email"), nullable=False)  
    user = relationship("User", back_populates="chats")