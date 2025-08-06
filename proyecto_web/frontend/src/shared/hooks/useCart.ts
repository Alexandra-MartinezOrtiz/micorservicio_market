// src/shared/hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/modules/carrito/services/carritoService';
import { CartItem} from '@/types/cart';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const useCart = () => {
  const [state, setState] = useState<CartState>({
    items: [],
    total: 0,
    loading: false,
    error: null,
  });

  // Cargar carrito
  const loadCart = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const cartData = await cartService.getCart();
      const totalData = await cartService.getCartTotal();

      setState(prev => ({
        ...prev,
        items: cartData?.items || [],
        total: totalData?.total || 0,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al cargar carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Agregar producto al carrito
  const addToCart = useCallback(
    async (productId: number, quantity: number = 1): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await cartService.addToCart({ product_id: productId, quantity });
        await loadCart();
        return true;
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al agregar al carrito';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return false;
      }
    },
    [loadCart]
  );

  // Remover producto del carrito
  const removeFromCart = useCallback(
    async (productId: number): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await cartService.removeFromCart({ product_id: productId });
        await loadCart();
        return true;
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al remover del carrito';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return false;
      }
    },
    [loadCart]
  );

  // Actualizar cantidad
  const updateQuantity = useCallback(
    async (productId: number, quantity: number): Promise<boolean> => {
      if (quantity <= 0) return removeFromCart(productId);

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await cartService.removeFromCart({ product_id: productId });
        await cartService.addToCart({ product_id: productId, quantity });
        await loadCart();
        return true;
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al actualizar cantidad';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return false;
      }
    },
    [loadCart, removeFromCart]
  );

  // Vaciar carrito
  const clearCart = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const currentItems = [...state.items];

      for (const item of currentItems) {
        await cartService.removeFromCart({ product_id: item.product_id });
      }

      await loadCart();
      return true;
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al limpiar carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadCart, state.items]);

  // Obtener cantidad de un producto en el carrito
  const getItemQuantity = useCallback(
    (productId: number): number => {
      const item = state.items.find(item => item.product_id === productId);
      return item?.quantity || 0;
    },
    [state.items]
  );

  // Obtener número total de ítems
  const getTotalItems = useCallback((): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    items: state.items,
    total: state.total,
    loading: state.loading,
    error: state.error,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
    clearError,
  };
};
