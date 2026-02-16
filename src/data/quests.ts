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
      '「📢 出力」カテゴリにあるブロックを使ってみよう',
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
    title: 'いろんな文字を表示しよう',
    mode: 'block',
    difficulty: 'practice',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: 'いいね！printの使い方をおぼえたね！\n今度は2行表示してみよう！\nprintブロックを2つ使ってみてね！',
    },
    description: '1行目に「Hello」、2行目に「World」と表示しよう',
    expectedOutput: 'Hello\nWorld',
    availableBlocks: ['print', 'text'],
    hints: [
      'printブロックを2つ使おう',
      '1つ目のprintブロックに「Hello」、2つ目に「World」を入れよう',
      'printブロックは下につなげることができるよ！',
    ],
    solutionCode: "print('Hello')\nprint('World')",
    rewards: { xp: 30, coins: 20 },
  },
  {
    id: '1-3',
    worldId: 'world-1',
    order: 3,
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
      '「📢 出力」ブロックを置いてみよう',
      '「🔗 つなげる」ブロックを使って2つの文字をつなげよう',
      '左に「Python」、右に「最高！」を入れてprintの中に入れよう',
    ],
    solutionCode: "print('Python' + '最高！')",
    rewards: { xp: 40, coins: 25 },
  },
  {
    id: '1-4',
    worldId: 'world-1',
    order: 4,
    title: '自己紹介を作ろう',
    mode: 'block',
    difficulty: 'practice',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: '文字をつなげるのが上手になったね！\n今度は自己紹介を作ってみよう！\n「わたしは」と「ブロッくん」をつなげてね！',
    },
    description: '「わたしはブロッくん」と表示しよう（文字の結合を使って）',
    expectedOutput: 'わたしはブロッくん',
    availableBlocks: ['print', 'text', 'text_join'],
    hints: [
      'printブロックと結合ブロックを使おう',
      '結合ブロックの左に「わたしは」と入れよう',
      '結合ブロックの右に「ブロッくん」を入れてprintの中に入れよう',
    ],
    solutionCode: "print('わたしは' + 'ブロッくん')",
    rewards: { xp: 40, coins: 25 },
  },
  {
    id: '1-5',
    worldId: 'world-1',
    order: 5,
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
      '「📢 出力」ブロックを使おう',
      '「🔢 計算」カテゴリのブロックで足し算ができるよ',
      '左に3、右に5を入れて、+を選んでprintの中に入れよう',
    ],
    solutionCode: 'print(3 + 5)',
    rewards: { xp: 40, coins: 25 },
  },
  {
    id: '1-6',
    worldId: 'world-1',
    order: 6,
    title: 'いろんな計算',
    mode: 'block',
    difficulty: 'practice',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: '足し算はバッチリだね！\n今度はかけ算に挑戦だ！\n「×」を使って計算してみよう！',
    },
    description: '4 × 7 の答え「28」を表示しよう',
    expectedOutput: '28',
    availableBlocks: ['print', 'math_number', 'math_arithmetic'],
    hints: [
      '計算ブロックの演算子を「×」に変えてみよう',
      '左に4、右に7を入れよう',
      'ドロップダウンで「×」を選んで、printの中に入れよう',
    ],
    solutionCode: 'print(4 * 7)',
    rewards: { xp: 40, coins: 25 },
  },
  {
    id: '1-7',
    worldId: 'world-1',
    order: 7,
    title: '変数を使おう',
    mode: 'block',
    difficulty: 'basic',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: '変数って知ってる？\nデータを入れておく「箱」みたいなものだよ！\n箱に名前をつけて、中身を表示してみよう！',
    },
    description: '変数「なまえ」に「Python」を入れて表示しよう',
    expectedOutput: 'Python',
    availableBlocks: ['print', 'text', 'variables'],
    hints: [
      '「📦 変数」カテゴリから「変数をセット」ブロックを使おう',
      '変数名を「なまえ」にして、文字ブロック「Python」を入れよう',
      'printブロックの中に「変数を取得」ブロックを入れよう',
    ],
    solutionCode: "なまえ = 'Python'\nprint(なまえ)",
    rewards: { xp: 50, coins: 30 },
  },
  {
    id: '1-8',
    worldId: 'world-1',
    order: 8,
    title: '変数で計算',
    mode: 'block',
    difficulty: 'challenge',
    npc: {
      character: 'block-kun',
      name: 'ブロッくん',
      emoji: '🧩',
      dialogue: 'いよいよワールド1のラストだ！\n変数と計算を組み合わせてみよう！\nこれができたらキミはもう立派なプログラマーだ！',
    },
    description: '変数「a」に10、「b」に20を入れて、a + b の答え「30」を表示しよう',
    expectedOutput: '30',
    availableBlocks: ['print', 'math_number', 'math_arithmetic', 'variables'],
    hints: [
      '変数「a」に10、変数「b」に20をセットしよう',
      '計算ブロックで変数aと変数bを足そう',
      'printブロックの中に計算結果を入れよう',
    ],
    solutionCode: 'a = 10\nb = 20\nprint(a + b)',
    rewards: { xp: 60, coins: 40 },
  },
];
