// src/lib/hooks/useInvoicing.ts
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

export interface Invoice {
  id: number;
  user_id: number;
  invoice_number: string;
  total_amount: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface InvoiceCreate {
  items: {
    product_id: number;
    quantity: number;
  }[];
}

interface InvoicingState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

export const useInvoicing = () => {
  const [state, setState] = useState<InvoicingState>({
    invoices: [],
    loading: false,
    error: null,
  });

  // Cargar facturas
  const loadInvoices = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const invoices = await api.invoicing.getMyInvoices();
      setState(prev => ({
        ...prev,
        invoices,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cargar facturas';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Cargar facturas al montar el componente
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Crear factura
  const createInvoice = useCallback(async (items: { product_id: number; quantity: number }[]): Promise<Invoice | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const invoice = await api.invoicing.createInvoice({ items });
      await loadInvoices(); // Recargar facturas
      return invoice;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al crear factura';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [loadInvoices]);

  // Obtener factura por ID
  const getInvoice = useCallback(async (id: number): Promise<Invoice | null> => {
    try {
      // Asumiendo que hay un endpoint para obtener una factura específica
      // Si no existe, puedes implementarlo en el backend
      const invoice = state.invoices.find(inv => inv.id === id);
      return invoice || null;
    } catch (error) {
      console.error('Error getting invoice:', error);
      return null;
    }
  }, [state.invoices]);

  // Obtener facturas por estado
  const getInvoicesByStatus = useCallback((status: Invoice['status']): Invoice[] => {
    return state.invoices.filter(invoice => invoice.status === status);
  }, [state.invoices]);

  // Obtener total de facturas
  const getTotalInvoices = useCallback((): number => {
    return state.invoices.length;
  }, [state.invoices]);

  // Obtener total de ventas
  const getTotalSales = useCallback((): number => {
    return state.invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.total_amount, 0);
  }, [state.invoices]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    invoices: state.invoices,
    loading: state.loading,
    error: state.error,
    loadInvoices,
    createInvoice,
    getInvoice,
    getInvoicesByStatus,
    getTotalInvoices,
    getTotalSales,
    clearError,
  };
}; 