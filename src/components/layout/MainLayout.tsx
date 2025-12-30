// src/components/layout/MainLayout.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Sidebar, MobileMenuButton } from './Sidebar';
import { ApiKeyManager } from '../settings/ApiKeyManager';
import { ModelSelector } from '../chat/ModelSelector';
import gsap from 'gsap';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 页面入场动画
  useEffect(() => {
    const main = mainRef.current;
    const header = headerRef.current;

    if (main && header) {
      gsap.set([main, header], { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(main,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50/80">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主内容区 */}
      <main ref={mainRef} className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* 顶部栏 */}
        <header ref={headerRef} className="flex items-center justify-between gap-2 px-4 lg:px-6 py-3 border-b border-border/30 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
            <ModelSelector />
          </div>
          <ApiKeyManager />
        </header>

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
