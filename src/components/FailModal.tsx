'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  expected: string;
  actual: string;
  attempts: number;
  onRetry: () => void;
  onHint: () => void;
}

function getStagedMessage(attempts: number): string {
  if (attempts <= 1) return 'もうちょっと！あきらめないで！';
  if (attempts <= 3) return '惜しい！出力をよく見比べてみよう。';
  if (attempts <= 5) return 'ヒントを使ってみるのもいいかも？';
  return 'あきらめないで！ヒントを見てゆっくり考えてみよう。';
}

function renderDiff(expected: string, actual: string) {
  const expLines = expected.split('\n');
  const actLines = (actual || '').split('\n');
  const maxLen = Math.max(expLines.length, actLines.length);
  const lines = [];
  for (let i = 0; i < maxLen; i++) {
    const exp = expLines[i] ?? '';
    const act = actLines[i] ?? '';
    const match = exp === act;
    lines.push(
      <div key={i} className={`flex gap-2 py-0.5 ${match ? 'opacity-60' : ''}`}>
        <span className="text-green-400 min-w-0 flex-1">✓ {exp || '(なし)'}</span>
        <span className={`min-w-0 flex-1 ${match ? 'text-green-400' : 'text-red-400'}`}>
          {match ? '✓' : '✗'} {act || '(なし)'}
        </span>
      </div>
    );
  }
  return lines;
}

export default function FailModal({ isOpen, expected, actual, attempts, onRetry, onHint }: Props) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onRetry();
  }, [onRetry]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

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
          aria-label="ミッション失敗"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#12122a] to-[#2a1a1a] rounded-3xl p-8 text-center max-w-md w-full mx-4"
            style={{ borderWidth: '3px', borderColor: '#ef4444' }}
          >
            <motion.div
              animate={{ x: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-3"
            >
              😵
            </motion.div>
            <h2
              className="text-xl font-bold mb-1"
              style={{ fontFamily: "'Press Start 2P', monospace", color: '#ef4444', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}
            >
              MISSION FAILED...
            </h2>
            <p className="text-slate-400 text-sm mb-4">{getStagedMessage(attempts)}</p>

            <div className="bg-[#0a0a1a] rounded-lg p-4 mb-4 text-left font-mono text-sm border border-[#2a2a4a]">
              <div className="flex gap-2 text-sm font-bold mb-2 border-b border-[#2a2a4a] pb-1">
                <span className="flex-1 text-green-400">期待される出力</span>
                <span className="flex-1 text-red-400">実際の出力</span>
              </div>
              {renderDiff(expected, actual)}
              {!actual && (
                <div className="text-red-300 text-sm mt-2 italic">（何も出力されなかったよ）</div>
              )}
            </div>

            <div className="flex items-start gap-3 bg-[#1e1e3a] rounded-lg p-3 mb-5 text-left">
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl"
              >
                🧩
              </motion.span>
              <div>
                <strong className="text-purple-400 text-sm">ブロッくん：</strong>
                <p className="text-purple-200 text-sm mt-1 leading-relaxed">
                  {attempts <= 2
                    ? '惜しいなぁ！出力をよく見比べてみよう。\n文字が合っているか確認してみてね！'
                    : 'ヒントを使ってみよう！\nきっとわかるようになるよ！'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onRetry}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform text-base"
              >
                ⚔ もう一度！
              </button>
              <button
                onClick={onHint}
                className="bg-[#1e1e3a] border-2 border-yellow-500 text-yellow-500 py-2 px-5 rounded-xl text-base hover:scale-105 transition-transform"
              >
                💡 ヒント
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
