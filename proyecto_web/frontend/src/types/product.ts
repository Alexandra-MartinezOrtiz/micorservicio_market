// src/types/product.ts

export interface Product {
  id: number; // ID único del producto (generado por PostgreSQL)
  name: string; // Nombre del producto
  description: string; // Descripción detallada
  price: number; // Precio del producto
  stock: number; // Cantidad disponible en stock
  created_at: string; // Timestamp de creación
  updated_at: string; // Timestamp de última actualización
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'name' | 'created_at';
  order: 'asc' | 'desc';
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: ProductPagination;
  filters: ProductFilters;
  sort: ProductSort;
}