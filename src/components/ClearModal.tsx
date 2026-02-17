'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

interface Props {
  isOpen: boolean;
  stars: number;
  xp: number;
  coins: number;
  questTitle: string;
  onNext: () => void;
}

const confettiEmoji = ['🎊', '✨', '🌟', '💫', '🎉', '⭐', '🎈', '💎', '🔥'];

function CountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{value}</>;
}

export default function ClearModal({ isOpen, stars, xp, coins, questTitle, onNext }: Props) {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; emoji: string; left: string; delay: string; duration: string; size: string }>
  >([]);

  // Escape key to proceed
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onNext();
  }, [onNext]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setConfetti(
        Array.from({ length: 40 }, (_, i) => ({
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
          role="dialog"
          aria-modal="true"
          aria-label="クエストクリア"
        >
          {confetti.map((c) => (
            <div
              key={c.id}
              className="fixed z-40 pointer-events-none"
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
            className="relative z-50 bg-gradient-to-br from-[#12122a] to-[#1a2a1a] rounded-3xl p-9 text-center max-w-md w-full mx-4"
            style={{ borderWidth: '3px', borderColor: '#22c55e' }}
          >
            {/* Block-kun happy reaction */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 2, duration: 0.6 }}
              className="text-7xl mb-3"
            >
              🧩
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-300 text-sm mb-2"
            >
              ブロッくん「やったね！すごいぞ！」
            </motion.p>
            <h2
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#22c55e',
                textShadow: '0 0 20px rgba(34,197,94,0.5)',
              }}
            >
              QUEST CLEAR!
            </h2>
            <p className="text-slate-400 text-base mb-4">「{questTitle}」をクリア！</p>

            <div
              className="text-4xl mb-4"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }}
            >
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
                <div className="text-lg font-bold text-yellow-400">
                  +<CountUp target={xp} />
                </div>
                <div className="text-sm text-slate-400">XP</div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-[#1e1e3a] rounded-xl px-5 py-3 border-2 border-[#2a2a4a]"
              >
                <div className="text-2xl">💰</div>
                <div className="text-lg font-bold text-yellow-400">
                  +<CountUp target={coins} duration={800} />
                </div>
                <div className="text-sm text-slate-400">コイン</div>
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
