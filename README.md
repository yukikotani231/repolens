# RepoLens

GitHubアカウントと連携して、リポジトリ情報を独自の視点で分析・表示するポートフォリオアプリケーションです。

## 🎯 概要

RepoLensは、GitHub APIを活用してリポジトリの統計情報やコードの品質を分析し、美しいUIで表示するWebアプリケーションです。開発者のポートフォリオとして活用できます。

## ✨ 主な機能（予定）

- 📊 **リポジトリ分析**: コミット数、言語分布、活動履歴などの統計情報を視覚化
- 🔍 **コードレビュー**: リポジトリの品質や活動状況を評価
- 🎨 **カスタムビュー**: プロジェクトを魅力的に紹介するためのカスタマイズ可能なUI
- 🔐 **GitHub連携**: OAuth認証によるシームレスな連携

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: GitHub Pages (SSG)
- **API**: GitHub REST API / GraphQL API

## 📦 セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🚀 ビルドとデプロイ

```bash
# プロダクションビルド（静的エクスポート）
npm run build

# ビルドされたファイルは out/ ディレクトリに生成されます
```

### GitHub Pagesへのデプロイ

1. リポジトリをGitHubにプッシュ
2. GitHub Actionsを設定してビルド・デプロイを自動化
3. Settings > Pages でソースを設定

## 📁 プロジェクト構造

```
repolens/
├── src/
│   ├── app/              # App Router のページとレイアウト
│   ├── components/       # 再利用可能なコンポーネント
│   ├── lib/             # ユーティリティ関数
│   └── types/           # TypeScript 型定義
├── public/              # 静的ファイル
└── out/                 # ビルド出力（生成される）
```

## 🎨 開発ロードマップ

- [x] プロジェクトセットアップ
- [ ] GitHub OAuth認証の実装
- [ ] リポジトリ一覧表示
- [ ] リポジトリ詳細ページ
- [ ] 統計情報の視覚化
- [ ] レスポンシブデザインの最適化
- [ ] GitHub Actionsによる自動デプロイ

## 📄 ライセンス

MIT License

## 👤 作成者

yukikotani
