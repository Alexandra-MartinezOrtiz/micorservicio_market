from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

    # Relationships
    cart_items = relationship("Cart", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")
    invoices = relationship("Invoice", back_populates="user")
