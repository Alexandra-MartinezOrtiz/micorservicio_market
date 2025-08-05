// src/types/cart.ts

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface RemoveFromCartRequest {
  product_id: number;
} 