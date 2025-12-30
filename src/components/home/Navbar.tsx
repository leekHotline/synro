'use client';

import { motion } from 'framer-motion';
import { Globe, Plus, User } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onNewProject?: () => void;
}

export default function Navbar({ onNewProject }: NavbarProps) {
  const navItems = [
    { icon: Globe, label: 'Language', onClick: () => {} },
    { icon: User, label: 'Contact', onClick: () => {} },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <Logo size={28} />

        {/* Right - Actions */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              className="p-2.5 rounded-full hover:bg-black/5 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={item.onClick}
            >
              <item.icon className="w-5 h-5 text-gray-600" />
            </motion.button>
          ))}

          {/* User Avatar */}
          <motion.button
            className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-indigo-400 flex items-center justify-center overflow-hidden ml-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <User className="w-5 h-5 text-white" />
          </motion.button>

          {/* New Project Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <Button
              onClick={onNewProject}
              className="ml-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white rounded-full px-4 h-9"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
