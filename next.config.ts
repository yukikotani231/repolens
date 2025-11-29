import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages用の静的エクスポート設定（動的ルート使用時は無効化）
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: process.env.NODE_ENV === 'production' ? '/repolens' : '',
};

export default nextConfig;
