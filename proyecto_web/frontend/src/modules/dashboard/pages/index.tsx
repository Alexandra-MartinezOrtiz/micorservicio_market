'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/shared/hooks/useAuth';
import ProtectedLayout from '@/shared/components/ProtectedLayout';
import {
  HomeIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UsersIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Configuración de menú
const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Vista general del sistema',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    name: 'Productos',
    href: '/products',
    icon: ShoppingBagIcon,
    description: 'Gestión de inventario y catálogo',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  {
    name: 'Chat IA',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    description: 'Asistente inteligente',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    name: 'Facturación',
    href: '/invoicing',
    icon: DocumentTextIcon,
    description: 'Gestión de facturas y pagos',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: UsersIcon,
    description: 'Administración de usuarios',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    adminOnly: true
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: CogIcon,
    description: 'Ajustes del sistema',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100'
  }
];

// Estadísticas simuladas
const stats = [
  { 
    name: 'Productos Totales', 
    value: '2,451', 
    change: '+12%', 
    changeType: 'positive',
    icon: ShoppingBagIcon 
  },
  { 
    name: 'Usuarios Activos', 
    value: '1,245', 
    change: '+8%', 
    changeType: 'positive',
    icon: UsersIcon 
  },
  { 
    name: 'Facturas Este Mes', 
    value: '186', 
    change: '+23%', 
    changeType: 'positive',
    icon: DocumentTextIcon 
  },
  { 
    name: 'Consultas IA', 
    value: '3,247', 
    change: '+45%', 
    changeType: 'positive',
    icon: ChatBubbleLeftRightIcon 
  }
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtrar elementos del menú basado en permisos
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user && !user.is_admin) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    logout();
  };

  const handleClearStorage = () => {
    localStorage.clear();
    alert('Storage limpiado. Recargando página...');
    window.location.reload();
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar móvil */}
        <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
            </div>
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {filteredMenuItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.hoverColor} ${item.color}`}>
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
            <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">🚀 MicroApp</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredMenuItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <span className={`group flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive 
                          ? `${item.bgColor} ${item.color} shadow-sm` 
                          : `text-gray-700 ${item.hoverColor}`
                      }`}>
                        <item.icon className={`mr-3 h-6 w-6 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                        </div>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-900 ml-4 md:ml-0">
                    Dashboard
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Búsqueda */}
                  <div className="hidden sm:block">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Notificaciones */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </button>
                  
                  {/* Usuario */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name || 'Cargando...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.is_admin ? 'Administrador' : 'Usuario'}
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Cerrar sesión"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Contenido */}
          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Bienvenida */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  ¡Bienvenido, {user?.name}! 👋
                </h2>
                <p className="mt-2 text-gray-600">
                  Aquí tienes un resumen de tu sistema de microservicios.
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <stat.icon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {stat.name}
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {stat.value}
                              </div>
                              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {stat.change}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid de servicios */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {filteredMenuItems.slice(1).map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${item.hoverColor} transition-all duration-200 hover:shadow-md cursor-pointer group`}>
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 ${item.bgColor} p-3 rounded-lg`}>
                          <item.icon className={`h-8 w-8 ${item.color}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          <ChartBarIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Panel de debug (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">🔧 Herramientas de Debug</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    <button 
                      onClick={() => router.push('/login')}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                    >
                      🔑 Login
                    </button>
                    
                    <button 
                      onClick={() => router.push('/')}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition"
                    >
                      🏠 Home
                    </button>
                    
                    <button 
                      onClick={handleClearStorage}
                      className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition"
                    >
                      🗑️ Limpiar
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('🔍 DEBUG STORAGE:', {
                          token: localStorage.getItem('auth_token'),
                          user: localStorage.getItem('auth_user')
                        });
                        alert('Revisa la consola');
                      }}
                      className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition"
                    >
                      🔍 Debug
                    </button>
                    
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition"
                    >
                      🔄 Reload
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">Estado del Sistema:</h4>
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
  currentPath: router.pathname,
  timestamp: new Date().toISOString()
}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}