// src/stores/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, Conversation, AIProvider } from '@/types';

interface ChatState {
  // 对话
  conversations: Conversation[];
  currentConversationId: string | null;

  // 设置
  currentProvider: AIProvider;
  currentModel: string;
  apiKeys: Record<AIProvider, string>; // 加密后的 keys

  // 操作
  setCurrentConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setApiKey: (provider: AIProvider, encryptedKey: string) => void;
  removeApiKey: (provider: AIProvider) => void;
  deleteConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      currentProvider: 'openai',
      currentModel: 'gpt-4o',
      apiKeys: {} as Record<AIProvider, string>,

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id,
        })),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() }
              : conv
          ),
        })),

      updateMessage: (conversationId, messageId, content) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                }
              : conv
          ),
        })),

      setProvider: (provider) => set({ currentProvider: provider }),
      setModel: (model) => set({ currentModel: model }),

      setApiKey: (provider, encryptedKey) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: encryptedKey },
        })),

      removeApiKey: (provider) =>
        set((state) => {
          const newKeys = { ...state.apiKeys };
          delete newKeys[provider];
          return { apiKeys: newKeys };
        }),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        currentProvider: state.currentProvider,
        currentModel: state.currentModel,
      }),
    }
  )
);