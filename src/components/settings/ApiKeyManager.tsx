// src/components/settings/ApiKeyManager.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Trash2, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { GlassCard } from '@/components/ui/GlassCard';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import CryptoJS from 'crypto-js';

// 客户端加密（实际生产环境应在服务端加密）
const encryptKey = (key: string) => {
  return CryptoJS.AES.encrypt(key, 'client-secret').toString();
};

const decryptKey = (encrypted: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'client-secret');
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

export function ApiKeyManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const { apiKeys, setApiKey, removeApiKey } = useChatStore();

  const handleSave = () => {
    if (editingProvider && inputKey.trim()) {
      const encrypted = encryptKey(inputKey.trim());
      setApiKey(editingProvider, encrypted);
      setEditingProvider(null);
      setInputKey('');
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const getMaskedKey = (encrypted: string, provider: string) => {
    if (showKey[provider]) {
      const decrypted = decryptKey(encrypted);
      return decrypted || '解密失败';
    }
    return '••••••••••••••••••••';
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        ⚙️ API Keys
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="API Key 管理">
        <div className="space-y-4">
          {Object.entries(PROVIDERS).map(([providerKey, config], index) => {
            const hasKey = !!apiKeys[providerKey as AIProvider];

            return (
              <motion.div
                key={providerKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="light" className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{config.name}</span>
                      {hasKey && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-green-400"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasKey ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleShowKey(providerKey)}
                            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
                          >
                            {showKey[providerKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeApiKey(providerKey as AIProvider)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingProvider(providerKey as AIProvider)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Plus size={16} />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {hasKey ? (
                    <p className="text-sm text-white/50 font-mono">
                      {getMaskedKey(apiKeys[providerKey as AIProvider], providerKey)}
                    </p>
                  ) : editingProvider === providerKey ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex gap-2"
                    >
                      <input
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder={`输入 ${config.name} API Key`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Check size={16} />
                      </Button>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-white/30">未配置</p>
                  )}

                  {/* 支持的模型 */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {config.models.slice(0, 3).map((model) => (
                      <span
                        key={model}
                        className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded"
                      >
                        {model}
                      </span>
                    ))}
                    {config.models.length > 3 && (
                      <span className="text-xs text-white/30">
                        +{config.models.length - 3}
                      </span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}

          <p className="text-xs text-white/30 text-center mt-4">
            API Key 加密存储在本地，不会上传到服务器
          </p>
        </div>
      </Modal>
    </>
  );
}