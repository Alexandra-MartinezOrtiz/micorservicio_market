// src/lib/services/auth-service.ts
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/config/api';
import { API_CONFIG } from '@/lib/config/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile 
} from '@/types/auth';

export const authService = {
  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const authData: AuthResponse = await response.json();
    
    // Guardar el token en localStorage
    localStorage.setItem('auth_token', authData.access_token);
    
    return authData;
  },

  /**
   * Inicia sesión de un usuario
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const authData: AuthResponse = await response.json();
    
    // Guardar el token en localStorage
    localStorage.setItem('auth_token', authData.access_token);
    
    return authData;
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.AUTH.ME));
    return await response.json();
  },

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
}; 