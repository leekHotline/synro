// src/components/chat/ChatContainer.tsx
'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ChatContainer() {
  const { conversation, isLoading, streamingContent, sendMessage, createNewChat } = useChat();

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 头部 */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={createNewChat}>
            <MessageSquarePlus size={18} />
            <span className="hidden sm:inline">新对话</span>
          </Button>
          {conversation && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/80 text-sm truncate max-w-[200px]"
            >
              {conversation.title}
            </motion.h1>
          )}
        </div>
        <ModelSelector />
      </motion.header>

      {/* 消息列表 */}
      {conversation?.messages.length ? (
        <MessageList
          messages={conversation.messages}
          streamingContent={streamingContent}
        />
      ) : (
        <EmptyState />
      )}

      {/* 输入框 */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

// 空状态组件
function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4"
        >
          🚀
        </motion.div>
        <h2 className="text-xl font-semibold text-white/80 mb-2">
          开始新对话
        </h2>
        <p className="text-white/50 text-sm max-w-md">
          支持多种 AI 模型，Markdown 渲染，工具调用
        </p>
      </motion.div>
    </div>
  );
}