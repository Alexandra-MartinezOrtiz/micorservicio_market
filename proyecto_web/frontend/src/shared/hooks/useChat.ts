// src/shared/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/modules/chat/services/chatService';
// No se usa ApiError, se usa Error estándar lanzado por handleApiError

// Tipos
export interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
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
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const messages = await chatService.getMessages();
      setState(prev => ({
        ...prev,
        messages,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar mensajes';
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
      await chatService.sendMessage(message);
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar mensaje';
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

    // Construir URL WebSocket con ws/secure ws (wss) según protocolo base API_CONFIG
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const protocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${baseUrl.replace(/^https?:\/\//, '')}/ws/chat?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setState(prev => ({ ...prev, connected: true, error: null }));
    };

    ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      } catch (error) {
        console.error('Error al parsear mensaje WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setState(prev => ({ ...prev, connected: false }));

      // Reintentar conexión en 3 segundos
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
      setState(prev => ({
        ...prev,
        connected: false,
        error: 'Error de conexión WebSocket',
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

  // Cargar mensajes y conectar WebSocket al montar
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    connectWebSocket();
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
