'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cartService } from '@/modules/carrito/services/carritoService';
import { invoicingService } from '@/modules/facturas/services/facturasService';
import { Cart } from '@/types/cart';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el carrito');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleRemoveItem = async (productId: number) => {
    try {
      const updatedCart = await cartService.removeFromCart({ product_id: productId });
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al remover producto');
    }
  };

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      // Primero removemos el item actual
      await cartService.removeFromCart({ product_id: productId });
      // Luego agregamos la nueva cantidad
      const updatedCart = await cartService.addToCart({
        product_id: productId,
        quantity: newQuantity
      });
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cantidad');
    }
  };

  const handleCheckout = async () => {
    try {
      const invoice = await invoicingService.createInvoice();
      alert(`Factura creada exitosamente. ID: ${invoice.id}`);
      // Redirigir a la página de facturación
      router.push('/invoicing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear factura');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando carrito...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Carrito de Compras</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Volver al catálogo
        </Link>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-800 mb-4">No hay productos en el carrito.</p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
            <ul className="divide-y">
              {cart.items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{item.product_name}</h3>
                      <p className="text-sm text-gray-800">
                        ${item.product_price.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-800 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-black">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-800 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold text-black">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar producto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black">Subtotal:</span>
                <span className="text-black">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">IVA (12%):</span>
                <span className="text-black">${(cart.total * 0.12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span className="text-black">Total:</span>
                <span className="text-black">${(cart.total * 1.12).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            Proceder a Facturación
          </button>
        </>
      )}
    </div>
  );
}