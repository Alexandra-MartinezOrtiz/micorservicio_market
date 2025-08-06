from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_password_hash, verify_password
from typing import Optional
from datetime import datetime, timedelta

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, email: str, name: str, password: str, is_admin: bool = False) -> User:
        """Crea un nuevo usuario con el campo is_admin"""
        hashed_password = get_password_hash(password)
        db_user = User(
            email=email,
            name=name,
            hashed_password=hashed_password,
            is_admin=is_admin
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Autentica a un usuario por email y contraseña"""
        user = self.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def get_all_users(self):
        return self.db.query(User).all()

    def get_total_users(self) -> int:
        return self.db.query(User).count()

    def save_reset_token(self, user_id: int, reset_token: str, expires_in: timedelta) -> None:
        """Guarda el token de recuperación y su expiración"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.reset_token = reset_token
            user.reset_token_expires = datetime.utcnow() + expires_in
            self.db.commit()

    def get_by_reset_token(self, reset_token: str) -> Optional[User]:
        """Obtiene usuario por token de recuperación"""
        return self.db.query(User).filter(
            User.reset_token == reset_token
        ).first()

    def is_reset_token_valid(self, user_id: int, token: str) -> bool:
        """Verifica si el token de recuperación es válido y no ha expirado"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or user.reset_token != token:
            return False
        if user.reset_token_expires < datetime.utcnow():
            return False
        return True

    def update_password(self, user_id: int, new_password: str) -> None:
        """Actualiza la contraseña del usuario"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.hashed_password = get_password_hash(new_password)
            self.db.commit()

    def invalidate_reset_token(self, user_id: int) -> None:
        """Invalida el token de recuperación después de su uso"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.reset_token = None
            user.reset_token_expires = None
            self.db.commit()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica si una contraseña coincide con el hash"""
        return verify_password(plain_password, hashed_password)
