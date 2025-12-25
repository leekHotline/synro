// src/components/chat/ChatInput.tsx
'use client';

import { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ input, setInput, onSend, isLoading, onStop }: ChatInputProps) {
  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        <div className="bg-white/15 backdrop-blur-lg border border-white/15 rounded-2xl p-2 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
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

          {isLoading ? (
            <Button onClick={onStop} size="sm" variant="secondary" className="rounded-xl">
              <StopCircle size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              size="sm"
              className="rounded-xl"
            >
              <Send size={18} />
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-2">
          AI 可能会产生不准确的信息，请注意核实
        </p>
      </div>
    </motion.div>
  );
}