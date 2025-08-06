# schemas/auth.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str = Field(..., min_length=6, description="Contraseña mínimo 6 caracteres")
    is_admin: Optional[bool] = False

    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    is_admin: Optional[bool] = None  # Opcional para validación de rol
    
    class Config:
        schema_extra = {
            "example": {
                "email": "usuario@ejemplo.com",
                "password": "mipassword",
                "is_admin": False  # true para admin, false para usuario, null para cualquiera
            }
        }

class UserLoginAdmin(BaseModel):
    """Esquema específico para login de administradores"""
    email: EmailStr
    password: str

class UserLoginRegular(BaseModel):
    """Esquema específico para login de usuarios regulares"""
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    is_admin: Optional[bool] = None
    
class PasswordResetRequest(BaseModel):
    """Esquema para solicitar reset de contraseña"""
    email: EmailStr = Field(..., description="Email del usuario")

class PasswordReset(BaseModel):
    """Esquema para resetear la contraseña con token"""
    token: str = Field(..., description="Token de reset recibido por email")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña")

class PasswordChange(BaseModel):
    """Esquema para cambiar contraseña del usuario autenticado"""
    current_password: str = Field(..., description="Contraseña actual")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña")