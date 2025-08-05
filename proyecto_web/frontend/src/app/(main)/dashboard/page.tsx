'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { productService } from '@/lib/services/product-service';
import { cartService } from '@/lib/services/cart-service';
import { invoicingService } from '@/lib/services/invoicing-service';
import { Product } from '@/types/product';
import { Cart } from '@/types/cart';
import { DashboardStats } from '@/types/invoicing';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
      }
    };

    loadProducts();
  }, []);

  // Cargar carrito
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (err) {
        console.error('Error al cargar carrito:', err);
      }
    };

    loadCart();
  }, []);

  // Cargar estadísticas (solo para admin)
  useEffect(() => {
    const loadStats = async () => {
      if (currentUser?.role === 'admin') {
        try {
          const statsData = await invoicingService.getDashboardStats();
          setStats(statsData);
        } catch (err) {
          console.error('Error al cargar estadísticas:', err);
        }
      }
    };

    loadStats();
  }, [currentUser]);

  // Agregar al carrito
  const handleAddToCart = async (productId: number) => {
    try {
      const updatedCart = await cartService.addToCart({
        product_id: productId,
        quantity: 1
      });
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar al carrito');
    }
  };

  // Crear factura
  const handleCreateInvoice = async () => {
    try {
      const invoice = await invoicingService.createInvoice();
      alert(`Factura creada exitosamente. ID: ${invoice.id}`);
      // Recargar carrito después de crear factura
      const updatedCart = await cartService.getCart();
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear factura');
    }
  };

  // Obtener cantidad en carrito
  const getCartItemQuantity = (productId: number) => {
    if (!cart) return 0;
    const item = cart.items.find(item => item.product_id === productId);
    return item?.quantity || 0;
  };

  // Obtener total de items
  const getTotalItems = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    setLoading(false);
  }, [products, cart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-md w-full">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 md:mb-0">
            Dashboard - Market JALS
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="7" cy="21" r="1" />
                <circle cx="17" cy="21" r="1" />
              </svg>
              <span>Carrito</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {cart && cart.items.length > 0 && (
              <button
                onClick={handleCreateInvoice}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Crear Factura (${cart.total})
              </button>
            )}
          </div>
        </header>

        {/* Estadísticas para admin */}
        {currentUser?.role === 'admin' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Usuarios</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_users}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Productos</h3>
              <p className="text-3xl font-bold text-green-600">{stats.total_products}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Facturas</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.total_invoices}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Ventas</h3>
              <p className="text-3xl font-bold text-orange-600">${stats.total_sales}</p>
            </div>
          </div>
        )}

        {/* Productos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Productos Disponibles</h2>
          {products.length === 0 ? (
            <p className="text-center text-slate-700 text-lg">
              No hay productos disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const quantity = getCartItemQuantity(product.id);
                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-xl"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <p className="text-lg text-slate-700 mb-2">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {product.stock === 0 ? 'Sin Stock' : 'Añadir al carrito'}
                      </button>
                      {quantity > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                          {quantity} en carrito
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Carrito actual */}
        {cart && cart.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Carrito Actual</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div>
                    <span className="font-medium">{item.product_name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
