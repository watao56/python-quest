'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  expected: string;
  actual: string;
  onRetry: () => void;
  onHint: () => void;
}

export default function FailModal({ isOpen, expected, actual, onRetry, onHint }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
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
            <p className="text-slate-400 text-sm mb-4">もうちょっと！あきらめないで！</p>

            <div className="bg-[#0a0a1a] rounded-lg p-4 mb-4 text-left font-mono text-sm border border-[#2a2a4a]">
              <div className="text-green-400">✓ 期待: {expected}</div>
              <div className="text-red-400">✗ 実際: {actual || '（何も出力されなかったよ）'}</div>
            </div>

            <div className="flex items-start gap-3 bg-[#1e1e3a] rounded-lg p-3 mb-5 text-left">
              <span className="text-2xl">🧩</span>
              <div>
                <strong className="text-purple-400 text-xs">ブロッくん：</strong>
                <p className="text-purple-200 text-xs mt-1 leading-relaxed">
                  惜しいなぁ！出力をよく見比べてみよう。<br />
                  文字が合っているか確認してみてね！
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onRetry}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform"
              >
                ⚔ もう一度！
              </button>
              <button
                onClick={onHint}
                className="bg-[#1e1e3a] border-2 border-yellow-500 text-yellow-500 py-2 px-5 rounded-xl text-sm hover:scale-105 transition-transform"
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
