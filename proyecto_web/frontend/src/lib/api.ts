// lib/api.ts

export const API_CONFIG = {
  // URL base del backend FastAPI
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Endpoints de autenticación
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGIN_ADMIN: '/auth/login/admin',
    LOGIN_USER: '/auth/login/user',
    ME: '/users/me',
    RESET_PASSWORD_REQUEST: '/auth/reset-password/request',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Endpoints de usuarios
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
    STATS: '/users/stats',
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
  },
  
  // Endpoints de productos
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },
  
  // Endpoints del carrito
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    TOTAL: '/cart/total',
  },
  
  // Endpoints del chat
  CHAT: {
    MESSAGES: '/chat/messages',
    WEBSOCKET: '/ws/chat',
  },
  
  // Endpoints de facturación
  INVOICING: {
    CREATE: '/invoicing/create',
    ME: '/invoicing/me',
    BY_ID: (id: string) => `/invoicing/${id}`,
  },
  
  // Endpoints del dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para manejar errores de la API
export const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'Error desconocido';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorData.message || errorMessage;
  } catch {
    errorMessage = `Error ${response.status}: ${response.statusText}`;
  }
  
  throw new Error(errorMessage);
};

// Función helper para hacer requests autenticados
export const authenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth_token');

  const mergedHeaders = new Headers(options.headers || {});

  // Solo agrega Content-Type si no está definido y el método es POST, PUT, PATCH
  if (
    !mergedHeaders.has('Content-Type') &&
    ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase())
  ) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    mergedHeaders.set('Authorization', `Bearer ${token}`);
  } else {
    console.warn('No se encontró token de autenticación en localStorage');
  }

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response;
};