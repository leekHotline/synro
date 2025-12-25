// src/components/chat/MessageList.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils/cn';

interface MessagePart {
  type: string;
  text?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: MessagePart[];
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          
          // ✅ AI SDK 6.0 使用 parts 数组
          const content = message.parts
            ?.filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('') || message.content || '';

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.02,
                ease: [0.23, 1, 0.32, 1],
              }}
              className={cn(
                'flex gap-3 max-w-4xl',
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              {/* 头像 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 + 0.1, type: 'spring' }}
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                )}
              >
                {isUser ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </motion.div>

              {/* 消息内容 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={cn(
                  'rounded-2xl px-4 py-3 max-w-[80%]',
                  isUser
                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white'
                    : 'bg-white/10 backdrop-blur-md border border-white/10 text-white/90'
                )}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => (
                        <pre className="bg-black/30 rounded-lg p-3 overflow-x-auto my-2">
                          {children}
                        </pre>
                      ),
                      code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-300" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className={className} {...props}>{children}</code>
                        );
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>

                {/* 显示工具调用结果 */}
                {message.parts?.filter((p) => p.type.startsWith('tool-')).map((part, i) => (
                  <div key={i} className="mt-2 p-2 bg-white/5 rounded-lg text-xs">
                    <span className="text-amber-400">🔧 Tool: {part.type.replace('tool-', '')}</span>
                    <pre className="mt-1 text-white/50 overflow-x-auto">
                      {JSON.stringify(part, null, 2)}
                    </pre>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}