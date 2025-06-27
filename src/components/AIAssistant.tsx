import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react';
import { AIService } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && isOpen) {
      loadChatHistory();
    }
  }, [user, isOpen]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const chatMessages: ChatMessage[] = data.map(chat => ({
        id: chat.id,
        message: chat.message,
        response: chat.response,
        timestamp: new Date(chat.created_at)
      }));

      setMessages(chatMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatMessage = async (message: string, response: string) => {
    if (!user) return;

    try {
      await supabase
        .from('ai_chats')
        .insert([{
          user_id: user.id,
          message,
          response
        }]);
    } catch (error) {
      console.error('Failed to save chat message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await AIService.getCookingAdvice(userMessage);
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Save to database
      if (user) {
        await saveChatMessage(userMessage, response);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">AI Cooking Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Ask me anything about cooking!</p>
            <p className="text-sm mt-2">Recipe suggestions, cooking tips, ingredient substitutions, and more.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* User Message */}
            <div className="flex items-start space-x-2">
              <div className="bg-primary-100 p-2 rounded-full">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-primary-50 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-800">{msg.message}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex items-start space-x-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.response}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about recipes, cooking tips..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;