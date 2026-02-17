'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  level: number;
  title: string;
  onClose: () => void;
}

const confettiEmoji = ['🎊', '✨', '🌟', '💫', '🎉', '⭐', '🎈', '🔥', '🎆'];

export default function LevelUpModal({ isOpen, level, title, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-label="レベルアップ"
          onClick={onClose}
        >
          {/* Confetti */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none text-2xl"
              initial={{ y: -50, x: `${Math.random() * 100}vw`, opacity: 1 }}
              animate={{ y: '110vh', rotate: 720, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
            >
              {confettiEmoji[i % confettiEmoji.length]}
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative z-10 bg-gradient-to-br from-[#1a1040] to-[#2a1a4a] border-3 border-yellow-500 rounded-3xl p-10 text-center max-w-sm w-full mx-4"
            style={{ boxShadow: '0 0 60px rgba(245,158,11,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LEVEL UP!
            </h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-yellow-400"
              style={{ boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}
            >
              {level}
            </motion.div>
            <p className="text-yellow-400 font-bold text-lg mb-1">{title}</p>
            <p className="text-slate-400 text-sm mb-6">レベルが上がった！すごいぞ！</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-8 rounded-xl text-base hover:scale-105 transition-transform"
            >
              やったー！ 🎊
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
