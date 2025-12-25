// src/hooks/useChat.ts
'use client';

import { useCallback, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Message } from '@/types';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const {
    conversations,
    currentConversationId,
    currentProvider,
    currentModel,
    apiKeys,
    addConversation,
    addMessage,
    updateMessage,
    setCurrentConversation,
  } = useChatStore();

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const sendMessage = useCallback(
    async (content: string) => {
      const apiKey = apiKeys[currentProvider];
      if (!apiKey) {
        throw new Error(`请先配置 ${currentProvider} 的 API Key`);
      }

      // 创建新对话或使用现有对话
      let conversationId = currentConversationId;
      if (!conversationId) {
        const newConv = {
          id: crypto.randomUUID(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          model: currentModel,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addConversation(newConv);
        conversationId = newConv.id;
      }

      // 添加用户消息
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date(),
      };
      addMessage(conversationId, userMessage);

      // 准备发送的消息
      const messagesToSend = [
        ...(currentConversation?.messages || []),
        userMessage,
      ].map((m) => ({ role: m.role, content: m.content }));

      // 创建占位的助手消息
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };
      addMessage(conversationId, assistantMessage);

      setIsLoading(true);
      setStreamingContent('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messagesToSend,
            model: currentModel,
            provider: currentProvider,
            conversationId,
            encryptedApiKey: apiKey,
          }),
        });

        if (!response.ok) throw new Error('请求失败');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              // 文本内容
              const text = JSON.parse(line.slice(2));
              fullContent += text;
              setStreamingContent(fullContent);
              updateMessage(conversationId, assistantMessageId, fullContent);
            }
          }
        }
      } catch (error) {
        console.error('Send message error:', error);
        updateMessage(conversationId, assistantMessageId, '发生错误，请重试。');
      } finally {
        setIsLoading(false);
        setStreamingContent('');
      }
    },
    [
      apiKeys,
      currentProvider,
      currentModel,
      currentConversationId,
      currentConversation,
      addConversation,
      addMessage,
      updateMessage,
    ]
  );

  const createNewChat = useCallback(() => {
    setCurrentConversation(null);
  }, [setCurrentConversation]);

  return {
    conversation: currentConversation,
    isLoading,
    streamingContent,
    sendMessage,
    createNewChat,
  };
}