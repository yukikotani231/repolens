import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RepoLens - GitHub Portfolio Viewer',
  description: 'View and analyze GitHub repositories through a custom lens',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
