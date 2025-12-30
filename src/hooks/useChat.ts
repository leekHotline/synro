// src/hooks/useChat.ts
'use client';

import { Chat, useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useState, useMemo } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Conversation } from '@/types';

export function useChat() {
  const {
    currentConversationId,
    currentProvider,
    currentModel,
    apiKeys,
    _hasHydrated,
    addConversation,
    setCurrentConversation,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const apiKey = apiKeys[currentProvider] || '';

  // 使用 useMemo 创建稳定的 Chat 实例
  const chat = useMemo(() => {
    const transport = new DefaultChatTransport({
      api: '/api/chat',
      body: {
        model: currentModel,
        provider: currentProvider,
        ...(apiKey && { encryptedApiKey: apiKey }),
      },
    });
    return new Chat({ transport });
  }, [currentModel, currentProvider, apiKey]);

  const {
    messages,
    status,
    error: chatError,
    sendMessage,
    stop,
    clearError,
  } = useAIChat({ chat });

  const isLoading = status === 'submitted' || status === 'streaming';
  const error = chatError?.message || localError;

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!_hasHydrated) {
        setLocalError('正在加载配置，请稍候...');
        return;
      }

      // Google 提供商可以使用服务端默认 key
      if (!apiKey && currentProvider !== 'google') {
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
    [_hasHydrated, apiKey, currentProvider, currentConversationId, currentModel, addConversation, sendMessage, clearError]
  );

  const createNewChat = useCallback(() => {
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
    isReady: _hasHydrated,
  };
}
