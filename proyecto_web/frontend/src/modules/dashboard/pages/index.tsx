'use client';

import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import  ProtectedLayout  from '@/shared/components/ProtectedLayout';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // No necesitamos redirección manual, useAuth se encarga
  };

  const handleClearStorage = () => {
    localStorage.clear();
    alert('Storage limpiado. Recargando página...');
    window.location.reload();
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">🚀 DASHBOARD FUNCIONAL</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user ? `Hola, ${user.name}` : 'Cargando usuario...'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  🎉 ¡DASHBOARD CARGADO CORRECTAMENTE! 🎉
                </h2>
                <p className="text-gray-700 mb-4">
                  Si estás viendo esto, significa que la autenticación y redirección funcionaron correctamente.
                </p>
                
                {user && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border">
                      <h3 className="text-md font-semibold text-blue-800">Información del Usuario</h3>
                      <p className="text-blue-600"><strong>Nombre:</strong> {user.name}</p>
                      <p className="text-blue-600"><strong>Email:</strong> {user.email}</p>
                      <p className="text-blue-600"><strong>ID:</strong> {user.id}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border">
                      <h3 className="text-md font-semibold text-green-800">Rol</h3>
                      <p className="text-green-600 text-lg">
                        {user.is_admin ? '👑 Administrador' : '👤 Usuario'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de prueba */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🔧 Herramientas de Prueba</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    🔑 Ir al Login
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    🏠 Ir al Home
                  </button>
                  
                  <button 
                    onClick={handleClearStorage}
                    className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition"
                  >
                    🗑️ Limpiar Storage
                  </button>
                  
                  <button 
                    onClick={() => {
                      console.log('🔍 DEBUG STORAGE:');
                      console.log('Token:', localStorage.getItem('auth_token'));
                      console.log('User:', localStorage.getItem('auth_user'));
                      alert('Revisa la consola para ver el estado del localStorage');
                    }}
                    className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    🔍 Debug Storage
                  </button>
                  
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition"
                  >
                    🔄 Recargar Página
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    🚪 Logout Manual
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Estado actual:</h4>
                  <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-auto">
{JSON.stringify({
  user: user ? { 
    name: user.name, 
    email: user.email, 
    is_admin: user.is_admin,
    id: user.id 
  } : null,
  hasToken: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : 'unknown',
  hasUserData: typeof window !== 'undefined' ? !!localStorage.getItem('auth_user') : 'unknown',
  timestamp: new Date().toISOString()
}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}