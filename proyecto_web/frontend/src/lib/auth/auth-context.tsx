// src/lib/auth/auth-context.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth-service';
import {
  UserProfile,
  AuthContextType,
  UserRole,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setCurrentUser(null);
        // Limpiar token inválido
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authData = await authService.login({ email, password });
      setCurrentUser(authData.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error de inicio de sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    setLoading(true);
    try {
      const authData = await authService.register({ 
        email, 
        password, 
        display_name: displayName 
      });
      setCurrentUser(authData.user);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error de registro' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setCurrentUser(null);
      authService.logout();
    }
  };

  const hasRole = (role: UserRole): boolean => currentUser?.role === role;

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!currentUser) return false;

    const roleHierarchy: Record<UserRole, number> = {
      client: 1,
      employee: 2,
      admin: 3,
    };

    return roleHierarchy[currentUser.role as UserRole] >= roleHierarchy[minimumRole];
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasMinimumRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
