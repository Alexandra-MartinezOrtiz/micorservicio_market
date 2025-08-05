from pydantic import BaseModel
from typing import List, Optional

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product_name: str
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItem]
    total: float 