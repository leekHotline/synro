// src/hooks/useChat.ts
'use client';

import { Chat, useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useState, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Conversation } from '@/types';

export function useChat() {
  const {
    currentConversationId,
    currentProvider,
    currentModel,
    apiKeys,
    addConversation,
    setCurrentConversation,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const apiKey = apiKeys[currentProvider];

  // 使用 useRef 存储 Chat 实例
  const chatRef = useRef<Chat<any> | null>(null);

  // 创建 Chat 实例
  if (!chatRef.current) {
    const transport = new DefaultChatTransport({
      api: '/api/chat',
      body: {
        model: currentModel,
        provider: currentProvider,
        encryptedApiKey: apiKey || '',
      },
    });

    chatRef.current = new Chat({
      transport,
    });
  }

  const {
    messages,
    status,
    error: chatError,
    sendMessage,
    stop,
    clearError,
  } = useAIChat({ chat: chatRef.current });

  const isLoading = status === 'submitted' || status === 'streaming';
  const error = chatError?.message || localError;

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!apiKey) {
        setLocalError(`请先配置 ${currentProvider} 的 API Key`);
        return;
      }

      setLocalError(null);
      clearError();

      if (!currentConversationId) {
        const newConv: Conversation = {
          id: crypto.randomUUID(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          model: currentModel,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addConversation(newConv);
      }

      sendMessage({ text: content });
    },
    [apiKey, currentProvider, currentConversationId, currentModel, addConversation, sendMessage, clearError]
  );

  const createNewChat = useCallback(() => {
    chatRef.current = null;
    setCurrentConversation(null);
  }, [setCurrentConversation]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    createNewChat,
    stop,
  };
}