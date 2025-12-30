// src/app/page.tsx
'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ChatContainer } from '@/components/chat/ChatContainer';

export default function Home() {
  return (
    <MainLayout>
      <ChatContainer />
    </MainLayout>
  );
}

