// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Settings 
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation,
    deleteConversation 
  } = useChatStore();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? 60 : 280 
      }}
      transition={{ duration: 0.3 }}
      className="h-full glass border-r border-white/10 flex flex-col"
    >
      {/* 头部 */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              AI Chat
            </motion.h1>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence>
          {conversations.map((conv, index) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setCurrentConversation(conv.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors group',
                  currentConversationId === conv.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <MessageSquare size={18} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate text-sm">{conv.title}</span>
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {conversations.length === 0 && !isCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/30 text-sm py-8"
          >
            暂无对话记录
          </motion.p>
        )}
      </div>

      {/* 底部设置 */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-white/10"
        >
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full flex items-center gap-3 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
          >
            <Settings size={18} />
            <span className="text-sm">设置</span>
          </motion.button>
        </motion.div>
      )}
    </motion.aside>
  );
}