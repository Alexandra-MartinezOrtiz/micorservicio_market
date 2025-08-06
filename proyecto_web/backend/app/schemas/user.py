from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    is_admin: bool  # Campo booleano para distinguir si es administrador

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    is_admin: bool  # También en la respuesta, para usarlo en el frontend

    class Config:
        from_attributes = True  # Usar orm_mode si estás en Pydantic v1
