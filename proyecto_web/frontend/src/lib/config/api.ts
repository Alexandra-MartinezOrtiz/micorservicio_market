// src/lib/config/api.ts
export const API_CONFIG = {
  // URL base del backend FastAPI
  BASE_URL: 'http://localhost:8000',
  
  // Endpoints de autenticación
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/users/me',
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
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response;
}; 