// src/components/chat/MessageBubble.tsx
'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from '@/types';
import { User, Bot, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05, // 交错动画
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
        transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
            : isTool
            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
            : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
        )}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : isTool ? (
          <Wrench size={16} className="text-white" />
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
            : 'glass text-white/90'
        )}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // 自定义代码块渲染
              pre: ({ children }) => (
                <pre className="bg-black/30 rounded-lg p-3 overflow-x-auto my-2">
                  {children}
                </pre>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code
                    className="bg-white/10 px-1.5 py-0.5 rounded text-pink-300"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // 链接
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* 工具调用显示 */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10">
            {message.toolCalls.map((tool) => (
              <div
                key={tool.id}
                className="text-xs bg-white/5 rounded-lg p-2 mt-1"
              >
                <span className="text-amber-400">🔧 {tool.name}</span>
                <pre className="mt-1 text-white/50 overflow-x-auto">
                  {JSON.stringify(tool.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}