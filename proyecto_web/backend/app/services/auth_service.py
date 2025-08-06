from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegister, UserLogin, Token, PasswordResetRequest, PasswordReset
from app.utils.auth import create_access_token
from app.utils.email import send_password_reset_email
from datetime import timedelta
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
import secrets

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, user_data: UserRegister) -> Token:
        """Registra un nuevo usuario y devuelve un token de acceso"""
        existing_user = self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )

        user = self.user_repo.create_user(
            email=user_data.email,
            name=user_data.name,
            password=user_data.password,
            is_admin=user_data.is_admin
        )

        # Crear token de acceso para el usuario recién registrado
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.email,
                "is_admin": user.is_admin
            },
            expires_delta=access_token_expires
        )

        return Token(access_token=access_token, token_type="bearer")

    def login(self, user_data: UserLogin) -> Token:
        """Autentica un usuario con validación de rol admin"""
        # 1. Verificar credenciales básicas
        user = self.user_repo.authenticate_user(user_data.email, user_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 2. Validar el rol si se especifica en la request
        if hasattr(user_data, 'is_admin') and user_data.is_admin is not None:
            if user.is_admin != user_data.is_admin:
                # Error específico según el caso
                if user_data.is_admin and not user.is_admin:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Este usuario no tiene permisos de administrador"
                    )
                elif not user_data.is_admin and user.is_admin:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Este usuario es administrador y debe acceder como tal"
                    )

        # 3. Crear token con la información del usuario de la BD
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.email,
                "is_admin": user.is_admin
            },
            expires_delta=access_token_expires
        )

        return Token(access_token=access_token, token_type="bearer")

    def login_admin(self, user_data: UserLogin) -> Token:
        """Login específico para administradores"""
        user = self.user_repo.authenticate_user(user_data.email, user_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verificar que el usuario sea admin
        if not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: Se requieren permisos de administrador"
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.email,
                "is_admin": user.is_admin
            },
            expires_delta=access_token_expires
        )

        return Token(access_token=access_token, token_type="bearer")

    def login_user(self, user_data: UserLogin) -> Token:
        """Login específico para usuarios regulares"""
        user = self.user_repo.authenticate_user(user_data.email, user_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verificar que el usuario NO sea admin (opcional)
        if user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Los administradores deben usar el portal de admin"
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user.email,
                "is_admin": user.is_admin
            },
            expires_delta=access_token_expires
        )

        return Token(access_token=access_token, token_type="bearer")

    def request_password_reset(self, reset_request: PasswordResetRequest) -> dict:
        user = self.user_repo.get_by_email(reset_request.email)
        if not user:
            return {
                "message": "Si el email está registrado, recibirás un enlace para restablecer tu contraseña"
            }

        reset_token = secrets.token_urlsafe(32)
        reset_token_expires = timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

        self.user_repo.save_reset_token(
            user_id=user.id,
            reset_token=reset_token,
            expires_at=reset_token_expires
        )

        try:
            send_password_reset_email(
                email=user.email,
                name=user.name,
                reset_token=reset_token
            )
        except Exception as e:
            print(f"Error enviando email de reset: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error enviando el email de recuperación"
            )

        return {
            "message": "Si el email está registrado, recibirás un enlace para restablecer tu contraseña"
        }

    def reset_password(self, reset_data: PasswordReset) -> dict:
        user = self.user_repo.get_by_reset_token(reset_data.token)
        if not user or not self.user_repo.is_reset_token_valid(user.id, reset_data.token):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de reset inválido o expirado"
            )

        self.user_repo.update_password(user.id, reset_data.new_password)
        self.user_repo.invalidate_reset_token(user.id)

        return {
            "message": "Contraseña actualizada exitosamente"
        }

    def change_password(self, user_email: str, current_password: str, new_password: str) -> dict:
        user = self.user_repo.authenticate_user(user_email, current_password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contraseña actual incorrecta"
            )

        if self.user_repo.verify_password(new_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La nueva contraseña debe ser diferente a la actual"
            )

        self.user_repo.update_password(user.id, new_password)

        return {
            "message": "Contraseña cambiada exitosamente"
        }