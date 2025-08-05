// src/lib/services/product-service.ts
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/config/api';
import { API_CONFIG } from '@/lib/config/api';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '@/types/product';

export const productService = {
  /**
   * Crea un nuevo producto.
   */
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.PRODUCTS.BASE), {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    return await response.json();
  },

  /**
   * Obtiene un producto por su ID.
   */
  async getProduct(productId: number): Promise<Product> {
    const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.BY_ID(productId.toString())));
    
    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  },

  /**
   * Obtiene una lista de productos.
   */
  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.BASE));
    
    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  },

  /**
   * Actualiza un producto existente.
   */
  async updateProduct(
    productId: number,
    updateData: UpdateProductRequest
  ): Promise<Product> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.PRODUCTS.BY_ID(productId.toString())),
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );

    return await response.json();
  },

  /**
   * Elimina un producto.
   */
  async deleteProduct(productId: number): Promise<void> {
    await authenticatedRequest(
      buildApiUrl(API_CONFIG.PRODUCTS.BY_ID(productId.toString())),
      {
        method: 'DELETE',
      }
    );
  },
};