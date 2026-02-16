'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  stars: number;
  xp: number;
  coins: number;
  questTitle: string;
  onNext: () => void;
}

const confettiEmoji = ['🎊', '✨', '🌟', '💫', '🎉', '⭐', '🎈', '💎', '🔥'];

export default function ClearModal({ isOpen, stars, xp, coins, questTitle, onNext }: Props) {
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; left: string; delay: string; duration: string; size: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      setConfetti(
        Array.from({ length: 30 }, (_, i) => ({
          id: i,
          emoji: confettiEmoji[Math.floor(Math.random() * confettiEmoji.length)],
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          duration: `${2 + Math.random() * 2}s`,
          size: `${16 + Math.random() * 20}px`,
        }))
      );
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          {confetti.map((c) => (
            <div
              key={c.id}
              className="fixed z-40"
              style={{
                left: c.left,
                top: '-20px',
                fontSize: c.size,
                animation: `confettiFall ${c.duration} ${c.delay} linear infinite`,
              }}
            >
              {c.emoji}
            </div>
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative z-50 bg-gradient-to-br from-[#12122a] to-[#1a2a1a] border-3 border-green-500 rounded-3xl p-9 text-center max-w-md w-full mx-4"
            style={{ borderWidth: '3px', borderColor: '#22c55e' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-7xl mb-3"
            >
              🐍
            </motion.div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Press Start 2P', monospace", color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,0.5)' }}
            >
              QUEST CLEAR!
            </h2>
            <p className="text-slate-400 text-sm mb-4">「{questTitle}」をクリア！</p>

            <div className="text-4xl mb-4" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }}>
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.2 }}
                >
                  {i < stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            <div className="flex gap-3 justify-center mb-5">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1e1e3a] rounded-xl px-5 py-3 border-2 border-[#2a2a4a]"
              >
                <div className="text-2xl">✨</div>
                <div className="text-lg font-bold text-yellow-400">+{xp}</div>
                <div className="text-xs text-slate-400">XP</div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-[#1e1e3a] rounded-xl px-5 py-3 border-2 border-[#2a2a4a]"
              >
                <div className="text-2xl">💰</div>
                <div className="text-lg font-bold text-yellow-400">+{coins}</div>
                <div className="text-xs text-slate-400">コイン</div>
              </motion.div>
            </div>

            <button
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3 px-8 rounded-xl text-lg hover:scale-105 transition-transform"
              style={{ boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}
            >
              次のクエストへ →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
