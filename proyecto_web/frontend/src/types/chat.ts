// src/types/chat.ts
export interface ChatMessage {
  id: number;
  user_id: number;
  user_email: string;
  message: string;
  created_at: string;
}

export interface SendMessageRequest {
  message: string;
}