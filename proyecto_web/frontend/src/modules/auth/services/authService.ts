// modules/auth/services/authService.ts

import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/api';
import { API_CONFIG } from '@/lib/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile,
  PasswordResetRequest,
  PasswordReset,
  PasswordChange
} from '@/types/auth';

export const authService = {
  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('Intentando registrar usuario:', { ...data, password: '[HIDDEN]' });
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Error en el registro';
        try {
          const errorData = await response.json();
          console.log('Error del servidor:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          console.log('Error al parsear respuesta de error:', e);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const authData: AuthResponse = await response.json();
      console.log('Registro exitoso, guardando token...');
      localStorage.setItem('auth_token', authData.access_token);
      return authData;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  },

  /**
   * Login general con validación opcional de rol
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('Intentando login para:', data.email, 'como', data.is_admin ? 'admin' : 'usuario');
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Respuesta del login:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Error en el login';
        try {
          const errorData = await response.json();
          console.log('Error del servidor:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const authData: AuthResponse = await response.json();
      console.log('Login exitoso, guardando token...');
      localStorage.setItem('auth_token', authData.access_token);
      return authData;
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  },

  /**
   * Login específico para administradores
   */
  async loginAdmin(data: { email: string; password: string }): Promise<AuthResponse> {
    console.log('Login de administrador para:', data.email);
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN_ADMIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Error en el login de administrador';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const authData: AuthResponse = await response.json();
      localStorage.setItem('auth_token', authData.access_token);
      return authData;
    } catch (error) {
      console.error('Error en el login de admin:', error);
      throw error;
    }
  },

  /**
   * Login específico para usuarios regulares
   */
  async loginUser(data: { email: string; password: string }): Promise<AuthResponse> {
    console.log('Login de usuario regular para:', data.email);
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN_USER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Error en el login de usuario';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const authData: AuthResponse = await response.json();
      localStorage.setItem('auth_token', authData.access_token);
      return authData;
    } catch (error) {
      console.error('Error en el login de usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(): Promise<UserProfile> {
    console.log('Obteniendo perfil del usuario...');
    try {
      const response = await authenticatedRequest(buildApiUrl(API_CONFIG.AUTH.ME));
      const profile = await response.json();
      console.log('Perfil obtenido:', profile);
      return profile;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  /**
   * Solicita el reset de contraseña
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await fetch(buildApiUrl(API_CONFIG.AUTH.RESET_PASSWORD_REQUEST), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  },

  /**
   * Resetea la contraseña con el token
   */
  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    const response = await fetch(buildApiUrl(API_CONFIG.AUTH.RESET_PASSWORD), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  },

  /**
   * Cambia la contraseña del usuario autenticado
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    const response = await authenticatedRequest(
      buildApiUrl(API_CONFIG.AUTH.CHANGE_PASSWORD),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return await response.json();
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
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