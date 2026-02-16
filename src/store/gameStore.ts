import { create } from 'zustand';

const LEVEL_TABLE = [
  { level: 1, xp: 0, title: 'コードのたまご' },
  { level: 2, xp: 100, title: 'コードのひよこ' },
  { level: 3, xp: 300, title: 'コードの見習い' },
  { level: 4, xp: 500, title: 'コードの冒険者' },
  { level: 5, xp: 800, title: 'コードの騎士' },
  { level: 6, xp: 1200, title: 'コードの魔法使い' },
  { level: 7, xp: 1800, title: 'コードの賢者' },
  { level: 8, xp: 2500, title: 'コードの達人' },
  { level: 9, xp: 3500, title: 'コードの伝説' },
  { level: 10, xp: 5000, title: 'Pythonマスター' },
];

export interface QuestProgress {
  status: 'locked' | 'available' | 'cleared';
  stars: number;
  attempts: number;
  hintsUsed: number;
}

interface GameState {
  xp: number;
  coins: number;
  questProgress: Record<string, QuestProgress>;
  getLevel: () => { level: number; title: string; currentXp: number; nextXp: number };
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  getQuestProgress: (questId: string) => QuestProgress;
  clearQuest: (questId: string, stars: number, xp: number, coins: number) => void;
  useHint: (questId: string) => void;
  addAttempt: (questId: string) => void;
}

const loadState = () => {
  if (typeof window === 'undefined') return { xp: 0, coins: 0, questProgress: {} };
  try {
    const saved = localStorage.getItem('python-quest-save');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { xp: 0, coins: 0, questProgress: {} };
};

export const useGameStore = create<GameState>((set, get) => {
  const initial = loadState();
  
  // Ensure quest 1-1 is available
  if (!initial.questProgress['1-1']) {
    initial.questProgress['1-1'] = { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 };
  }

  const save = () => {
    if (typeof window === 'undefined') return;
    const { xp, coins, questProgress } = get();
    localStorage.setItem('python-quest-save', JSON.stringify({ xp, coins, questProgress }));
  };

  return {
    xp: initial.xp,
    coins: initial.coins,
    questProgress: initial.questProgress,

    getLevel: () => {
      const xp = get().xp;
      let current = LEVEL_TABLE[0];
      let next = LEVEL_TABLE[1];
      for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_TABLE[i].xp) {
          current = LEVEL_TABLE[i];
          next = LEVEL_TABLE[i + 1] || LEVEL_TABLE[i];
          break;
        }
      }
      return { level: current.level, title: current.title, currentXp: xp - current.xp, nextXp: next.xp - current.xp };
    },

    addXp: (amount) => {
      set((s) => ({ xp: s.xp + amount }));
      save();
    },

    addCoins: (amount) => {
      set((s) => ({ coins: s.coins + amount }));
      save();
    },

    getQuestProgress: (questId) => {
      return get().questProgress[questId] || { status: 'locked', stars: 0, attempts: 0, hintsUsed: 0 };
    },

    clearQuest: (questId, stars, xp, coins) => {
      set((s) => {
        const prev = s.questProgress[questId] || { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 };
        const newProgress = { ...s.questProgress };
        newProgress[questId] = { ...prev, status: 'cleared' as const, stars: Math.max(prev.stars, stars) };
        
        // Unlock next quest
        const parts = questId.split('-');
        const nextId = `${parts[0]}-${parseInt(parts[1]) + 1}`;
        if (!newProgress[nextId] || newProgress[nextId].status === 'locked') {
          newProgress[nextId] = { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 };
        }
        
        return { xp: s.xp + xp, coins: s.coins + coins, questProgress: newProgress };
      });
      save();
    },

    useHint: (questId) => {
      set((s) => {
        const prev = s.questProgress[questId] || { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 };
        const newProgress = { ...s.questProgress };
        newProgress[questId] = { ...prev, hintsUsed: prev.hintsUsed + 1 };
        return { questProgress: newProgress };
      });
      save();
    },

    addAttempt: (questId) => {
      set((s) => {
        const prev = s.questProgress[questId] || { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 };
        const newProgress = { ...s.questProgress };
        newProgress[questId] = { ...prev, attempts: prev.attempts + 1 };
        return { questProgress: newProgress };
      });
      save();
    },
  };
});
