'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Paperclip, Globe, Square } from 'lucide-react';

interface ChatInputBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  showHint?: boolean;
  autoFocus?: boolean;
}

export default function ChatInputBox({
  value: controlledValue,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  placeholder = 'Ask anything...',
  showHint = true,
  autoFocus = false,
}: ChatInputBoxProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (v: string) => {
    if (onChange) {
      onChange(v);
    } else {
      setInternalValue(v);
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit?.(value.trim());
      if (!controlledValue) {
        setInternalValue('');
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 自动调整高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl bg-gray-100/80 transition-all duration-200">
        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="
            w-full bg-transparent resize-none
            text-gray-800 placeholder:text-gray-400
            text-base leading-relaxed
            px-5 pt-4 pb-14
            min-h-[60px] max-h-[160px]
            focus:outline-none focus:ring-0
            disabled:opacity-50
          "
          style={{ outline: 'none' }}
        />

        {/* Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Left Icons */}
          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="上传文件"
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="网络搜索"
            >
              <Globe className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Submit/Stop Button */}
          {isLoading ? (
            <motion.button
              onClick={onStop}
              className="w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className={`
                w-9 h-9 rounded-lg
                flex items-center justify-center
                transition-all duration-200
                ${value.trim()
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              whileHover={value.trim() ? { scale: 1.05 } : {}}
              whileTap={value.trim() ? { scale: 0.95 } : {}}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <p className="text-center text-xs text-gray-400 mt-3">
          
        </p>
      )}
    </div>
  );
}
