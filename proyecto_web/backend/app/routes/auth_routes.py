from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.auth import UserRegister, UserLogin, Token
from app.services.auth_service import AuthService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=dict)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Registrar un nuevo usuario"""
    auth_service = AuthService(db)
    return auth_service.register(user_data)

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Iniciar sesión y obtener token JWT"""
    auth_service = AuthService(db)
    return auth_service.login(user_data) 