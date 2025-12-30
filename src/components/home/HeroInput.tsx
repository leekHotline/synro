'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ChatInputBox from '@/components/ui/ChatInputBox';

export default function HeroInput() {
  const router = useRouter();

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      sessionStorage.setItem('initialPrompt', value.trim());
      router.push('/workspace');
    }
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
    >
      <ChatInputBox
        onSubmit={handleSubmit}
        placeholder="Ask anything..."
        showHint={true}
      />
    </motion.div>
  );
}
