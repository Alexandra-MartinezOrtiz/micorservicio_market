// src/lib/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { api, setAuthToken, removeAuthToken, isAuthenticated } from '@/lib/services/api';
import { ApiError } from '@/lib/services/api';

// Tipos
export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  is_admin?: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const user = await api.auth.getProfile();
          setState(prev => ({
            ...prev,
            user,
            loading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        removeAuthToken();
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: UserLogin): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: AuthResponse = await api.auth.login(credentials);
      setAuthToken(response.access_token);
      
      const user = await api.auth.getProfile();
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error de inicio de sesión';
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  // Register
  const register = useCallback(async (userData: UserRegister): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: AuthResponse = await api.auth.register(userData);
      setAuthToken(response.access_token);
      
      const user = await api.auth.getProfile();
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error de registro';
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    removeAuthToken();
    setState({
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) return;

    try {
      const user = await api.auth.getProfile();
      setState(prev => ({
        ...prev,
        user,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  }, [logout]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
}; 