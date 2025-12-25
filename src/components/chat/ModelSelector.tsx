// src/components/chat/ModelSelector.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import { cn } from '@/lib/utils/cn';

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentProvider, currentModel, apiKeys, setProvider, setModel } = useChatStore();

  const availableProviders = Object.entries(PROVIDERS).filter(
    ([key]) => apiKeys[key as AIProvider]
  );

  const currentProviderConfig = PROVIDERS[currentProvider];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <Sparkles size={16} className="text-indigo-400" />
        <span className="text-sm">
          {currentProviderConfig?.name} / {currentModel}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 点击外部关闭 */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-20 glass-heavy rounded-xl p-2 min-w-[280px]"
            >
              {availableProviders.length === 0 ? (
                <p className="text-white/50 text-sm p-2">请先配置 API Key</p>
              ) : (
                availableProviders.map(([providerKey, config]) => (
                  <div key={providerKey} className="mb-2 last:mb-0">
                    <p className="text-xs text-white/40 px-2 py-1">{config.name}</p>
                    {config.models.map((model) => (
                      <motion.button
                        key={model}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setProvider(providerKey as AIProvider);
                          setModel(model);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left',
                          'transition-colors hover:bg-white/10',
                          currentProvider === providerKey && currentModel === model
                            ? 'bg-white/10 text-white'
                            : 'text-white/70'
                        )}
                      >
                        <span>{model}</span>
                        {currentProvider === providerKey && currentModel === model && (
                          <Check size={14} className="text-indigo-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}