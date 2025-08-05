from sqlalchemy.orm import Session
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate
from typing import List

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_messages(self, limit: int = 50) -> List[ChatMessage]:
        return self.db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(limit).all()

    def create_message(self, user_id: int, message: ChatMessageCreate) -> ChatMessage:
        db_message = ChatMessage(
            user_id=user_id,
            message=message.message
        )
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        return db_message

    def get_message_with_user(self, message_id: int):
        return self.db.query(ChatMessage).filter(ChatMessage.id == message_id).first() 