# RepoLens

GitHub PR Review Tool - GitHub OAuthで認証し、アクセス可能なプルリクエストを効率的にレビューするWebアプリケーション。

## 🎯 概要

RepoLensは、GitHubユーザーがOAuth認証でログインし、自身がアクセスできるプルリクエスト（PR）を一覧表示・詳細確認できるツールです。PRのDiff表示、ファイル変更内容、レビューコメントを独自のUIで確認できます。

## ✨ 主な機能

- 🔐 **GitHub OAuth認証**: GitHubアカウントで安全にログイン
- 📋 **PR一覧表示**: アクセス可能なすべてのプルリクエストを表示
- 🔍 **サイドバイサイドDiff表示**: GitHub風の左右分割表示で変更内容を直感的に確認
  - 旧コード（削除）と新コード（追加）を並べて表示
  - コードブロック風のスタイリング
  - ダークモード対応の色分け
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
│   ├── app/
│   │   ├── page.tsx                           # トップページ（OAuth認証ボタン）
│   │   ├── dashboard/page.tsx                 # PR一覧ダッシュボード
│   │   ├── pr/[owner]/[repo]/[number]/page.tsx # PR詳細ページ
│   │   └── api/auth/[...nextauth]/route.ts    # NextAuth APIルート
│   ├── components/
│   │   └── DiffViewer.tsx                     # サイドバイサイドDiff表示コンポーネント
│   ├── lib/
│   │   ├── github.ts                          # GitHub API クライアント
│   │   └── diff-parser.ts                     # Diffパース・色分けロジック
│   ├── types/
│   │   └── github.ts                          # GitHub APIレスポンス型定義
│   └── auth.ts                                # NextAuth設定
├── public/                                     # 静的ファイル
└── CLAUDE.md                                   # 開発ガイド（Claude Code用）
```

## 🎨 開発ロードマップ

### ✅ 完了
- [x] プロジェクトセットアップ
- [x] GitHub OAuth認証の実装
- [x] PR一覧表示（ダッシュボード）
- [x] PR詳細ページ（基本Diff表示）
- [x] サイドバイサイドDiff表示の実装
- [x] Diff表示の色分け・スタイリング改善
- [x] Vercelへのデプロイ

### 📋 TODO（今後の改善）

#### Diff表示の強化
- [ ] シンタックスハイライト（言語別のコードハイライト）
- [ ] 行番号の表示
- [ ] Diff内の検索・フィルタリング機能
- [ ] コードの折りたたみ機能
- [ ] ファイル間のナビゲーション改善

#### レビュー機能
- [ ] PR へのコメント投稿機能
- [ ] インラインコメント機能（特定行へのコメント）
- [ ] レビューステータスの変更（Approve/Request Changes）
- [ ] コメントスレッドの表示・返信

#### UI/UX改善
- [ ] PR フィルタリング・ソート機能
- [ ] ダークモードの切り替えUI（現在は自動対応のみ）
- [ ] キーボードショートカット
- [ ] レスポンシブデザインの最適化

#### パフォーマンス・インフラ
- [ ] キャッシング戦略の最適化
- [ ] 大きなDiffの仮想スクロール対応
- [ ] カスタムドメイン設定
- [ ] GitHub Apps への移行（より柔軟な権限管理）

## 📄 ライセンス

MIT License

## 🔗 リンク

- **本番環境**: https://repolens-woad.vercel.app
- **リポジトリ**: https://github.com/yukikotani231/repolens

## 👤 作成者

yukikotani
