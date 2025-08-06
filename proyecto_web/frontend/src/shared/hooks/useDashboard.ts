// src/lib/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, authenticatedRequest } from '@/lib/api';

// Tipos
export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_sales: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    loading: false,
    error: null,
  });

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Llama directamente al endpoint usando authenticatedRequest
      const url = API_CONFIG.BASE_URL + API_CONFIG.DASHBOARD.STATS;
      const response = await authenticatedRequest(url);
      const stats = await response.json();
      setState(prev => ({
        ...prev,
        stats,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al cargar estadísticas';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    loadStats,
    clearError,
  };
}; 