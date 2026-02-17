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

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function loadSkulptFrom(base: string): Promise<boolean> {
  const mainOk = await loadScript(`${base}/skulpt.min.js`);
  if (!mainOk) return false;
  return loadScript(`${base}/skulpt-stdlib.js`);
}

export async function loadSkulpt(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Sk) return true;

  // Try CDN first, fall back to local bundle
  const cdnOk = await loadSkulptFrom('https://skulpt.org/js');
  if (cdnOk && window.Sk) return true;

  // Fallback to local copy
  const localOk = await loadSkulptFrom('/js');
  return localOk && !!window.Sk;
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

