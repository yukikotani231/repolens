# RepoLens

GitHub PR Review Tool - GitHub OAuthで認証し、アクセス可能なプルリクエストを効率的にレビューするWebアプリケーション。

## 🎯 概要

RepoLensは、GitHubユーザーがOAuth認証でログインし、自身がアクセスできるプルリクエスト（PR）を一覧表示・詳細確認できるツールです。PRのDiff表示、ファイル変更内容、レビューコメントを独自のUIで確認できます。

## ✨ 主な機能

- 🔐 **GitHub OAuth認証**: GitHubアカウントで安全にログイン
- 📋 **PR一覧表示**: アクセス可能なすべてのプルリクエストを表示
- 🔍 **Diff表示**: コミット内容の変更を見やすく表示
- 💬 **レビューコメント**: PR内のレビューコメントを確認

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: NextAuth.js v5 + GitHub OAuth
- **ホスティング**: Vercel
- **API**: GitHub REST API

## 📦 セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- GitHub OAuth App（開発用・本番用）

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（Turbopackで高速化）
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 環境変数の設定

`.env.local` ファイルを作成し、以下を設定します：

```env
GITHUB_CLIENT_ID=<your_dev_oauth_app_client_id>
GITHUB_CLIENT_SECRET=<your_dev_oauth_app_client_secret>
AUTH_SECRET=<random_secret_key>
NEXTAUTH_URL=http://localhost:3000
```

GitHub OAuth App の作成方法：
1. https://github.com/settings/developers にアクセス
2. "New OAuth App" をクリック
3. Application name: `RepoLens (Dev)`
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 🚀 ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# 本番サーバーの起動
npm run start
```

### Vercelへのデプロイ

```bash
# Vercel CLIでログイン
vercel login

# 本番環境にデプロイ
vercel --prod --yes

# 環境変数を設定
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
vercel env add AUTH_SECRET production
```

本番環境では、別の GitHub OAuth App を使用してください。
- Authorization callback URL: `https://<your-vercel-domain>/api/auth/callback/github`

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

### ✅ 完了
- [x] プロジェクトセットアップ
- [x] GitHub OAuth認証の実装
- [x] PR一覧表示（ダッシュボード）
- [x] PR詳細ページ（Diff表示）
- [x] Vercelへのデプロイ

### 📋 今後の改善
- [ ] PR へのコメント機能の実装
- [ ] PR フィルタリング・ソート機能
- [ ] ダークモード対応
- [ ] キャッシング戦略の最適化
- [ ] カスタムドメイン設定

## 📄 ライセンス

MIT License

## 👤 作成者

yukikotani
