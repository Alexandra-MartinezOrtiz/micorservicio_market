// src/app/(main)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();

  // Usar useEffect para manejar la redirección
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar loading mientras se redirige
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-blue-600 p-4 text-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold">
            Market JALS
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/products" className="hover:text-blue-200">
              Productos
            </Link>
            <Link href="/cart" className="hover:text-blue-200">
              Carrito
            </Link>
            <Link href="/chat" className="hover:text-blue-200">
              Chat
            </Link>
            <Link href="/invoicing" className="hover:text-blue-200">
              Facturación
            </Link>
            {/* Enlace para administradores */}
            {currentUser.role === 'admin' && (
              <Link href="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
            )}
            <span className="ml-4 font-semibold">
              Bienvenido, {currentUser.display_name || currentUser.email} ({currentUser.role})
            </span>
            <button
              onClick={logout}
              className="rounded bg-blue-700 px-3 py-1 hover:bg-blue-800 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto flex-grow p-4">{children}</main>
      <footer className="mt-8 bg-gray-200 p-4 text-center text-gray-600">
        © 2025 Market JALS. Todos los derechos reservados.
      </footer>
    </div>
  );
}