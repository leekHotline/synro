// src/components/layout/MainLayout.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { ApiKeyManager } from '../settings/ApiKeyManager';
import { ModelSelector } from '../chat/ModelSelector';
import gsap from 'gsap';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);

  // 页面入场动画
  useEffect(() => {
    if (layoutRef.current) {
      const sidebar = layoutRef.current.querySelector('.layout-sidebar');
      const main = layoutRef.current.querySelector('.layout-main');
      const header = layoutRef.current.querySelector('.layout-header');

      gsap.set([sidebar, main, header], { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(sidebar,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6 }
      )
      .fromTo(header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.4'
      )
      .fromTo(main,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.6 },
        '-=0.3'
      );
    }
  }, []);

  return (
    <div ref={layoutRef} className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50/80">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* 侧边栏 */}
      <div className="layout-sidebar relative z-10">
        <Sidebar />
      </div>

      {/* 主内容区 */}
      <main className="layout-main flex-1 flex flex-col overflow-hidden relative z-10">
        {/* 顶部栏 - 模型选择器 + API Keys */}
        <header className="layout-header flex items-center justify-between px-6 py-3 border-b border-border/30 bg-white/40 backdrop-blur-md">
          <ModelSelector />
          <ApiKeyManager />
        </header>

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
