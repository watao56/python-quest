'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    title: 'ツールボックスからブロックを選ぼう',
    desc: '左のパネルからカテゴリをクリックして、使いたいブロックを見つけよう！',
    emoji: '🧰',
    highlight: '.blocklyToolboxDiv',
  },
  {
    title: 'ブロックをドラッグしてワークスペースに置こう',
    desc: 'ブロックをクリックしたまま、右のエリアにドラッグして離そう！',
    emoji: '✋',
    highlight: '.blocklySvg',
  },
  {
    title: 'ブロック同士をつなげよう',
    desc: 'ブロックの凸凹を合わせると、パチッとつながるよ！',
    emoji: '🧩',
    highlight: '.blocklySvg',
  },
  {
    title: '▶ 実行ボタンを押そう',
    desc: 'ブロックを組み立てたら、実行ボタンを押してプログラムを動かそう！',
    emoji: '🚀',
    highlight: '[data-tutorial-run]',
  },
];

const STORAGE_KEY = 'pythonquest_tutorial_done';

interface Props {
  questId: string;
  onComplete: () => void;
}

export default function Tutorial({ questId, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (questId !== '1-1') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
  }, [questId]);

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    onComplete();
  };

  const next = () => {
    if (step >= STEPS.length - 1) {
      finish();
    } else {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (!visible) return;
    // Highlight the target element
    const sel = STEPS[step]?.highlight;
    if (!sel) return;
    const el = document.querySelector(sel) as HTMLElement;
    if (el) {
      el.style.position = el.style.position || 'relative';
      el.style.zIndex = '10001';
      el.style.pointerEvents = 'none';
      return () => {
        el.style.zIndex = '';
        el.style.pointerEvents = '';
      };
    }
  }, [visible, step]);

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Card */}
        <motion.div
          key={step}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-gradient-to-br from-[#1e1e3a] to-[#2a1a4a] border-2 border-purple-500 rounded-2xl p-6 max-w-md w-full mx-4 text-center"
          style={{ boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
        >
          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === step ? 'bg-purple-400' : i < step ? 'bg-green-500' : 'bg-[#333]'
                }`}
              />
            ))}
          </div>

          <div className="text-5xl mb-3">{current.emoji}</div>
          <h3 className="text-lg font-bold text-purple-200 mb-2">
            ステップ {step + 1}: {current.title}
          </h3>
          <p className="text-slate-300 text-sm mb-6">{current.desc}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={finish}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-4 py-2"
            >
              スキップ
            </button>
            <button
              onClick={next}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform"
            >
              {step >= STEPS.length - 1 ? '🎉 はじめよう！' : '次へ →'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
