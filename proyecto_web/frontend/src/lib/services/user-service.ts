// src/lib/services/user-service.ts
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/config/api';
import { API_CONFIG } from '@/lib/config/api';
import { UserProfile, AuthenticatedUser } from '@/types/auth';

export const userService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.AUTH.ME));
    return await response.json();
  },

  /**
   * Obtiene el perfil de un usuario específico (solo admin)
   */
  async getUserById(userId: number): Promise<UserProfile> {
    const response = await authenticatedRequest(buildApiUrl(`/users/${userId}`));
    return await response.json();
  },

  /**
   * Lista todos los usuarios (solo admin)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await authenticatedRequest(buildApiUrl('/users'));
    return await response.json();
  },
};