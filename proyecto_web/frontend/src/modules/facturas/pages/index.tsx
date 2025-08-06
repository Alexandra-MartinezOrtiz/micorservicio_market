'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { useInvoicing } from '@/shared/hooks/useInvoicing';
import  ProtectedLayout  from '@/shared/components/ProtectedLayout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface Invoice {
  id: number;
  user_id: number;
  invoice_number: string;
  total_amount: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  items: {
    id: number;
    invoice_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

const InvoicePrintView = React.forwardRef<HTMLDivElement, { invoice: Invoice }>(({ invoice }, ref) => (
  <div ref={ref} className="p-8 max-w-2xl mx-auto text-gray-800 bg-white shadow-md rounded-lg">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Factura #{invoice.invoice_number}</h1>
      <p className="text-lg">Fecha: {format(new Date(invoice.created_at), 'PPP', { locale: es })}</p>
    </div>

    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Detalles de la Compra</h2>
      <div className="space-y-4">
        {invoice.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-gray-700">
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-gray-500">${item.unit_price.toFixed(2)} x {item.quantity}</p>
            </div>
            <p className="font-semibold">${item.total_price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t pt-4">
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between font-bold text-xl pt-2 border-t text-blue-800">
          <span>Total:</span>
          <span>${invoice.total_amount.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center text-sm text-gray-600">
      <p>Gracias por su compra</p>
      <p className="text-blue-700">www.marketjals.com</p>
    </div>
  </div>
));
InvoicePrintView.displayName = 'InvoicePrintView';

export default function InvoiceHistoryPage() {
  const { 
    invoices, 
    loading, 
    error, 
    clearError 
  } = useInvoicing();
  
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `factura_${Date.now()}`,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `
  });

  const onPrintInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setTimeout(() => handlePrint(), 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 font-medium">Cargando facturas...</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Error al cargar facturas</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={clearError}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800">Historial de Facturas</h1>
            <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium">
              Volver al catálogo
            </Link>
          </div>

          {/* Componente oculto para impresión */}
          <div className="hidden">
            {currentInvoice && (
              <InvoicePrintView ref={printRef} invoice={currentInvoice} />
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="text-center text-gray-600 mt-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay facturas</h3>
              <p className="text-gray-600">Aún no has realizado ninguna compra.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 transition-all hover:shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700">Factura #{invoice.invoice_number}</h2>
                      <p className="text-sm text-gray-500">
                        Fecha: {format(new Date(invoice.created_at), 'PPP', { locale: es })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 text-gray-700">
                    {invoice.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">${item.unit_price.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-1 text-gray-700">
                    <div className="flex justify-between font-bold text-lg pt-2 border-t text-blue-800">
                      <span>Total:</span>
                      <span>${invoice.total_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onPrintInvoice(invoice)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
                  >
                    Imprimir Factura
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}