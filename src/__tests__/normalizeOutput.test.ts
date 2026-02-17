import { describe, it, expect } from 'vitest';

// Copy from page.tsx for testing
function normalizeOutput(s: string): string {
  return s
    .replace(/\s+$/gm, '')
    .trim()
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, ' ');
}

describe('normalizeOutput', () => {
  it('trims whitespace', () => {
    expect(normalizeOutput('  hello  ')).toBe('hello');
  });

  it('converts full-width to half-width', () => {
    expect(normalizeOutput('Ｈｅｌｌｏ')).toBe('Hello');
  });

  it('converts full-width space', () => {
    expect(normalizeOutput('a\u3000b')).toBe('a b');
  });

  it('trims trailing whitespace per line', () => {
    expect(normalizeOutput('hello  \nworld  ')).toBe('hello\nworld');
  });

  it('handles empty string', () => {
    expect(normalizeOutput('')).toBe('');
  });

  it('converts full-width numbers', () => {
    expect(normalizeOutput('１２３')).toBe('123');
  });

  it('converts full-width punctuation', () => {
    expect(normalizeOutput('こんにちは！')).toBe('こんにちは!');
  });
});
