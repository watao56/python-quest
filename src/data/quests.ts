export interface Quest {
  id: string;
  worldId: string;
  order: number;
  title: string;
  mode: 'block';
  difficulty: 'basic' | 'practice' | 'challenge';
  npc: {
    character: string;
    name: string;
    emoji: string;
    dialogue: string;
  };
  description: string;
  expectedOutput: string;
  availableBlocks: string[];
  hints: string[];
  solutionCode: string;
  rewards: {
    xp: number;
    coins: number;
  };
}

export const quests: Quest[] = [
  {
    id: '1-1',
    worldId: 'world-1',
    order: 1,
    title: 'はじめてのprint',
    mode: 'block',
    difficulty: 'basic',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: 'ようこそ、冒険者！\nまずはブロックを使って文字を表示してみよう！\n「出力」ブロックと「文字」ブロックを組み合わせるんだ！',
    },
    description: '「こんにちは、Python！」と表示するブロックを組み立てよう',
    expectedOutput: 'こんにちは、Python！',
    availableBlocks: ['print', 'text'],
    hints: [
      '「出力」カテゴリにあるブロックを使ってみよう',
      'printブロックの中に文字ブロックを入れてみよう',
      '文字ブロックに「こんにちは、Python！」と入力しよう',
    ],
    solutionCode: "print('こんにちは、Python！')",
    rewards: { xp: 30, coins: 20 },
  },
  {
    id: '1-2',
    worldId: 'world-1',
    order: 2,
    title: '文字をつなげよう',
    mode: 'block',
    difficulty: 'basic',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: '次は文字をつなげてみよう！\n「結合」ブロックを使うと、2つの文字をくっつけられるよ！',
    },
    description: '「Python」と「最高！」をつなげて「Python最高！」と表示しよう',
    expectedOutput: 'Python最高！',
    availableBlocks: ['print', 'text', 'text_join'],
    hints: [
      '「出力」ブロックを置いてみよう',
      '「結合」ブロックを使って2つの文字をつなげよう',
      '左に「Python」、右に「最高！」を入れてprintの中に入れよう',
    ],
    solutionCode: "print('Python' + '最高！')",
    rewards: { xp: 40, coins: 25 },
  },
  {
    id: '1-3',
    worldId: 'world-1',
    order: 3,
    title: '計算してみよう',
    mode: 'block',
    difficulty: 'basic',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: 'プログラミングでは計算もできるんだ！\n「計算」ブロックを使って足し算をしてみよう！',
    },
    description: '3 + 5 の答え「8」を表示しよう',
    expectedOutput: '8',
    availableBlocks: ['print', 'math_number', 'math_arithmetic'],
    hints: [
      '「出力」ブロックを使おう',
      '「計算」ブロックで足し算ができるよ',
      '左に3、右に5を入れて、+を選んでprintの中に入れよう',
    ],
    solutionCode: 'print(3 + 5)',
    rewards: { xp: 40, coins: 25 },
  },
];
