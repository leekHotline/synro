'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* SVG Logo */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Image 
          src="/icon.svg" 
          alt="Synro" 
          width={size} 
          height={size}
        />
      </motion.div>
      
      {/* Text */}
      <motion.span 
        className="text-xl font-semibold tracking-tight"
        style={{ 
          background: 'linear-gradient(135deg, #00DCFF 0%, #AA82FF 50%, #8CA0FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Synro
      </motion.span>
    </motion.div>
  );
}
