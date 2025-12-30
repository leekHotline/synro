'use client';

import ChatInputBox from '@/components/ui/ChatInputBox';

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-border/30 bg-gradient-to-t from-white/50 to-transparent">
      <div className="max-w-4xl mx-auto">
        <ChatInputBox
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onStop={onStop}
          isLoading={isLoading}
          placeholder="输入消息..."
          showHint={false}
        />
        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          AI 生成内容仅供参考，请注意核实
        </p>
      </div>
    </div>
  );
}
