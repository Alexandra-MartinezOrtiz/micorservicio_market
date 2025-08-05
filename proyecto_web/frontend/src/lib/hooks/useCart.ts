// src/lib/hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/services/api';
import { ApiError } from '@/lib/services/api';

// Tipos
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CartAdd {
  product_id: number;
  quantity: number;
}

export interface CartTotal {
  total: number;
}

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
      const cartData = await api.cart.getCart();
      const totalData = await api.cart.getTotal();
      
      setState(prev => ({
        ...prev,
        items: cartData || [],
        total: totalData?.total || 0,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cargar carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Agregar al carrito
  const addToCart = useCallback(async (productId: number, quantity: number = 1): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.cart.addToCart({ product_id: productId, quantity });
      await loadCart(); // Recargar carrito
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al agregar al carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadCart]);

  // Remover del carrito
  const removeFromCart = useCallback(async (productId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.cart.removeFromCart({ product_id: productId });
      await loadCart(); // Recargar carrito
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al remover del carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadCart]);

  // Actualizar cantidad
  const updateQuantity = useCallback(async (productId: number, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Primero remover el item actual
      await api.cart.removeFromCart({ product_id: productId });
      // Luego agregar con la nueva cantidad
      await api.cart.addToCart({ product_id: productId, quantity });
      await loadCart(); // Recargar carrito
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al actualizar cantidad';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadCart, removeFromCart]);

  // Limpiar carrito
  const clearCart = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Remover todos los items uno por uno
      for (const item of state.items) {
        await api.cart.removeFromCart({ product_id: item.product_id });
      }
      await loadCart(); // Recargar carrito
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al limpiar carrito';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadCart, state.items]);

  // Obtener cantidad de un producto en el carrito
  const getItemQuantity = useCallback((productId: number): number => {
    const item = state.items.find(item => item.product_id === productId);
    return item?.quantity || 0;
  }, [state.items]);

  // Obtener total de items en el carrito
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