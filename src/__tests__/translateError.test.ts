import { describe, it, expect } from 'vitest';
import { translateError } from '@/lib/errorMessages';

describe('translateError', () => {
  it('translates TimeLimitError', () => {
    expect(translateError('TimeLimitError: program took too long')).toContain('時間がかかりすぎた');
  });

  it('translates IndentationError', () => {
    expect(translateError('IndentationError: unexpected indent')).toContain('スペース');
  });

  it('translates SyntaxError with EOL', () => {
    expect(translateError('SyntaxError: EOL while scanning string literal')).toContain('閉じ忘れ');
  });

  it('translates NameError with specific name', () => {
    expect(translateError("NameError: name 'xyz' is not defined")).toContain('xyz');
  });

  it('translates ZeroDivisionError', () => {
    expect(translateError('ZeroDivisionError: division by zero')).toContain('0で割る');
  });

  it('translates TypeError with concatenate', () => {
    expect(translateError("TypeError: can't concatenate str and int")).toContain('文字と数字');
  });

  it('handles unknown errors', () => {
    const result = translateError('SomeRandomError: oops');
    expect(result).toContain('エラー');
  });

  it('translates RecursionError', () => {
    expect(translateError('RecursionError: maximum recursion depth exceeded')).toContain('呼びすぎ');
  });
});
