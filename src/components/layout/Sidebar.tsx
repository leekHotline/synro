// src/components/layout/Sidebar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2, X, Search, Plus, Sparkles, Menu } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import gsap from 'gsap';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation
  } = useChatStore();

  // 对话列表入场动画
  useEffect(() => {
    if (listRef.current && conversations.length > 0) {
      const items = listRef.current.querySelectorAll('.conv-item');
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
  }, [conversations.length]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    onClose(); // 移动端选择后关闭侧边栏
  };

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          'h-full flex flex-col z-50',
          'bg-white/80 backdrop-blur-xl border-r border-white/30',
          'shadow-xl shadow-black/5',
          'w-[280px] lg:w-[260px]',
          // 移动端：固定定位 + 滑入滑出
          'fixed lg:relative',
          'transition-transform duration-300 ease-out',
          // 移动端根据 isOpen 控制，桌面端始终显示
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">AI Chat</span>
          </div>
          {/* 移动端关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 lg:hidden"
          >
            <X size={18} />
          </Button>
        </div>

        {/* 新建 & 搜索 */}
        <div className="px-3 pb-3 space-y-2">
          <Button className="w-full justify-start gap-2 hover:scale-[1.02] transition-transform shadow-md">
            <Plus size={16} />
            新建对话
          </Button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索对话"
              className="pl-9 h-9 bg-white/50 border-white/30 focus:bg-white/80 transition-colors"
            />
          </div>
        </div>

        {/* 分类标题 */}
        {conversations.length > 0 && (
          <div className="px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              所有对话
            </span>
          </div>
        )}

        {/* 对话列表 */}
        <ScrollArea className="flex-1 px-2">
          <div ref={listRef} className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  'conv-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer',
                  'transition-all duration-200 group',
                  'active:scale-95',
                  currentConversationId === conv.id
                    ? 'bg-primary/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/60'
                )}
              >
                <MessageSquare size={16} className={cn(
                  'flex-shrink-0 transition-colors',
                  currentConversationId === conv.id ? 'text-primary' : ''
                )} />
                <span className="flex-1 truncate text-sm">{conv.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                >
                  <Trash2 size={12} className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={24} className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">暂无对话</p>
            </div>
          )}
        </ScrollArea>
      </aside>
    </>
  );
}

// 移动端菜单按钮
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden h-9 w-9"
    >
      <Menu size={20} />
    </Button>
  );
}
