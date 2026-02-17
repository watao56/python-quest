'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Props {
  compact?: boolean;
}

export default function XpBar({ compact = false }: Props) {
  const { getLevel, xp, coins } = useGameStore();
  const { level, title, currentXp, nextXp } = getLevel();
  const percent = nextXp > 0 ? Math.min((currentXp / nextXp) * 100, 100) : 100;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={compact ? 'h-6' : 'h-12 bg-[#12122a] border-b-2 border-[#1e1e3a]'} />;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">🐍</span>
        <span className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          Lv.{level}
        </span>
        <div className="flex-1 max-w-[120px]">
          <div className="h-2 bg-[#1e1e3a] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
              initial={false}
              animate={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-400">{xp}XP</span>
        <span className="text-xs text-yellow-400">💰{coins}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-[#12122a] border-b-2 border-[#1e1e3a]">
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl">🐍</span>
        <span className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
          Lv.{level}
        </span>
      </div>
      <div className="flex-1 max-w-xs">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span className="hidden sm:inline">{title}</span>
          <span>{xp} XP</span>
        </div>
        <div className="h-3 bg-[#1e1e3a] rounded-full border border-[#2a2a4a] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 relative"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>
      <span className="text-sm text-yellow-400 font-bold">💰 {coins}</span>
    </div>
  );
}
