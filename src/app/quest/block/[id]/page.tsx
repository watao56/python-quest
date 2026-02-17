'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { quests } from '@/data/quests';
import { loadSkulpt, executePython } from '@/lib/pythonRunner';
import { useGameStore } from '@/store/gameStore';
import OutputPanel from '@/components/OutputPanel';
import ClearModal from '@/components/ClearModal';
import FailModal from '@/components/FailModal';
import XpBar from '@/components/XpBar';
import Tutorial from '@/components/Tutorial';
import QuestSidebar from '@/components/QuestSidebar';
import MissionIntroModal from '@/components/MissionIntroModal';
import HintPanel from '@/components/HintPanel';
import LevelUpModal from '@/components/LevelUpModal';

const BlocklyEditor = dynamic(() => import('@/components/BlocklyEditor'), { ssr: false });

/** Normalize for answer comparison */
function normalizeOutput(s: string): string {
  return s
    .replace(/\s+$/gm, '')
    .trim()
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, ' ');
}

export default function QuestPage() {
  const params = useParams();
  const router = useRouter();
  const quest = quests.find((q) => q.id === params.id);
  const { getQuestProgress, clearQuest, useHint, addAttempt, getLevel } = useGameStore();

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
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ level: 0, title: '' });
  const prevLevelRef = useRef(getLevel().level);

  useEffect(() => {
    loadSkulpt().then(setSkulptReady);
  }, []);

  // Fix #34: Trigger Blockly resize when sidebar collapses/expands
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350);
    return () => clearTimeout(timer);
  }, [sidebarCollapsed]);

  // Escape key to dismiss mission intro
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMissionIntro) {
        setShowMissionIntro(false);
        setShowTutorial(true);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showMissionIntro]);

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
      const prevLevel = prevLevelRef.current;
      clearQuest(quest.id, stars, quest.rewards.xp, quest.rewards.coins);
      // Check for level up (#28)
      const newLevelInfo = useGameStore.getState().getLevel();
      if (newLevelInfo.level > prevLevel) {
        setLevelUpInfo({ level: newLevelInfo.level, title: newLevelInfo.title });
        setTimeout(() => setShowLevelUp(true), 3500);
      }
      prevLevelRef.current = newLevelInfo.level;
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

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col">
      {/* #25: Header with back button */}
      <div className="flex items-center bg-[#12122a] border-b-2 border-[#1e1e3a] px-3 py-1.5 gap-2">
        <button
          onClick={() => router.push('/')}
          className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1 flex-shrink-0"
          aria-label="マップに戻る"
        >
          ← 戻る
        </button>
        <div className="flex-1 min-w-0">
          <XpBar compact />
        </div>
      </div>

      {/* #22: Mobile tabs */}
      <div className="md:hidden flex bg-[#12122a] border-b-2 border-[#1e1e3a]">
        {(['info', 'editor', 'output'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400'
            }`}
          >
            {tab === 'info' ? '📋 情報' : tab === 'editor' ? '🧩 エディタ' : '📺 出力'}
          </button>
        ))}
      </div>

      {/* Desktop: 3-column / Tablet: collapsible sidebar / Mobile: tab switching */}
      <div className={`flex-1 flex flex-col md:grid ${sidebarCollapsed ? 'md:grid-cols-[48px_1fr] lg:grid-cols-[48px_1fr_1fr]' : 'md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_1fr]'} h-[calc(100vh-80px)] transition-all`}>
        {/* Sidebar */}
        <div className={`bg-gradient-to-b from-[#12122a] to-[#0a0a1a] border-r-2 border-[#1e1e3a] relative ${
          activeTab === 'info' ? 'flex flex-col' : 'hidden'
        } md:flex md:flex-col overflow-y-auto`}>
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
            </div>
          ) : (
            <QuestSidebar quest={quest} hintIndex={hintIndex} />
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
            <div className="flex items-center gap-2">
              {/* #24: Hint button always visible */}
              <button
                onClick={handleHint}
                disabled={hintIndex >= quest.hints.length - 1}
                className="text-sm text-yellow-400 hover:text-yellow-300 disabled:text-slate-600 transition-colors px-2 py-1"
                aria-label="ヒントを表示"
              >
                💡 ヒント
              </button>
              <button
                data-tutorial-run
                onClick={handleRun}
                disabled={!skulptReady || isRunning || !code.trim()}
                aria-label="コードを実行する"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                style={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
              >
                ▶ 実行！
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <BlocklyEditor availableBlocks={quest.availableBlocks} onCodeChange={handleCodeChange} />
          </div>
          {/* #24: Hint panel below editor */}
          {hintIndex >= 0 && (
            <HintPanel quest={quest} hintIndex={hintIndex} onUseHint={handleHint} />
          )}
          <div className={`bg-[#0d0d1a] border-t-2 border-[#1e1e3a] px-4 py-2 relative z-10 code-display-area ${code ? 'code-flash' : ''}`} style={{ minHeight: '80px', maxHeight: '140px', overflowY: 'auto' }}>
            <div className="text-sm font-bold text-purple-400 mb-1">🐍 Pythonコード</div>
            {code ? (
              <pre className="text-sm text-green-400 font-mono select-text cursor-text">{code}</pre>
            ) : (
              <pre className="text-sm text-slate-600 font-mono italic">{'# 🐍 ブロックを組み立てるとPythonコードが表示されるよ！'}</pre>
            )}
          </div>
        </div>

        {/* #22: Output - split view on mobile too */}
        <div className={`${
          activeTab === 'output' ? 'flex flex-col' : 'hidden'
        } lg:flex lg:flex-col`}>
          <OutputPanel output={output} error={error} isRunning={isRunning} hasRun={hasRun} />
        </div>
      </div>

      {/* Modals */}
      <MissionIntroModal
        quest={quest}
        isOpen={showMissionIntro}
        onStart={() => { setShowMissionIntro(false); setShowTutorial(true); }}
      />

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

      {/* #28: Level up modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        level={levelUpInfo.level}
        title={levelUpInfo.title}
        onClose={() => setShowLevelUp(false)}
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
      `}</style>
    </div>
  );
}
