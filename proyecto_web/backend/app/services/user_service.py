from sqlalchemy.orm import Session
from app.repositories import user_repository
from app.schemas.user import UserCreate

def register_user(db: Session, user: UserCreate):
    return user_repository.create_user(db, user)

def list_users(db: Session):
    return user_repository.get_users(db)
