from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.cart import CartResponse, CartItemCreate
from app.services.cart_service import CartService
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener el carrito del usuario autenticado"""
    cart_service = CartService(db)
    return cart_service.get_user_cart(current_user.id)

@router.post("/add")
def add_to_cart(
    cart_item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Agregar producto al carrito"""
    cart_service = CartService(db)
    return cart_service.add_to_cart(current_user.id, cart_item)

@router.post("/remove")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Remover producto del carrito"""
    cart_service = CartService(db)
    return cart_service.remove_from_cart(current_user.id, product_id)

@router.get("/total")
def get_cart_total(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener el total del carrito"""
    cart_service = CartService(db)
    return cart_service.get_cart_total(current_user.id)

@router.delete("/clear")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Vaciar el carrito"""
    cart_service = CartService(db)
    return cart_service.clear_cart(current_user.id) 