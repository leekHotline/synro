// src/components/chat/MessageList.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Bot, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

// 代码块组件 - 毛玻璃效果 + 行号
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || 'text';
  const lines = children?.trim().split('\n') || [];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-4 rounded-xl overflow-hidden">
      {/* 头部 - 语言标签和复制按钮 */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80 backdrop-blur-sm border-b border-border/50">
        <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1.5 opacity-0 group-hover/code:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </Button>
      </div>
      
      {/* 代码区域 - 毛玻璃效果 */}
      <div className="bg-muted/50 backdrop-blur-md overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-muted/50">
                {/* 行号 */}
                <td className="px-4 py-0.5 text-right text-muted-foreground/50 select-none w-12 border-r border-border/30">
                  {i + 1}
                </td>
                {/* 代码内容 */}
                <td className="px-4 py-0.5 whitespace-pre text-foreground/90">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  
  const content = message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('') || message.content || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ animationDelay: `${index * 0.05}s` }}
      className={cn('flex gap-4 animate-fade-in', isUser ? 'flex-row-reverse' : '')}
    >
      {/* 头像 */}
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser ? 'bg-primary text-primary-foreground' : 'bg-emerald-500 text-white'
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </AvatarFallback>
      </Avatar>

      {/* 消息内容 */}
      <div className={cn('flex-1 group min-w-0', isUser ? 'flex justify-end' : '')}>
        <div
          className={cn(
            'rounded-2xl px-5 py-4',
            isUser
              ? 'bg-primary text-primary-foreground max-w-[80%]'
              : 'text-foreground w-full'
          )}
        >
          <div className={cn(
            'prose prose-base max-w-none',
            'prose-headings:font-semibold prose-headings:text-foreground',
            'prose-p:leading-7 prose-p:my-2',
            'prose-ul:my-3 prose-ol:my-3 prose-li:my-1',
            'prose-hr:my-6',
            isUser ? 'prose-invert' : 'prose-neutral dark:prose-invert'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 代码块 - 使用自定义组件
                pre: ({ children }) => <>{children}</>,
                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes('language-');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  if (isBlock) {
                    return <CodeBlock className={className}>{codeString}</CodeBlock>;
                  }
                  
                  // 行内代码
                  return (
                    <code 
                      className={cn(
                        'px-1.5 py-0.5 rounded-md text-sm font-mono',
                        isUser 
                          ? 'bg-primary-foreground/20 text-primary-foreground' 
                          : 'bg-primary/10 text-primary'
                      )} 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // 段落
                p: ({ children }) => (
                  <p className="leading-7 [&:not(:first-child)]:mt-3">{children}</p>
                ),
                // 标题
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-border">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-5 mb-2">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold mt-4 mb-2">{children}</h4>
                ),
                // 列表
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 space-y-1.5 my-3">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 space-y-1.5 my-3">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-7 pl-1">{children}</li>
                ),
                // 引用
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/40 bg-muted/30 backdrop-blur-sm pl-4 pr-4 py-3 my-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                // 表格
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 rounded-xl bg-muted/30 backdrop-blur-sm">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50 border-b border-border/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left font-semibold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 border-b border-border/30">{children}</td>
                ),
                // 链接
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                // 水平线
                hr: () => <hr className="my-6 border-border/50" />,
                // 强调
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                // 任务列表
                input: ({ checked, ...props }) => (
                  <input 
                    type="checkbox" 
                    checked={checked} 
                    readOnly 
                    className="mr-2 rounded accent-primary"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* AI 消息操作栏 */}
        {!isUser && (
          <TooltipProvider>
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>复制</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsUp size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>有帮助</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsDown size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>没帮助</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RotateCcw size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>重新生成</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
