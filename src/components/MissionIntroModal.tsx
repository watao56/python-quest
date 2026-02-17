'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/data/quests';

interface Props {
  quest: Quest;
  isOpen: boolean;
  onStart: () => void;
}

export default function MissionIntroModal({ quest, isOpen, onStart }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label="ミッションイントロ"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="bg-gradient-to-br from-[#1e1e3a] to-[#2a1a4a] border-2 border-purple-500 rounded-3xl p-8 text-center max-w-lg w-full mx-4"
            style={{ boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              {quest.npc.emoji}
            </motion.div>
            <div className="text-base text-purple-400 font-bold mb-2">{quest.npc.name}</div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-200 text-base leading-relaxed mb-5 whitespace-pre-line"
            >
              {quest.npc.dialogue}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0a0a1a] border-2 border-yellow-500 rounded-xl p-4 mb-6"
              style={{ boxShadow: '0 0 12px rgba(245,158,11,0.15)' }}
            >
              <div className="text-sm text-yellow-500 font-bold mb-2">🎯 ミッション</div>
              <div className="font-mono text-lg text-yellow-400">{quest.description}</div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-xl text-lg"
              style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
            >
              🚀 挑戦する！
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
