from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_password_hash, verify_password
from typing import Optional

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, email: str, name: str, password: str, is_admin: bool = False) -> User:
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
        user = self.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def get_all_users(self):
        return self.db.query(User).all()

    def get_total_users(self) -> int:
        return self.db.query(User).count()
