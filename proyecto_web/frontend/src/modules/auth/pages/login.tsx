'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/router';

// Validación
const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  role: yup.string().oneOf(['usuario', 'admin'], 'Selecciona un rol válido').required('Selecciona un rol'),
});

interface LoginFormData {
  email: string;
  password: string;
  role: 'admin' | 'usuario';
}

export default function LoginPage() {
  const { login, isAuthenticated, loading, isInitialized, error: authError } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasRedirected = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  // Manejar redirección cuando ya está autenticado
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);
    
    const is_admin = data.role === 'admin';
    
    console.log('🔄 Iniciando login con:', { email: data.email, is_admin });

    try {
      const success = await login({ 
        email: data.email, 
        password: data.password, 
        is_admin 
      });

      console.log('✅ Login result:', success);

      if (success) {
        console.log('🚀 Login exitoso, el useEffect manejará la redirección...');
        // No forzar redirección aquí, dejar que useEffect lo maneje
      } else {
        console.log('❌ Login falló');
        setError('Error al iniciar sesión');
      }
    } catch (err: any) {
      console.log('💥 Error en login:', err);
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      if (err?.message) {
        if (err.message.toLowerCase().includes('invalid') || err.message.toLowerCase().includes('wrong')) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no está inicializado, mostrar loading
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar loading mientras redirige
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para continuar</p>
        </div>

        {/* Error del formulario */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Error del hook useAuth */}
        {authError && (
          <div className="rounded-md bg-orange-50 p-4 border border-orange-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">{authError}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Correo electrónico"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contraseña"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <select
                id="role"
                {...register('role')}
                className="block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un rol</option>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/reset-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
            >
              {(loading || isSubmitting) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Crear cuenta
          </Link>
        </div>

        {/* Debug info en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
            <div><strong>Debug Info:</strong></div>
            <div>isInitialized: {isInitialized.toString()}</div>
            <div>loading: {loading.toString()}</div>
            <div>isAuthenticated: {isAuthenticated.toString()}</div>
            <div>isSubmitting: {isSubmitting.toString()}</div>
            <div>hasRedirected: {hasRedirected.current.toString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}