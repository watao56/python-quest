'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { quests } from '@/data/quests';

export default function WorldMap() {
  const router = useRouter();
  const { getLevel, getQuestProgress, xp } = useGameStore();
  const { level, title } = getLevel();

  // SSR hydration fix (Issue #7)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleQuestClick = (questId: string) => {
    const progress = getQuestProgress(questId);
    if (progress.status === 'locked') return;
    router.push(`/quest/block/${questId}`);
  };

  const nextAvailable = quests.find((q) => {
    const p = getQuestProgress(q.id);
    return p.status === 'available';
  });

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a1a]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col">
      {/* Hero */}
      <div
        className="flex flex-col items-center px-4 sm:px-5 py-8 sm:py-12 relative"
        style={{ background: 'radial-gradient(ellipse at center, #1a1040 0%, #0a0a1a 70%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237c3aed' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          initial={false}
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative mb-4 z-10"
        >
          <span className="text-5xl sm:text-7xl" style={{ filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.5))' }}>
            🐍
          </span>
          <span className="absolute -bottom-1 -right-3 bg-gradient-to-br from-yellow-500 to-red-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center border-2 border-yellow-400">
            {level}
          </span>
        </motion.div>

        <h1
          className="text-xl sm:text-3xl mb-1 z-10"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            background: 'linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Python Quest
        </h1>
        <p className="text-slate-400 text-base mb-3 z-10">コードを書いて、世界を冒険しよう！</p>

        <div className="w-60 sm:w-72 z-10 mb-5">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Lv.{level} {title}</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-4 bg-[#1e1e3a] rounded-full border-2 border-[#2a2a4a] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
              initial={false}
              animate={{ width: `${Math.min((xp / 100) * 100, 100)}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>

        {nextAvailable && (
          <motion.button
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => handleQuestClick(nextAvailable.id)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 sm:px-10 rounded-2xl text-base sm:text-lg z-10"
            style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
          >
            ⚔ 冒険をつづける
          </motion.button>
        )}
      </div>

      {/* World Selection */}
      <div className="px-4 sm:px-5 pb-20 max-w-3xl mx-auto w-full">
        <h2
          className="text-center text-purple-400 mb-6 text-sm"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          🌍 ワールド選択
        </h2>

        {/* World 1 */}
        <motion.div initial={false} animate={{ x: 0, opacity: 1 }} className="mb-6">
          <div
            className="flex items-center gap-3 sm:gap-4 bg-[#12122a] border-2 border-purple-500 rounded-2xl p-4 sm:p-5 mb-3"
            style={{ boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
          >
            <span className="text-3xl sm:text-4xl">🌱</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg">スクラッチの森</h3>
              <p className="text-sm text-slate-500">ブロックを組み合わせてプログラミングの基本を学ぼう</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-slate-400">
                {quests.filter((q) => getQuestProgress(q.id).status === 'cleared').length} / {quests.length}
              </div>
              <div className="w-20 sm:w-28 h-2 bg-[#1e1e3a] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(quests.filter((q) => getQuestProgress(q.id).status === 'cleared').length / quests.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quest Nodes */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pl-4 sm:pl-14">
            {quests.map((q, i) => {
              const p = getQuestProgress(q.id);
              const isCleared = p.status === 'cleared';
              const isAvailable = p.status === 'available';
              const isLocked = p.status === 'locked';

              return (
                <motion.button
                  key={q.id}
                  initial={false}
                  animate={{ scale: 1 }}
                  onClick={() => handleQuestClick(q.id)}
                  disabled={isLocked}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm relative transition-transform hover:scale-110 mx-auto ${
                    isCleared
                      ? 'bg-[#0a2a0a] border-2 border-green-500 text-green-500'
                      : isAvailable
                        ? 'bg-[#2a1a4a] border-2 border-purple-400 text-purple-400 animate-pulse'
                        : 'bg-[#1a1a2a] border-2 border-[#333] text-[#333] cursor-not-allowed'
                  }`}
                >
                  {isLocked ? '🔒' : q.order}
                  {isCleared && p.stars > 0 && (
                    <span className="absolute -top-2 text-[8px] whitespace-nowrap">
                      {'⭐'.repeat(p.stars)}
                      {'☆'.repeat(3 - p.stars)}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Locked worlds */}
        {[
          { emoji: '🔀', name: '変換の洞窟', desc: 'ブロックがPythonコードになる仕組みを覚えよう', unlock: 'Lv.4' },
          { emoji: '🐍', name: 'Pythonの大地', desc: '自分の手でPythonコードを書いてみよう', unlock: 'Lv.6' },
          { emoji: '🎨', name: 'turtleの草原', desc: 'コードで絵を描こう！', unlock: 'Lv.8' },
        ].map((world, i) => (
          <motion.div
            key={world.name}
            initial={false}
            animate={{ x: 0, opacity: 0.35 }}
            className="flex items-center gap-3 sm:gap-4 bg-[#12122a] border-2 border-[#1e1e3a] rounded-2xl p-4 sm:p-5 mb-3 cursor-not-allowed"
          >
            <span className="text-3xl sm:text-4xl">{world.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg">{world.name}</h3>
              <p className="text-sm text-slate-500">{world.desc}</p>
            </div>
            <div className="text-sm text-slate-500 flex-shrink-0">🔒 {world.unlock}で解放</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
