'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  type: 'hint' | 'theme' | 'avatar';
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'hint-pack', name: '💡 ヒントパック', emoji: '💡', description: '次のクエストでヒントを1回無料で使える', cost: 30, type: 'hint' },
  { id: 'skip-token', name: '⏭ スキップチケット', emoji: '⏭', description: '難しいクエストをスキップできる（1回分）', cost: 100, type: 'hint' },
  { id: 'avatar-ninja', name: '🥷 忍者アバター', emoji: '🥷', description: 'プロフィールアイコンが忍者になる', cost: 50, type: 'avatar' },
  { id: 'avatar-wizard', name: '🧙 魔法使いアバター', emoji: '🧙', description: 'プロフィールアイコンが魔法使いになる', cost: 50, type: 'avatar' },
  { id: 'avatar-robot', name: '🤖 ロボットアバター', emoji: '🤖', description: 'プロフィールアイコンがロボットになる', cost: 50, type: 'avatar' },
  { id: 'theme-ocean', name: '🌊 オーシャンテーマ', emoji: '🌊', description: 'ブルーのカラーテーマ', cost: 80, type: 'theme' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoinShop({ isOpen, onClose }: Props) {
  const { coins, addCoins, purchasedItems, purchaseItem } = useGameStore();
  const [message, setMessage] = useState<string | null>(null);

  const handlePurchase = (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      setMessage('もう持っているよ！');
      return;
    }
    if (coins < item.cost) {
      setMessage('コインが足りないよ！クエストをクリアしてコインを集めよう！');
      return;
    }
    addCoins(-item.cost);
    purchaseItem(item.id);
    setMessage(`${item.name} をゲット！ 🎉`);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-[#12122a] to-[#1e1e3a] border-2 border-yellow-500 rounded-3xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: '0 0 40px rgba(245,158,11,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-400">🏪 コインショップ</h2>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">💰 {coins}</span>
                <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 mb-4 text-center text-sm text-purple-200"
              >
                {message}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOP_ITEMS.map((item) => {
                const owned = purchasedItems.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-[#0a0a1a] border rounded-xl p-4 ${owned ? 'border-green-500/50' : 'border-[#2a2a4a]'}`}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <h3 className="text-sm font-bold mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">{item.description}</p>
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={owned}
                      className={`w-full py-1.5 rounded-lg text-sm font-bold transition-colors ${
                        owned
                          ? 'bg-green-900/30 text-green-500 cursor-default'
                          : coins >= item.cost
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {owned ? '✓ 購入済み' : `💰 ${item.cost} コイン`}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
