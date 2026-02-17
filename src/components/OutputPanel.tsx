'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  output: string;
  error: string | null;
  isRunning: boolean;
  hasRun: boolean;
}

export default function OutputPanel({ output, error, isRunning, hasRun }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] border-l-2 border-[#1e1e3a]">
      <div className="bg-[#12122a] px-4 py-2 border-b-2 border-[#1e1e3a] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500" />
        <span className="text-sm text-slate-400">📺 出力</span>
      </div>
      <div className="flex-1 p-4 overflow-auto" aria-live="polite" role="log" aria-label="プログラム出力">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-4xl animate-spin">⚙️</div>
            </motion.div>
          ) : !hasRun ? (
            <motion.div
              key="empty"
              initial={false}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full gap-3"
            >
              <div className="text-5xl opacity-30 animate-bounce">🧩</div>
              <p className="text-base text-slate-400">▶ 実行するとここに表示</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-800 rounded-lg p-4"
            >
              <div className="text-red-400 text-base font-bold mb-2">❌ エラー</div>
              <pre className="text-sm text-red-300 whitespace-pre-wrap">{error}</pre>
            </motion.div>
          ) : (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-[#12122a] rounded-lg p-4 border border-[#2a2a4a]">
                <pre className="text-lg text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
