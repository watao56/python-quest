'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// #23: Concept-specific mini tutorials per quest
const QUEST_TUTORIALS: Record<string, Array<{ title: string; desc: string; emoji: string }>> = {
  '1-1': [
    { title: 'ツールボックスからブロックを選ぼう', desc: '左のパネルからカテゴリをクリックして、使いたいブロックを見つけよう！', emoji: '🧰' },
    { title: 'ブロックをドラッグしてワークスペースに置こう', desc: 'ブロックをクリックしたまま、右のエリアにドラッグして離そう！', emoji: '✋' },
    { title: 'ブロック同士をつなげよう', desc: 'ブロックの凸凹を合わせると、パチッとつながるよ！', emoji: '🧩' },
    { title: '▶ 実行ボタンを押そう', desc: 'ブロックを組み立てたら、実行ボタンを押してプログラムを動かそう！', emoji: '🚀' },
  ],
  '1-3': [
    { title: '文字の結合って？', desc: '「つなげる」ブロックを使うと、2つの文字をくっつけて1つにできるよ！', emoji: '🔗' },
    { title: '結合ブロックの使い方', desc: '左と右に文字ブロックを入れて、printの中に入れよう！', emoji: '📝' },
  ],
  '1-5': [
    { title: '計算ブロックって？', desc: '「🔢 計算」カテゴリには、足し算・引き算・かけ算・割り算ができるブロックがあるよ！', emoji: '🔢' },
    { title: '計算結果を表示しよう', desc: '計算ブロックをprintブロックの中に入れると、答えが表示されるよ！', emoji: '📺' },
  ],
  '1-7': [
    { title: '変数ってなに？', desc: '変数は「データを入れる箱」のようなもの。名前をつけて、中に値を入れられるよ！', emoji: '📦' },
    { title: '変数をセットしよう', desc: '「変数をセット」ブロックで箱に値を入れて、「変数を取得」ブロックで中身を取り出そう！', emoji: '✏️' },
  ],
};

const STORAGE_KEY_PREFIX = 'pythonquest_tutorial_';

interface Props {
  questId: string;
  onComplete: () => void;
}

export default function Tutorial({ questId, onComplete }: Props) {
  const steps = QUEST_TUTORIALS[questId];
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!steps) return;
    const key = STORAGE_KEY_PREFIX + questId;
    if (localStorage.getItem(key)) return;
    setVisible(true);
  }, [questId, steps]);

  if (!steps || !visible) return null;

  const finish = () => {
    localStorage.setItem(STORAGE_KEY_PREFIX + questId, '1');
    setVisible(false);
    onComplete();
  };

  const next = () => {
    if (step >= steps.length - 1) {
      finish();
    } else {
      setStep(step + 1);
    }
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          key={step}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-gradient-to-br from-[#1e1e3a] to-[#2a1a4a] border-2 border-purple-500 rounded-2xl p-6 max-w-md w-full mx-4 text-center"
          style={{ boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
        >
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
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
            {current.title}
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
              {step >= steps.length - 1 ? '🎉 はじめよう！' : '次へ →'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
