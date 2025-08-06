'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import ProtectedLayout from '@/shared/components/ProtectedLayout';
import { 
  ArrowLeftIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

// Mock del hook useChat hasta que lo implementes
const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user_id: 1,
      message: "¡Hola! Bienvenido al chat.",
      created_at: new Date(Date.now() - 60000).toISOString(),
      username: "Sistema"
    },
    {
      id: 2,
      user_id: 2,
      message: "¿Cómo están todos?",
      created_at: new Date(Date.now() - 30000).toISOString(),
      username: "Usuario Demo"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(true);

  const sendMessage = async (message: string) => {
    // Simular envío de mensaje
    const newMessage = {
      id: messages.length + 1,
      user_id: 999, // ID del usuario actual
      message,
      created_at: new Date().toISOString(),
      username: "Tú"
    };
    
    setMessages(prev => [...prev, newMessage]);
    return true;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    connected,
    sendMessage,
    clearError
  };
};

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

  // Función para manejar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header de navegación */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link 
                    href="/dashboard" 
                    className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <h1 className="text-xl font-semibold text-gray-900">Chat IA</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando chat...</p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header de navegación */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link 
                    href="/dashboard" 
                    className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <h1 className="text-xl font-semibold text-gray-900">Chat IA</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar chat</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={clearError}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header de navegación */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link 
                  href="/dashboard" 
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="Volver al dashboard"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Chat IA</h1>
                  <p className="text-sm text-gray-500">Asistente inteligente</p>
                </div>
              </div>
              
              {/* Estado de conexión */}
              <div className="flex items-center space-x-2">
                {connected ? (
                  <div className="flex items-center text-green-600">
                    <SignalIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <SignalSlashIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Desconectado</span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {user?.name || 'Usuario'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del chat */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Área de mensajes */}
            <div className="h-[70vh] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No hay mensajes aún</p>
                  <p className="text-sm">¡Inicia una conversación con la IA!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${
                      msg.user_id === 999 ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className="flex max-w-xs lg:max-w-md">
                      {msg.user_id !== 999 && (
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">
                              {msg.username?.charAt(0).toUpperCase() || 'IA'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.user_id === 999
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <div className={`mt-1 text-xs text-gray-500 ${
                          msg.user_id === 999 ? 'text-right' : 'text-left'
                        }`}>
                          {format(new Date(msg.created_at), 'HH:mm', { locale: es })}
                        </div>
                      </div>
                      
                      {msg.user_id === 999 && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de envío */}
            <div className="border-t bg-gray-50 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={1}
                    disabled={isSending || !connected}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
                  disabled={!inputMessage.trim() || isSending || !connected}
                >
                  {isSending ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </button>
              </form>
              
              {!connected && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Sin conexión. Verifica tu conexión a internet.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tips de uso */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Presiona Enter para enviar tu mensaje</li>
              <li>• Usa Shift + Enter para agregar una nueva línea</li>
              <li>• La IA puede ayudarte con consultas sobre productos, soporte técnico y más</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}