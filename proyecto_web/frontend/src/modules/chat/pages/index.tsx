'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/shared/hooks/useChat';
import { useAuth } from '@/shared/hooks/useAuth';
import  ProtectedLayout  from '@/shared/components/ProtectedLayout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function ChatPage() {
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    error, 
    connected, 
    sendMessage, 
    clearError 
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función para enviar un nuevo mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const success = await sendMessage(inputMessage);
      if (success) {
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando chat...</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Error al cargar chat</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={clearError}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex h-[80vh] flex-col rounded-lg border border-gray-300 bg-white shadow-lg">
            {/* Encabezado del chat */}
            <div className="border-b p-4 text-lg font-semibold bg-gray-50">
              Chat General
              <span
                className={`ml-2 text-sm font-medium ${
                  connected ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ({connected ? 'conectado' : 'desconectado'})
              </span>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`mb-3 flex ${
                      msg.user_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg p-3 ${
                        msg.user_id === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {msg.user_id === user?.id ? 'Tú' : `Usuario ${msg.user_id}`}
                      </div>
                      <p className="text-base mt-1">{msg.message}</p>
                      <div className="mt-1 text-right text-xs opacity-80">
                        {format(new Date(msg.created_at), 'p', { locale: es })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de envío */}
            <form onSubmit={handleSendMessage} className="flex border-t p-4 bg-white">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 rounded-l-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                disabled={isSending || !connected}
              />
              <button
                type="submit"
                className="rounded-r-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputMessage.trim() || isSending || !connected}
              >
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}