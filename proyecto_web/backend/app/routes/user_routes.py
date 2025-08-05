from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.utils.auth import get_current_active_user
from app.models.user import User
from app.repositories.user_repository import UserRepository

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Obtener perfil del usuario autenticado"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_admin": current_user.is_admin
    }
