'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/router';

// Validación: is_admin es string ('true'|'false') para que coincida con el formulario
const schema = yup.object().shape({
  displayName: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Las contraseñas no coinciden').required('Confirma tu contraseña'),
  is_admin: yup.string().oneOf(['true', 'false'], 'Selecciona un rol').required('Selecciona un rol'),
});

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  is_admin: 'true' | 'false'; // string en el formulario, se convierte a booleano antes de enviar
}

export default function RegisterPage() {
  const { register: authRegister, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const is_admin = data.is_admin === 'true';
      const success = await authRegister({
        email: data.email,
        password: data.password,
        name: data.displayName,
        is_admin,
      });

      if (success) {
        router.push('/dashboard');
      } else {
        setError('Error al registrar usuario');
      }
    } catch (err: any) {
      let errorMessage = 'Error al registrar. Inténtalo de nuevo.';
      // Mostrar mensaje exacto del backend si existe
      if (err?.response && typeof err.response.json === 'function') {
        try {
          const data = await err.response.json();
          if (data?.detail) errorMessage = data.detail;
        } catch {}
      } else if (err?.message) {
        if (err.message.includes('already exists') || err.message.includes('already registered')) {
          errorMessage = 'Este email ya está registrado.';
        } else if (err.message.includes('invalid email')) {
          errorMessage = 'El formato del email es inválido.';
        } else if (err.message.includes('weak password')) {
          errorMessage = 'La contraseña es demasiado débil.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Completa el formulario para registrarte</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <input
              id="displayName"
              type="text"
              {...register('displayName')}
              placeholder="Nombre completo"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            {errors.displayName && <p className="text-red-600 text-sm">{errors.displayName.message}</p>}

            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Correo electrónico"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Contraseña"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirmar contraseña"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}

            <div>
              <label htmlFor="is_admin" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="is_admin"
                {...register('is_admin')}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              >
                <option value="false">Usuario</option>
                <option value="true">Administrador</option>
              </select>
              {errors.is_admin && <p className="text-red-600 text-sm">{errors.is_admin.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
