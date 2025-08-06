// src/shared/hooks/index.ts

// Exportar todos los hooks
export { useAuth } from './useAuth';
export { useProducts } from './useProducts';
export { useCart } from './useCart';
export { useChat } from './useChat';
export { useInvoicing } from './useInvoicing';
export { useDashboard } from './useDashboard';

// Exportar tipos desde src/types (solo los que existen realmente)
export type { AuthResponse, UserProfile } from '@/types/auth';
export type { Product, CreateProductRequest, UpdateProductRequest, ProductFilters, ProductSort, ProductPagination, ProductResponse } from '@/types/product';
export type { CartItem, Cart } from '@/types/cart';
export type { ChatMessage } from '@/types/chat';
export type { Invoice, InvoiceItem, CreateInvoiceRequest, DashboardStats } from '@/types/invoicing';