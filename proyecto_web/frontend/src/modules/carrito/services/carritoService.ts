
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/api';
import { API_CONFIG } from '@/lib/api';
import { 
  Cart, 
  AddToCartRequest, 
  RemoveFromCartRequest 
} from '@/types/cart';

export const cartService = {
  /**
   * Obtiene el carrito del usuario autenticado
   */
  async getCart(): Promise<Cart> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CART.BASE));
    return await response.json();
  },

  /**
   * Agrega un producto al carrito
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CART.ADD), {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return await response.json();
  },

  /**
   * Remueve un producto del carrito
   */
  async removeFromCart(data: RemoveFromCartRequest): Promise<Cart> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CART.REMOVE), {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return await response.json();
  },

  /**
   * Obtiene el total del carrito
   */
  async getCartTotal(): Promise<{ total: number }> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CART.TOTAL));
    return await response.json();
  },
}; 
