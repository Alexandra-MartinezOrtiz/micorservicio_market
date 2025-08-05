// src/types/invoicing.ts

export interface InvoiceItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Invoice {
  id: number;
  user_id: number;
  user_email: string;
  items: InvoiceItem[];
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceRequest {
  // No necesita parámetros, se crea desde el carrito actual
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_invoices: number;
  total_sales: number;
} 