import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/modules/productos/services/productosService';
// No existe ApiError, se usa Error estándar lanzado por handleApiError

// Tipos
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
}

export interface ProductCreate {
  name: string;
  description: string;
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
      const products = await productService.getAllProducts();
      setState(prev => ({
        ...prev,
        products,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar productos';
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
      const product = await productService.getProduct(id);
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
      await productService.createProduct(productData);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear producto';
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
      await productService.updateProduct(id, productData);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar producto';
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
      await productService.deleteProduct(id);
      await loadProducts(); // Recargar productos
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar producto';
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
