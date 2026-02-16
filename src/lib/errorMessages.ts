/** Issue #14: 子供向けエラーメッセージ変換 */

interface ErrorPattern {
  test: (msg: string) => boolean;
  message: (msg: string) => string;
}

const patterns: ErrorPattern[] = [
  {
    test: (m) => m.includes('TimeLimitError') || m.includes('time limit'),
    message: () => '⏰ プログラムの実行に時間がかかりすぎたよ！\nくり返しが止まらなくなっていないかな？',
  },
  {
    test: (m) => m.includes('IndentationError'),
    message: () => '📏 スペースの数が合ってないみたい！\nブロックの並びを確認してね',
  },
  {
    test: (m) => m.includes('SyntaxError') && m.includes('EOL'),
    message: () => '📝 文字列の閉じ忘れがあるよ！\nクォーテーション（\'や"）が足りないかも',
  },
  {
    test: (m) => m.includes('SyntaxError'),
    message: () => '🔍 コードの書き方に間違いがあるよ！\nブロックがちゃんとつながっているか確認してね',
  },
  {
    test: (m) => m.includes('NameError') && m.includes('pritn'),
    message: () => '🤔 "pritn"って何だろう？"print"の間違いかな？',
  },
  {
    test: (m) => m.includes('NameError') && m.includes('prnt'),
    message: () => '🤔 "prnt"って何だろう？"print"の間違いかな？',
  },
  {
    test: (m) => m.includes('NameError'),
    message: (m) => {
      const match = m.match(/name '(.+?)' is not defined/);
      if (match) return `🤔 「${match[1]}」が見つからないよ。スペルミスかな？`;
      return '🤔 使おうとしている名前が見つからないよ！\n変数の名前を確認してね';
    },
  },
  {
    test: (m) => m.includes('TypeError') && m.includes('concatenate'),
    message: () => '🔀 文字と数字は一緒につなげられないよ！\nstr()で数字を文字に変えてみよう',
  },
  {
    test: (m) => m.includes('TypeError'),
    message: () => '⚠️ 文字と数字を間違えているかも！\nデータの種類を確認してね',
  },
  {
    test: (m) => m.includes('ZeroDivisionError'),
    message: () => '🚫 0で割ることはできないよ！\n割り算の右側が0になっていないか確認してね',
  },
  {
    test: (m) => m.includes('IndexError'),
    message: () => '📋 リストの範囲を超えちゃったよ！\n番号が大きすぎないか確認してね',
  },
  {
    test: (m) => m.includes('ValueError'),
    message: () => '🔢 値がおかしいみたい！\n正しい値を入れているか確認してね',
  },
  {
    test: (m) => m.includes('KeyError'),
    message: () => '🔑 そのキーは辞書にないみたい！\n名前を確認してね',
  },
  {
    test: (m) => m.includes('AttributeError'),
    message: () => '❓ その機能は使えないみたい！\n正しい名前か確認してね',
  },
  {
    test: (m) => m.includes('RecursionError') || m.includes('maximum recursion'),
    message: () => '🔄 関数が自分自身を呼びすぎたよ！\n止まる条件を確認してね',
  },
];

export function translateError(msg: string): string {
  for (const p of patterns) {
    if (p.test(msg)) return p.message(msg);
  }
  return `😅 エラーが出たよ: ${msg}`;
}
