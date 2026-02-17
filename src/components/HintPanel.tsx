'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/data/quests';

interface Props {
  quest: Quest;
  hintIndex: number;
  onUseHint: () => void;
}

export default function HintPanel({ quest, hintIndex, onUseHint }: Props) {
  const hasMoreHints = hintIndex < quest.hints.length - 1;

  return (
    <div className="flex flex-col gap-2 p-3 bg-[#12122a] border-t border-[#1e1e3a]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-yellow-500">💡 ヒント</span>
        {hasMoreHints && (
          <button
            onClick={onUseHint}
            className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
          >
            ヒントを見る ({hintIndex + 2}/{quest.hints.length})
          </button>
        )}
      </div>
      <AnimatePresence mode="popLayout">
        {hintIndex >= 0 ? (
          Array.from({ length: hintIndex + 1 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-2.5"
            >
              <span className="text-xs text-yellow-500 font-bold">ヒント {i + 1}:</span>
              <p className="text-sm text-yellow-200 mt-0.5">{quest.hints[i]}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">ヒントボタンを押すとヒントが表示されるよ</p>
        )}
      </AnimatePresence>
    </div>
  );
}
