// src/components/layout/MainLayout.tsx
'use client';

import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { ApiKeyManager } from '../settings/ApiKeyManager';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-[100px]"
        />
      </div>

      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-end p-2 border-b border-white/5"
        >
          <ApiKeyManager />
        </motion.div>

        {/* 内容 */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}