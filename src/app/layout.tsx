import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

// #29: next/font migration
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Python Quest - コードを書いて、世界を冒険しよう！',
  description: '子供向けPython学習プラットフォーム。ブロックプログラミングからPythonへの段階的学習。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={pressStart2P.variable}>
      <body className="bg-[#0a0a1a] text-white antialiased text-base">{children}</body>
    </html>
  );
}
