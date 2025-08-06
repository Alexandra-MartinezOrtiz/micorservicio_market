# user_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import get_current_active_user
from app.repositories.user_repository import UserRepository
from pydantic import BaseModel

router = APIRouter()

# Esquemas de respuesta
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    is_admin: bool

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Obtener perfil del usuario autenticado"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        is_admin=current_user.is_admin
    )

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obtener todos los usuarios (solo admins)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver todos los usuarios"
        )
    
    user_repo = UserRepository(db)
    users = user_repo.get_all_users()
    return [UserResponse.from_orm(user) for user in users]

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obtener usuario por ID"""
    # Los usuarios solo pueden ver su propio perfil, los admins pueden ver cualquiera
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver este usuario"
        )
    
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse.from_orm(user)

@router.get("/stats/total")
def get_user_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas de usuarios (solo admins)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver las estadísticas"
        )
    
    user_repo = UserRepository(db)
    total_users = user_repo.get_total_users()
    
    return {
        "total_users": total_users,
        "active_users": total_users  # Por ahora, todos los usuarios están activos
    }