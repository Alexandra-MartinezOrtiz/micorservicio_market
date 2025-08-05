from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.cart_repository import CartRepository
from app.schemas.cart import CartItemCreate, CartResponse, CartItem
from typing import List

class CartService:
    def __init__(self, db: Session):
        self.db = db
        self.cart_repo = CartRepository(db)

    def get_user_cart(self, user_id: int) -> CartResponse:
        cart_items = self.cart_repo.get_user_cart(user_id)
        
        # Convert to CartItem schema with product details
        items = []
        for cart_item in cart_items:
            product = cart_item.product
            items.append(CartItem(
                id=cart_item.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                product_name=product.name,
                unit_price=product.price,
                total_price=product.price * cart_item.quantity
            ))
        
        total = self.cart_repo.get_cart_total(user_id)
        
        return CartResponse(items=items, total=total)

    def add_to_cart(self, user_id: int, cart_item: CartItemCreate) -> dict:
        try:
            self.cart_repo.add_to_cart(user_id, cart_item)
            return {"message": "Producto agregado al carrito exitosamente"}
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )

    def remove_from_cart(self, user_id: int, product_id: int) -> dict:
        success = self.cart_repo.remove_from_cart(user_id, product_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado en el carrito"
            )
        return {"message": "Producto removido del carrito exitosamente"}

    def get_cart_total(self, user_id: int) -> dict:
        total = self.cart_repo.get_cart_total(user_id)
        return {"total": total}

    def clear_cart(self, user_id: int) -> dict:
        self.cart_repo.clear_cart(user_id)
        return {"message": "Carrito vaciado exitosamente"} 