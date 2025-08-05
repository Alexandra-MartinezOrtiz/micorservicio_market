// src/lib/hooks/index.ts

// Exportar todos los hooks
export { useAuth } from './useAuth';
export { useProducts } from './useProducts';
export { useCart } from './useCart';
export { useChat } from './useChat';
export { useInvoicing } from './useInvoicing';
export { useDashboard } from './useDashboard';

// Exportar tipos
export type {
  User,
  UserLogin,
  UserRegister,
  AuthResponse,
} from './useAuth';

export type {
  Product,
  ProductCreate,
} from './useProducts';

export type {
  CartItem,
  CartAdd,
  CartTotal,
} from './useCart';

export type {
  ChatMessage,
  ChatMessageCreate,
} from './useChat';

export type {
  Invoice,
  InvoiceItem,
  InvoiceCreate,
} from './useInvoicing';

export type {
  DashboardStats,
} from './useDashboard'; 