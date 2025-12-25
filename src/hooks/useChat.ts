// src/hooks/useChat.ts
'use client';

import { useChat as useAIChat } from '@ai-sdk/react';
import { useCallback, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Message, Conversation } from '@/types';

export function useChat() {
  const {
    conversations,
    currentConversationId,
    currentProvider,
    currentModel,
    apiKeys,
    addConversation,
    setCurrentConversation,
  } = useChatStore();

  const [error, setError] = useState<string | null>(null);

  const apiKey = apiKeys[currentProvider];
  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  // ✅ 使用 AI SDK 6.0 的 useChat hook
  const {
    messages,
    input,
    setInput,
    isLoading,
    append,
    reload,
    stop,
  } = useAIChat({
    api: '/api/chat',
    body: {
      model: currentModel,
      provider: currentProvider,
      encryptedApiKey: apiKey || '',
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!apiKey) {
        setError(`请先配置 ${currentProvider} 的 API Key`);
        return;
      }

      setError(null);

      // 创建新对话
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

      // ✅ AI SDK 6.0 使用 append 发送消息
      await append({
        role: 'user',
        content,
      });
    },
    [apiKey, currentProvider, currentConversationId, currentModel, addConversation, append]
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
    sendMessage,
    createNewChat,
    reload,
    stop,
  };
}