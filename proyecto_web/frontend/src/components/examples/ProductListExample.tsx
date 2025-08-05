// src/components/examples/ProductListExample.tsx
'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/lib/services/product-service';
import { cartService } from '@/lib/services/cart-service';
import { Product } from '@/types/product';
import { Cart } from '@/types/cart';

export default function ProductListExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
      } finally {
        setLoading(false);
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

  // Remover del carrito
  const handleRemoveFromCart = async (productId: number) => {
    try {
      const updatedCart = await cartService.removeFromCart({
        product_id: productId
      });
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al remover del carrito');
    }
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>
      
      {/* Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      {/* Carrito */}
      {cart && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
          {cart.items.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">{item.product_name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${item.subtotal}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-xl">${cart.total}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 