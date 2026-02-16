import { translateError } from './errorMessages';

declare global {
  interface Window {
    Sk: any;
  }
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

const MAX_EXECUTION_MS = 5000;

export async function loadSkulpt(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Sk) return true;
  
  return new Promise((resolve) => {
    const script1 = document.createElement('script');
    script1.src = 'https://skulpt.org/js/skulpt.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://skulpt.org/js/skulpt-stdlib.js';
      script2.onload = () => resolve(true);
      script2.onerror = () => resolve(false);
      document.head.appendChild(script2);
    };
    script1.onerror = () => resolve(false);
    document.head.appendChild(script1);
  });
}

export async function executePython(code: string): Promise<ExecutionResult> {
  if (!window.Sk) {
    return { success: false, output: '', error: 'Python実行エンジンが読み込まれていません' };
  }

  let output = '';
  
  window.Sk.configure({
    output: (text: string) => { output += text; },
    read: (filename: string) => {
      if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][filename] === undefined) {
        throw new Error(`File not found: '${filename}'`);
      }
      return window.Sk.builtinFiles['files'][filename];
    },
    execLimit: MAX_EXECUTION_MS,
  });

  try {
    await window.Sk.misceval.asyncToPromise(() => {
      return window.Sk.importMainWithBody('<stdin>', false, code, true);
    });
    return { success: true, output: output.trimEnd() };
  } catch (e: any) {
    const msg = e.toString();
    const jaMsg = translateError(msg);
    return { success: false, output, error: jaMsg };
  }
}

// Error translation moved to errorMessages.ts
