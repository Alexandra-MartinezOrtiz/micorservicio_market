import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/modules/auth/services/authService';
import {
  UserProfile,
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordReset,
  PasswordChange,
} from '@/types/auth';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isInitialized: false,
    isAuthenticated: false,
  });

  const isCheckingAuth = useRef(false);
  const initializationAttempted = useRef(false);

  const checkAuth = useCallback(async () => {
    // Prevenir múltiples ejecuciones simultáneas
    if (isCheckingAuth.current) {
      console.log('🔄 useAuth - checkAuth ya en progreso, saltando...');
      return;
    }

    // Verificar si estamos en el cliente
    if (typeof window === 'undefined') {
      console.log('🔄 useAuth - Ejecutándose en servidor, saltando...');
      return;
    }

    isCheckingAuth.current = true;
    console.log('🔍 useAuth - Iniciando verificación de autenticación...');

    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      console.log('🔍 useAuth - Token presente:', !!token);
      console.log('🔍 useAuth - Usuario almacenado:', !!storedUser);

      if (!token) {
        console.log('❌ useAuth - No hay token, usuario no autenticado');
        setState({
          user: null,
          loading: false,
          error: null,
          isInitialized: true,
          isAuthenticated: false,
        });
        return;
      }

      // Si tenemos token y usuario almacenado, usar el usuario almacenado primero
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('✅ useAuth - Usuario encontrado en localStorage:', user.name);
          
          setState({
            user,
            loading: false,
            error: null,
            isInitialized: true,
            isAuthenticated: true,
          });

          // Verificar el perfil en segundo plano para asegurar que el token sigue siendo válido
          try {
            const freshUser = await authService.getProfile();
            localStorage.setItem('auth_user', JSON.stringify(freshUser));
            setState(prev => ({ ...prev, user: freshUser }));
            console.log('✅ useAuth - Perfil actualizado en segundo plano');
          } catch (profileError) {
            console.log('⚠️ useAuth - Error al actualizar perfil, token podría ser inválido');
            // Si el token es inválido, limpiar todo
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setState({
              user: null,
              loading: false,
              error: null,
              isInitialized: true,
              isAuthenticated: false,
            });
          }
          
          return;
        } catch (parseError) {
          console.log('❌ useAuth - Error al parsear usuario almacenado, obteniendo perfil fresco');
          localStorage.removeItem('auth_user');
        }
      }

      // Si tenemos token pero no usuario válido, obtener perfil
      if (token) {
        try {
          console.log('🔄 useAuth - Obteniendo perfil del servidor...');
          const user = await authService.getProfile();
          localStorage.setItem('auth_user', JSON.stringify(user));
          console.log('✅ useAuth - Perfil obtenido exitosamente:', user.name);
          
          setState({
            user,
            loading: false,
            error: null,
            isInitialized: true,
            isAuthenticated: true,
          });
        } catch (profileError) {
          console.log('❌ useAuth - Error al obtener perfil, token inválido');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setState({
            user: null,
            loading: false,
            error: 'Token de sesión inválido',
            isInitialized: true,
            isAuthenticated: false,
          });
        }
      }
    } catch (error) {
      console.error('💥 useAuth - Error en checkAuth:', error);
      setState({
        user: null,
        loading: false,
        error: 'Error al verificar autenticación',
        isInitialized: true,
        isAuthenticated: false,
      });
    } finally {
      isCheckingAuth.current = false;
    }
  }, []);

  // Inicializar solo una vez
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      console.log('🚀 useAuth - Inicializando por primera vez...');
      checkAuth();
    }
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    console.log('🔑 useAuth - Iniciando login...');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await authService.login(credentials);
      console.log('✅ useAuth - Login service exitoso');
      
      const user = await authService.getProfile();
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ useAuth - Perfil obtenido después del login:', user.name);
      
      setState({
        user,
        loading: false,
        error: null,
        isInitialized: true,
        isAuthenticated: true,
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ useAuth - Error en login:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        loading: false,
        error: error.message || 'Error de inicio de sesión',
        isInitialized: true,
        isAuthenticated: false,
      });
      return false;
    }
  }, []);

  const loginAdmin = useCallback(async (credentials: { email: string; password: string }): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.loginAdmin(credentials);
      const user = await authService.getProfile();
      localStorage.setItem('auth_user', JSON.stringify(user));
      setState({
        user,
        loading: false,
        error: null,
        isInitialized: true,
        isAuthenticated: true,
      });
      return true;
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        loading: false,
        error: error.message || 'Error de inicio de sesión de administrador',
        isInitialized: true,
        isAuthenticated: false,
      });
      return false;
    }
  }, []);

  const loginUser = useCallback(async (credentials: { email: string; password: string }): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.loginUser(credentials);
      const user = await authService.getProfile();
      localStorage.setItem('auth_user', JSON.stringify(user));
      setState({
        user,
        loading: false,
        error: null,
        isInitialized: true,
        isAuthenticated: true,
      });
      return true;
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        loading: false,
        error: error.message || 'Error de inicio de sesión de usuario',
        isInitialized: true,
        isAuthenticated: false,
      });
      return false;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.register(userData);
      const user = await authService.getProfile();
      localStorage.setItem('auth_user', JSON.stringify(user));
      setState({
        user,
        loading: false,
        error: null,
        isInitialized: true,
        isAuthenticated: true,
      });
      return true;
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        loading: false,
        error: error.message || 'Error de registro',
        isInitialized: true,
        isAuthenticated: false,
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 useAuth - Cerrando sesión...');
    authService.logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      loading: false,
      error: null,
      isInitialized: true,
      isAuthenticated: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) {
      console.log('⚠️ useAuth - refreshUser: Usuario no autenticado');
      return;
    }

    try {
      console.log('🔄 useAuth - Refrescando información del usuario...');
      const user = await authService.getProfile();
      localStorage.setItem('auth_user', JSON.stringify(user));
      setState(prev => ({
        ...prev,
        user,
        error: null,
      }));
      console.log('✅ useAuth - Usuario refrescado exitosamente');
    } catch (error) {
      console.error('❌ useAuth - Error al refrescar usuario:', error);
      logout();
    }
  }, [state.isAuthenticated, logout]);

  const requestPasswordReset = useCallback(async (data: PasswordResetRequest): Promise<{ message: string }> => {
    return await authService.requestPasswordReset(data);
  }, []);

  const resetPassword = useCallback(async (data: PasswordReset): Promise<{ message: string }> => {
    return await authService.resetPassword(data);
  }, []);

  const changePassword = useCallback(async (data: PasswordChange): Promise<{ message: string }> => {
    return await authService.changePassword(data);
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Debug logs mejorados
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 useAuth State Update:', {
        user: state.user ? { name: state.user.name, id: state.user.id } : null,
        loading: state.loading,
        isInitialized: state.isInitialized,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        timestamp: new Date().toISOString().split('T')[1].split('.')[0]
      });
    }
  }, [state]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,

    login,
    loginAdmin,
    loginUser,
    register,
    logout,
    refreshUser,

    requestPasswordReset,
    resetPassword,
    changePassword,

    clearError,
  };
};