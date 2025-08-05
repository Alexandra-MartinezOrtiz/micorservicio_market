from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.chat_repository import ChatRepository
from app.schemas.chat import ChatMessageCreate, ChatMessage, ChatMessageList
from typing import List

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.chat_repo = ChatRepository(db)

    def get_messages(self, limit: int = 50) -> ChatMessageList:
        messages = self.chat_repo.get_messages(limit)
        
        # Convert to ChatMessage schema with user details
        chat_messages = []
        for message in messages:
            chat_messages.append(ChatMessage(
                id=message.id,
                user_id=message.user_id,
                user_name=message.user.name,
                message=message.message,
                created_at=message.created_at
            ))
        
        return ChatMessageList(messages=chat_messages)

    def create_message(self, user_id: int, message_data: ChatMessageCreate) -> ChatMessage:
        message = self.chat_repo.create_message(user_id, message_data)
        
        # Get user details for response
        user = message.user
        
        return ChatMessage(
            id=message.id,
            user_id=message.user_id,
            user_name=user.name,
            message=message.message,
            created_at=message.created_at
        ) 