// src/lib/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/services/api';
import { ApiError } from '@/lib/services/api';

// Tipos
export interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
}

export interface ChatMessageCreate {
  message: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null,
    connected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const messages = await api.chat.getMessages();
      setState(prev => ({
        ...prev,
        messages,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cargar mensajes';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!message.trim()) return false;

    setState(prev => ({ ...prev, error: null }));

    try {
      await api.chat.sendMessage({ message });
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al enviar mensaje';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  // Conectar WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token available for WebSocket connection');
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/chat?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setState(prev => ({ ...prev, connected: true, error: null }));
    };

    ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        setState(prev => ({
          ...prev,
          messages: prev.messages.concat(message),
        }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, connected: false }));
      
      // Intentar reconectar después de 3 segundos
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        error: 'Error de conexión WebSocket' 
      }));
    };

    wsRef.current = ws;
  }, []);

  // Desconectar WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Cargar mensajes al montar el componente
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Conectar WebSocket cuando el componente se monta
  useEffect(() => {
    connectWebSocket();

    // Limpiar al desmontar
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    connected: state.connected,
    loadMessages,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket,
    clearError,
  };
}; 