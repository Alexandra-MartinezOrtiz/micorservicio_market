from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.chat import ChatMessageList, ChatMessageCreate, ChatMessage
from app.services.chat_service import ChatService
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/messages", response_model=ChatMessageList)
def get_messages(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener mensajes del chat"""
    chat_service = ChatService(db)
    return chat_service.get_messages(limit)

@router.post("/messages", response_model=ChatMessage)
def create_message(
    message: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Enviar un mensaje al chat"""
    chat_service = ChatService(db)
    return chat_service.create_message(current_user.id, message) 