// hooks/use-chat-history.ts
'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  timestamp: string;
}

export function useChatHistory() {
  const [chats, setChats] = useLocalStorage<ChatSession[]>('chat-history', []);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date().toISOString(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const updateChatMessages = (chatId: string, messages: any[]) => {
    setChats(chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages, timestamp: new Date().toISOString() }
        : chat
    ));
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const getChatById = (chatId: string) => {
    return chats.find(chat => chat.id === chatId);
  };

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    deleteChat,
    getChatById,
  };
}
