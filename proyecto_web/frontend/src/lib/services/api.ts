// src/lib/services/api.ts

const API_BASE_URL = (typeof window !== 'undefined' ? window.location.origin.replace('3000', '8000') : 'http://localhost:8000');

// Tipos para las respuestas de error
interface ApiErrorResponse {
  detail: string;
  message?: string;
}

// Clase para manejar errores de la API
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función para obtener el token JWT
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Función para guardar el token JWT
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Función para remover el token JWT
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Función helper para manejar errores de respuesta
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorMessage = 'Error desconocido';
    
    try {
      const errorData: ApiErrorResponse = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    throw new ApiError(response.status, errorMessage);
  }
  
  // Si la respuesta es 204 (No Content), no intentar parsear JSON
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Función para hacer requests a la API
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return handleResponse(response);
};

// Funciones específicas para cada endpoint
export const api = {
  // Auth endpoints
  auth: {
    register: async (data: any) => {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    login: async (data: any) => {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getProfile: async () => {
      return apiRequest('/users/me');
    },
  },
  
  // Products endpoints
  products: {
    getAll: async () => {
      return apiRequest('/products');
    },
    
    getById: async (id: number) => {
      return apiRequest(`/products/${id}`);
    },
    
    create: async (data: any) => {
      return apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    update: async (id: number, data: any) => {
      return apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    delete: async (id: number) => {
      return apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Cart endpoints
  cart: {
    getCart: async () => {
      return apiRequest('/cart');
    },
    
    addToCart: async (data: any) => {
      return apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    removeFromCart: async (data: any) => {
      return apiRequest('/cart/remove', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getTotal: async () => {
      return apiRequest('/cart/total');
    },
  },
  
  // Chat endpoints
  chat: {
    getMessages: async () => {
      return apiRequest('/chat/messages');
    },
    
    sendMessage: async (data: any) => {
      return apiRequest('/chat/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  
  // Invoicing endpoints
  invoicing: {
    createInvoice: async (data: any) => {
      return apiRequest('/invoicing/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getMyInvoices: async () => {
      return apiRequest('/invoicing/me');
    },
  },
  
  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      return apiRequest('/dashboard/stats');
    },
  },
}; 