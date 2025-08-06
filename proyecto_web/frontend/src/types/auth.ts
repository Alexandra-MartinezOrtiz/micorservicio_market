// types/auth.ts

// Tipos de request
export interface LoginRequest {
  email: string;
  password: string;
  is_admin?: boolean; // Opcional para validación de rol
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  is_admin: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// Tipos de response
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

// Tipos de estado
export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}