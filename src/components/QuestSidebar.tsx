'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Quest } from '@/data/quests';
import { quests } from '@/data/quests';

interface Props {
  quest: Quest;
  hintIndex: number;
}

export default function QuestSidebar({ quest, hintIndex }: Props) {
  const router = useRouter();
  const totalQuests = quests.filter((q) => q.worldId === quest.worldId).length;

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <motion.div
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-[#1e1e3a] to-[#2a1a4a] rounded-xl p-4 border border-[#333366]"
      >
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
          🌱 W1 クエスト {quest.order}/{totalQuests}
        </span>
        <h2 className="text-lg font-bold">{quest.title}</h2>
      </motion.div>

      <div className="flex items-start gap-3 bg-[#1e1e3a] rounded-lg p-3 border border-[#2a2a4a]">
        <div className="text-3xl flex-shrink-0" style={{ animation: 'float 4s ease-in-out infinite' }}>
          {quest.npc.emoji}
        </div>
        <div>
          <div className="text-sm text-purple-500 font-bold mb-1">{quest.npc.name}</div>
          <div className="text-sm text-purple-200 leading-relaxed whitespace-pre-line">
            {quest.npc.dialogue}
          </div>
        </div>
      </div>

      <div
        className="bg-[#0a0a1a] border-2 border-yellow-500 rounded-lg p-3"
        style={{ boxShadow: '0 0 12px rgba(245,158,11,0.08)' }}
      >
        <div className="text-sm text-yellow-500 font-bold mb-2">🎯 ミッション</div>
        <div className="font-mono text-base text-yellow-400 bg-[#1e1e2a] rounded-md p-2 border-l-[3px] border-yellow-500">
          {quest.description}
        </div>
      </div>

      {hintIndex >= 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3"
        >
          <div className="text-sm text-yellow-500 font-bold mb-1">💡 ヒント {hintIndex + 1}</div>
          <p className="text-sm text-yellow-200">{quest.hints[hintIndex]}</p>
        </motion.div>
      )}

      <div className="flex gap-2 justify-center mt-auto">
        <div className="bg-[#1e1e3a] rounded-lg px-4 py-2 text-center border border-[#2a2a4a]">
          <div className="text-lg">✨</div>
          <div className="text-sm text-yellow-400 font-bold">+{quest.rewards.xp} XP</div>
        </div>
        <div className="bg-[#1e1e3a] rounded-lg px-4 py-2 text-center border border-[#2a2a4a]">
          <div className="text-lg">💰</div>
          <div className="text-sm text-yellow-400 font-bold">+{quest.rewards.coins}</div>
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="text-sm text-slate-400 hover:text-slate-200 transition-colors mt-2"
      >
        ← マップに戻る
      </button>
    </div>
  );
}
