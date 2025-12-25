// src/components/chat/ChatInput.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="p-4 border-t border-white/10"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass-heavy rounded-2xl p-2 flex items-end gap-2">
          {/* 附件按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Paperclip size={20} />
          </motion.button>

          {/* 输入框 */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift + Enter 换行)"
            rows={1}
            className={cn(
              'flex-1 bg-transparent text-white placeholder-white/40',
              'resize-none outline-none py-2 px-2',
              'max-h-[200px]'
            )}
            disabled={isLoading}
          />

          {/* 语音按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Mic size={20} />
          </motion.button>

          {/* 发送/停止按钮 */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            size="sm"
            className="rounded-xl"
          >
            {isLoading ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <StopCircle size={18} />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Send size={18} />
              </motion.div>
            )}
          </Button>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-white/30 mt-2">
          AI 可能会产生不准确的信息，请注意核实
        </p>
      </div>
    </motion.div>
  );
}