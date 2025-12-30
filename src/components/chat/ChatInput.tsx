// src/components/chat/ChatInput.tsx
'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Image, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import gsap from 'gsap';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ input, setInput, onSend, isLoading, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  // 发送按钮动画
  useEffect(() => {
    if (sendBtnRef.current && input.trim()) {
      gsap.fromTo(sendBtnRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.2, ease: 'back.out(2)' }
      );
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      // 发送动画
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
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
    <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-border/30 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* 输入框容器 - 扩大 */}
        <div 
          ref={containerRef}
          className={cn(
            'relative rounded-2xl border-2 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300',
            input.trim() 
              ? 'border-primary/40 shadow-primary/10 shadow-xl' 
              : 'border-border/50 hover:border-border'
          )}
        >
          <div className="flex items-end p-2 sm:p-3 gap-2 sm:gap-3">
            {/* 左侧工具按钮 - 移动端隐藏部分 */}
            <TooltipProvider>
              <div className="hidden sm:flex items-center gap-1 pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 hover:scale-110 hover:bg-primary/10 transition-all duration-200"
                    >
                      <Paperclip size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>附件</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 hover:scale-110 hover:bg-primary/10 transition-all duration-200"
                    >
                      <Image size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>图片</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* 文本输入 */}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              rows={1}
              className={cn(
                'flex-1 border-0 bg-transparent shadow-none resize-none',
                'focus-visible:ring-0 min-h-[44px] sm:min-h-[60px] max-h-[120px] sm:max-h-[200px] py-2 sm:py-3 text-base',
                'placeholder:text-muted-foreground/60'
              )}
              disabled={isLoading}
            />

            {/* 发送按钮 */}
            <div className="flex items-center pb-1 sm:pb-2">
              {isLoading ? (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={onStop} 
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:scale-105 transition-transform"
                >
                  <Square size={18} />
                </Button>
              ) : (
                <Button 
                  ref={sendBtnRef}
                  size="icon" 
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className={cn(
                    "h-10 w-10 sm:h-11 sm:w-11 rounded-xl transition-all duration-300",
                    input.trim() 
                      ? "bg-primary hover:bg-primary/90 hover:scale-105 shadow-md shadow-primary/30" 
                      : "bg-muted"
                  )}
                >
                  <Send size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          AI 生成内容仅供参考，请注意核实
        </p>
      </div>
    </div>
  );
}
