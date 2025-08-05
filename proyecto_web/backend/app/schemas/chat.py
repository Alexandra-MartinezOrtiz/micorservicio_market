from pydantic import BaseModel
from typing import List
from datetime import datetime

class ChatMessageBase(BaseModel):
    message: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    user_id: int
    user_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageList(BaseModel):
    messages: List[ChatMessage] 