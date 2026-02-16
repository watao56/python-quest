'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { quests } from '@/data/quests';
import { loadSkulpt, executePython } from '@/lib/pythonRunner';
import { useGameStore } from '@/store/gameStore';
import OutputPanel from '@/components/OutputPanel';
import ClearModal from '@/components/ClearModal';
import FailModal from '@/components/FailModal';
import XpBar from '@/components/XpBar';
import Tutorial from '@/components/Tutorial';

const BlocklyEditor = dynamic(() => import('@/components/BlocklyEditor'), { ssr: false });

/** Normalize for answer comparison: full-width/half-width, trim whitespace */
function normalizeOutput(s: string): string {
  return s
    .replace(/\s+$/gm, '')
    .trim()
    // full-width alphanumeric → half-width
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    // full-width space → half-width
    .replace(/\u3000/g, ' ');
}

export default function QuestPage() {
  const params = useParams();
  const router = useRouter();
  const quest = quests.find((q) => q.id === params.id);
  const { getQuestProgress, clearQuest, useHint, addAttempt } = useGameStore();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [clearStars, setClearStars] = useState(0);
  const [skulptReady, setSkulptReady] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [showMissionIntro, setShowMissionIntro] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'info' | 'output'>('editor');

  useEffect(() => {
    loadSkulpt().then(setSkulptReady);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  if (!quest) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">
        <p className="text-base">クエストが見つかりません</p>
      </div>
    );
  }

  const progress = getQuestProgress(quest.id);
  const totalQuests = quests.filter((q) => q.worldId === quest.worldId).length;

  const handleRun = async () => {
    if (!skulptReady || isRunning) return;
    setIsRunning(true);
    setHasRun(true);
    setError(null);
    addAttempt(quest.id);

    const result = await executePython(code);
    setOutput(result.output);
    setIsRunning(false);

    if (!result.success) {
      setError(result.error || 'エラーが発生しました');
      setActiveTab('output');
      return;
    }

    if (normalizeOutput(result.output) === normalizeOutput(quest.expectedOutput)) {
      const p = getQuestProgress(quest.id);
      let stars = 1;
      if (p.hintsUsed === 0) stars = 2;
      if (p.hintsUsed === 0 && p.attempts <= 1) stars = 3;
      setClearStars(stars);
      clearQuest(quest.id, stars, quest.rewards.xp, quest.rewards.coins);
      setActiveTab('output');
      setTimeout(() => setShowClear(true), 2500);
    } else {
      setActiveTab('output');
      setShowFail(true);
    }
  };

  const handleHint = () => {
    if (hintIndex < quest.hints.length - 1) {
      setHintIndex((i) => i + 1);
      useHint(quest.id);
    }
    setShowFail(false);
  };

  const nextQuestId = `1-${parseInt(quest.id.split('-')[1]) + 1}`;
  const nextQuest = quests.find((q) => q.id === nextQuestId);

  const sidebarContent = (
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
        className="text-sm text-slate-500 hover:text-slate-300 transition-colors mt-2"
      >
        ← マップに戻る
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col">
      <XpBar />

      {/* Mobile tabs */}
      <div className="md:hidden flex bg-[#12122a] border-b-2 border-[#1e1e3a]">
        {(['info', 'editor', 'output'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-500'
            }`}
          >
            {tab === 'info' ? '📋 情報' : tab === 'editor' ? '🧩 エディタ' : '📺 出力'}
          </button>
        ))}
      </div>

      {/* Desktop: 3-column layout / Tablet: collapsible sidebar / Mobile: tab switching */}
      <div className={`flex-1 flex flex-col md:grid ${sidebarCollapsed ? 'md:grid-cols-[48px_1fr] lg:grid-cols-[48px_1fr_1fr]' : 'md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_1fr]'} h-[calc(100vh-48px)] transition-all`}>
        {/* Sidebar - hidden on mobile unless info tab, collapsible on tablet */}
        <div className={`bg-gradient-to-b from-[#12122a] to-[#0a0a1a] border-r-2 border-[#1e1e3a] relative ${
          activeTab === 'info' ? 'flex flex-col' : 'hidden'
        } md:flex md:flex-col overflow-y-auto`}>
          {/* Toggle button (tablet+) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex absolute top-2 right-[-14px] z-[60] w-7 h-7 bg-[#2a1a4a] border border-purple-500 rounded-full items-center justify-center text-xs text-purple-300 hover:bg-purple-600 transition-colors shadow-lg"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
          {sidebarCollapsed ? (
            <div className="hidden md:flex flex-col items-center gap-3 py-4">
              <span className="text-lg">📋</span>
              <span className="text-lg">🎯</span>
              <span className="text-lg">💡</span>
              <button onClick={() => router.push('/')} className="text-lg mt-auto mb-4">🏠</button>
            </div>
          ) : (
            sidebarContent
          )}
        </div>

        {/* Blockly Editor */}
        <div className={`flex flex-col bg-[#1a1a2e] ${
          activeTab === 'editor' ? 'flex' : 'hidden'
        } md:flex min-h-0`}>
          <div className="bg-[#12122a] px-4 py-2 flex justify-between items-center border-b-2 border-[#1e1e3a]">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              🧩 ブロックエディタ
            </div>
            <button
              data-tutorial-run
              onClick={handleRun}
              disabled={!skulptReady || isRunning || !code.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              style={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
            >
              ▶ 実行！
            </button>
          </div>
          <div className="flex-1 min-h-[400px]">
            <BlocklyEditor availableBlocks={quest.availableBlocks} onCodeChange={handleCodeChange} />
          </div>
          <div className={`bg-[#0d0d1a] border-t-2 border-[#1e1e3a] px-4 py-2 relative z-10 code-display-area ${code ? 'code-flash' : ''}`} style={{ minHeight: '80px', maxHeight: '140px', overflowY: 'auto' }}>
            <div className="text-sm font-bold text-purple-400 mb-1">🐍 Pythonコード</div>
            {code ? (
              <pre className="text-sm text-green-400 font-mono select-text cursor-text">{code}</pre>
            ) : (
              <pre className="text-sm text-slate-600 font-mono italic">{'# 🐍 ブロックを組み立てるとPythonコードが表示されるよ！'}</pre>
            )}
          </div>
        </div>

        {/* Output - visible as third column on lg, tab on mobile */}
        <div className={`${
          activeTab === 'output' ? 'flex flex-col' : 'hidden'
        } lg:flex lg:flex-col`}>
          <OutputPanel output={output} error={error} isRunning={isRunning} hasRun={hasRun} />
        </div>
      </div>

      {/* Mission intro modal */}
      <AnimatePresence>
        {showMissionIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
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
                onClick={() => { setShowMissionIntro(false); setShowTutorial(true); }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-xl text-lg"
                style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
              >
                🚀 挑戦する！
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTutorial && (
        <Tutorial questId={quest.id} onComplete={() => setShowTutorial(false)} />
      )}

      <ClearModal
        isOpen={showClear}
        stars={clearStars}
        xp={quest.rewards.xp}
        coins={quest.rewards.coins}
        questTitle={quest.title}
        onNext={() => {
          setShowClear(false);
          if (nextQuest) {
            router.push(`/quest/block/${nextQuestId}`);
          } else {
            router.push('/');
          }
        }}
      />

      <FailModal
        isOpen={showFail}
        expected={quest.expectedOutput}
        actual={output}
        attempts={getQuestProgress(quest.id).attempts}
        onRetry={() => setShowFail(false)}
        onHint={handleHint}
      />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
