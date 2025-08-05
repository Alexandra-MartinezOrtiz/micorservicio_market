from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.services.product_service import ProductService
from app.utils.auth import get_current_active_user
from app.models.user import User
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    """Obtener todos los productos"""
    product_service = ProductService(db)
    return product_service.get_all_products()

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Obtener un producto por ID"""
    product_service = ProductService(db)
    return product_service.get_product_by_id(product_id)

@router.post("/", response_model=Product)
def create_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear un nuevo producto (solo admin)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden crear productos"
        )
    product_service = ProductService(db)
    return product_service.create_product(product)

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar un producto (solo admin)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden actualizar productos"
        )
    product_service = ProductService(db)
    return product_service.update_product(product_id, product)

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un producto (solo admin)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden eliminar productos"
        )
    product_service = ProductService(db)
    return product_service.delete_product(product_id) 