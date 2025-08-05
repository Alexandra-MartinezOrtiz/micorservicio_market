// src/lib/hooks/useProducts.ts
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

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const useProducts = () => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    error: null,
  });

  // Cargar todos los productos
  const loadProducts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const products = await api.products.getAll();
      setState(prev => ({
        ...prev,
        products,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cargar productos';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Obtener producto por ID
  const getProduct = useCallback(async (id: number): Promise<Product | null> => {
    try {
      const product = await api.products.getById(id);
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (productData: ProductCreate): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.products.create(productData);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al crear producto';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadProducts]);

  // Actualizar producto
  const updateProduct = useCallback(async (id: number, productData: Partial<ProductCreate>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.products.update(id, productData);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al actualizar producto';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadProducts]);

  // Eliminar producto
  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await api.products.delete(id);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al eliminar producto';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [loadProducts]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  };
}; 