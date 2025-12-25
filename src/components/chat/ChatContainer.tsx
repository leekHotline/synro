// src/components/chat/ChatContainer.tsx
'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { motion } from 'framer-motion';
import { MessageSquarePlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ChatContainer() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    stop,
  } = useChat();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

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
        </div>
        <ModelSelector />
      </motion.header>

      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-300"
        >
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* 消息列表 */}
      {messages.length > 0 ? (
        <MessageList messages={messages} />
      ) : (
        <EmptyState />
      )}

      {/* 输入框 */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}

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