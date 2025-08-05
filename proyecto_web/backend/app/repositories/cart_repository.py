from sqlalchemy.orm import Session
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.cart import CartItemCreate
from typing import List, Optional
from sqlalchemy import and_

class CartRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_cart(self, user_id: int) -> List[Cart]:
        return self.db.query(Cart).filter(Cart.user_id == user_id).all()

    def get_cart_item(self, user_id: int, product_id: int) -> Optional[Cart]:
        return self.db.query(Cart).filter(
            and_(Cart.user_id == user_id, Cart.product_id == product_id)
        ).first()

    def add_to_cart(self, user_id: int, cart_item: CartItemCreate) -> Cart:
        # Check if product exists
        product = self.db.query(Product).filter(Product.id == cart_item.product_id).first()
        if not product:
            raise ValueError("Producto no encontrado")

        # Check if item already exists in cart
        existing_item = self.get_cart_item(user_id, cart_item.product_id)
        if existing_item:
            existing_item.quantity += cart_item.quantity
            self.db.commit()
            self.db.refresh(existing_item)
            return existing_item

        # Create new cart item
        db_cart_item = Cart(
            user_id=user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        self.db.add(db_cart_item)
        self.db.commit()
        self.db.refresh(db_cart_item)
        return db_cart_item

    def remove_from_cart(self, user_id: int, product_id: int) -> bool:
        cart_item = self.get_cart_item(user_id, product_id)
        if cart_item:
            self.db.delete(cart_item)
            self.db.commit()
            return True
        return False

    def clear_cart(self, user_id: int) -> bool:
        cart_items = self.get_user_cart(user_id)
        for item in cart_items:
            self.db.delete(item)
        self.db.commit()
        return True

    def get_cart_total(self, user_id: int) -> float:
        cart_items = self.db.query(Cart, Product).join(Product).filter(Cart.user_id == user_id).all()
        total = 0.0
        for cart_item, product in cart_items:
            total += product.price * cart_item.quantity
        return total 