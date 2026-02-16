import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Python Quest - コードを書いて、世界を冒険しよう！",
  description: "子供向けPython学習プラットフォーム。ブロックプログラミングからPythonへの段階的学習。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
