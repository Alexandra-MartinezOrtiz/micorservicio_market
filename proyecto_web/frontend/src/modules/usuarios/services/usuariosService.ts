// src/modules/usuarios/services/usuariosService.ts
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/api';
import { API_CONFIG } from '@/lib/api';
import { UserProfile } from '@/types/auth';

// Tipos específicos para el servicio de usuarios
export interface UserUpdate {
  name?: string;
  email?: string;
  role?: string;
  is_admin?: boolean;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  is_admin?: boolean;
}

export interface UsersListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  per_page: number;
}

export const usuariosService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.USERS.ME));
    return await response.json();
  },

  /**
   * Obtiene el perfil de un usuario específico por ID (solo admin)
   */
  async getUserById(userId: number): Promise<UserProfile> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.USERS.BY_ID(userId.toString()))
    );
    return await response.json();
  },

  /**
   * Lista todos los usuarios con paginación (solo admin)
   */
  async getAllUsers(page: number = 1, perPage: number = 10): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    const response = await authenticatedRequest(
      buildApiUrl(`/users?${queryParams.toString()}`)
    );
    return await response.json();
  },

  /**
   * Busca usuarios por término de búsqueda (solo admin)
   */
  async searchUsers(searchTerm: string, page: number = 1, perPage: number = 10): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    const response = await authenticatedRequest(
      buildApiUrl(`/users/search?${queryParams.toString()}`)
    );
    return await response.json();
  },

  /**
   * Actualiza el perfil del usuario autenticado
   */
  async updateCurrentUser(userData: Partial<UserUpdate>): Promise<UserProfile> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.USERS.ME),
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      }
    );
    return await response.json();
  },

  /**
   * Actualiza un usuario específico (solo admin)
   */
  async updateUser(userId: number, userData: Partial<UserUpdate>): Promise<UserProfile> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.USERS.BY_ID(userId.toString())),
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      }
    );
    return await response.json();
  },

  /**
   * Crea un nuevo usuario (solo admin)
   */
  async createUser(userData: UserCreateRequest): Promise<UserProfile> {
    const response = await authenticatedRequest(
      buildApiUrl('/users'),
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    return await response.json();
  },

  /**
   * Elimina un usuario (solo admin)
   */
  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.USERS.BY_ID(userId.toString())),
      {
        method: 'DELETE',
      }
    );
    return await response.json();
  },

  /**
   * Activa o desactiva un usuario (solo admin)
   */
  async toggleUserStatus(userId: number, isActive: boolean): Promise<UserProfile> {
    const response = await authenticatedRequest(
      buildApiUrl(`/users/${userId}/toggle-status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive }),
      }
    );
    return await response.json();
  },

  /**
   * Obtiene estadísticas de usuarios (solo admin)
   */
  async getUsersStats(): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    admin_users: number;
    recent_registrations: number;
  }> {
    const response = await authenticatedRequest(buildApiUrl('/users/stats'));
    return await response.json();
  },
};