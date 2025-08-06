from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.auth import (
    UserRegister, UserLogin, UserLoginAdmin, UserLoginRegular, 
    Token, PasswordResetRequest, PasswordReset, PasswordChange
)
from app.services.auth_service import AuthService
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Registrar un nuevo usuario y devolver token"""
    auth_service = AuthService(db)
    return auth_service.register(user_data)

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login con validación opcional de rol"""
    auth_service = AuthService(db)
    return auth_service.login(user_data)

@router.post("/login/admin", response_model=Token)
def login_admin(user_data: UserLoginAdmin, db: Session = Depends(get_db)):
    """Login específico para administradores"""
    auth_service = AuthService(db)
    # Convertir a UserLogin para reutilizar lógica
    login_data = UserLogin(email=user_data.email, password=user_data.password)
    return auth_service.login_admin(login_data)

@router.post("/login/user", response_model=Token)
def login_user(user_data: UserLoginRegular, db: Session = Depends(get_db)):
    """Login específico para usuarios regulares"""
    auth_service = AuthService(db)
    # Convertir a UserLogin para reutilizar lógica
    login_data = UserLogin(email=user_data.email, password=user_data.password)
    return auth_service.login_user(login_data)

@router.post("/reset-password/request")
def request_password_reset(
    reset_request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Solicitar reset de contraseña"""
    auth_service = AuthService(db)
    return auth_service.request_password_reset(reset_request)

@router.post("/reset-password")
def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    """Resetear contraseña con token"""
    auth_service = AuthService(db)
    return auth_service.reset_password(reset_data)

@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cambiar contraseña del usuario autenticado"""
    auth_service = AuthService(db)
    return auth_service.change_password(
        user_email=current_user.email,
        current_password=password_data.current_password,
        new_password=password_data.new_password
    )