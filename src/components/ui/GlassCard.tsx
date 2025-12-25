// src/components/ui/GlassCard.tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = 'medium',
  hover = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    light: 'bg-white/5 backdrop-blur-sm border-white/5',
    medium: 'bg-white/10 backdrop-blur-md border-white/10',
    heavy: 'bg-white/15 backdrop-blur-lg border-white/15',
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl border',
        variants[variant],
        hover && 'transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}