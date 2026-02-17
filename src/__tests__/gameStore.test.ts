import { describe, it, expect, beforeEach } from 'vitest';

// We need to test store logic directly
// Since zustand persist uses localStorage, mock it
const mockStorage: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  },
  writable: true,
});

import { useGameStore } from '@/store/gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    const state = useGameStore.getState();
    useGameStore.setState({
      xp: 0,
      coins: 0,
      questProgress: { '1-1': { status: 'available', stars: 0, attempts: 0, hintsUsed: 0 } },
      purchasedItems: [],
      theme: 'dark',
    });
  });

  it('starts with 0 xp and coins', () => {
    const { xp, coins } = useGameStore.getState();
    expect(xp).toBe(0);
    expect(coins).toBe(0);
  });

  it('adds xp', () => {
    useGameStore.getState().addXp(50);
    expect(useGameStore.getState().xp).toBe(50);
  });

  it('adds coins', () => {
    useGameStore.getState().addCoins(100);
    expect(useGameStore.getState().coins).toBe(100);
  });

  it('returns level 1 at start', () => {
    const { level, title } = useGameStore.getState().getLevel();
    expect(level).toBe(1);
    expect(title).toBe('コードのたまご');
  });

  it('levels up at 100xp', () => {
    useGameStore.getState().addXp(100);
    const { level } = useGameStore.getState().getLevel();
    expect(level).toBe(2);
  });

  it('clears a quest and unlocks next', () => {
    useGameStore.getState().clearQuest('1-1', 3, 30, 20);
    const p = useGameStore.getState().getQuestProgress('1-1');
    expect(p.status).toBe('cleared');
    expect(p.stars).toBe(3);
    const next = useGameStore.getState().getQuestProgress('1-2');
    expect(next.status).toBe('available');
  });

  it('tracks attempts', () => {
    useGameStore.getState().addAttempt('1-1');
    useGameStore.getState().addAttempt('1-1');
    expect(useGameStore.getState().getQuestProgress('1-1').attempts).toBe(2);
  });

  it('tracks hints used', () => {
    useGameStore.getState().useHint('1-1');
    expect(useGameStore.getState().getQuestProgress('1-1').hintsUsed).toBe(1);
  });

  it('purchases items', () => {
    useGameStore.getState().addCoins(100);
    useGameStore.getState().purchaseItem('hint-pack');
    expect(useGameStore.getState().purchasedItems).toContain('hint-pack');
  });

  it('does not duplicate purchased items', () => {
    useGameStore.getState().purchaseItem('hint-pack');
    useGameStore.getState().purchaseItem('hint-pack');
    expect(useGameStore.getState().purchasedItems.filter(i => i === 'hint-pack').length).toBe(1);
  });

  it('toggles theme', () => {
    useGameStore.getState().setTheme('light');
    expect(useGameStore.getState().theme).toBe('light');
    useGameStore.getState().setTheme('dark');
    expect(useGameStore.getState().theme).toBe('dark');
  });
});
