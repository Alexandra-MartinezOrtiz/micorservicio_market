
import { buildApiUrl, authenticatedRequest, handleApiError } from '@/lib/api';
import { API_CONFIG } from '@/lib/api';
import { ChatMessage } from '@/types/chat';

export const chatService = {
  /**
   * Obtiene el historial de mensajes
   */
  async getMessages(): Promise<ChatMessage[]> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CHAT.MESSAGES));
    return await response.json();
  },

  /**
   * Envía un mensaje
   */
  async sendMessage(message: string): Promise<ChatMessage> {
    const response = await authenticatedRequest(buildApiUrl(API_CONFIG.CHAT.MESSAGES), {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    return await response.json();
  },

  /**
   * Conecta al WebSocket para mensajes en tiempo real
   */
  connectWebSocket(onMessage: (message: ChatMessage) => void): WebSocket {
    const token = localStorage.getItem('auth_token');
    const wsUrl = API_CONFIG.BASE_URL.replace('http', 'ws') + API_CONFIG.CHAT.WEBSOCKET;
    
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    
    ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return ws;
  },
};
