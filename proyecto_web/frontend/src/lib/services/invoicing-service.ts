// src/lib/services/invoicing-service.ts
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/config/api';
import { API_CONFIG } from '@/lib/config/api';
import { 
  Invoice, 
  CreateInvoiceRequest,
  DashboardStats 
} from '@/types/invoicing';

export const invoicingService = {
  /**
   * Crea una factura desde el carrito actual
   */
  async createInvoice(): Promise<Invoice> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.INVOICING.CREATE), {
      method: 'POST',
    });

    return await response.json();
  },

  /**
   * Obtiene las facturas del usuario autenticado
   */
  async getMyInvoices(): Promise<Invoice[]> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.INVOICING.ME));
    return await response.json();
  },

  /**
   * Obtiene una factura específica por ID
   */
  async getInvoice(invoiceId: number): Promise<Invoice> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.INVOICING.BY_ID(invoiceId.toString()))
    );
    return await response.json();
  },

  /**
   * Obtiene las estadísticas del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.DASHBOARD.STATS));
    return await response.json();
  },
};
