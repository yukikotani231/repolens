# ブランチ保護ルールの設定手順

このドキュメントでは、mainブランチへの直接プッシュを防ぎ、プルリクエスト経由での変更を必須にする設定方法を説明します。

## GitHub リポジトリでの設定

1. **リポジトリ設定ページを開く**
   - https://github.com/yukikotani231/repolens/settings に移動

2. **ブランチ保護ルールを追加**
   - 左サイドバーから「Branches」を選択
   - 「Add branch protection rule」ボタンをクリック

3. **ルールを設定**

   **Branch name pattern**:
   ```
   main
   ```

   **推奨設定（以下をチェック）**:

   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: 1（チーム開発の場合）
     - ⬜ Dismiss stale pull request approvals when new commits are pushed（オプション）
     - ⬜ Require review from Code Owners（オプション）

   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - 必須ステータスチェック（CI実行後に追加）:
       - `lint-and-format`
       - `type-check`
       - `build`

   - ✅ **Require conversation resolution before merging**
     - レビューコメントの解決を必須にする

   - ✅ **Do not allow bypassing the above settings**
     - 管理者も含めてルールを強制

   - ⬜ **Require linear history**（オプション）
     - マージコミットを防ぎたい場合にチェック

   - ⬜ **Require deployments to succeed before merging**（オプション）

4. **保存**
   - 「Create」または「Save changes」ボタンをクリック

## CI ステータスチェックの追加手順

初回のCIワークフローが実行された後、以下の手順でステータスチェックを必須にします：

1. ブランチ保護ルールの編集画面を開く
2. 「Require status checks to pass before merging」セクションで検索ボックスを使用
3. 以下のステータスチェックを追加:
   - `lint-and-format`
   - `type-check`
   - `build`
4. 変更を保存

## ローカルでの開発フロー

```bash
# 1. 最新のmainブランチを取得
git checkout main
git pull origin main

# 2. 新しいブランチを作成
git checkout -b feature/your-feature-name

# 3. 変更を加える
# ... コーディング ...

# 4. コードをフォーマット・チェック
npm run format
npm run lint:fix

# 5. ビルドと型チェック
npm run build

# 6. コミット
git add .
git commit -m "feat: your feature description"

# 7. プッシュ
git push origin feature/your-feature-name

# 8. GitHub でプルリクエストを作成
# https://github.com/yukikotani231/repolens/pulls

# 9. CI チェックが通過し、レビュー後にマージ
```

## 注意事項

- mainブランチへの直接プッシュは**禁止**されます
- すべての変更はプルリクエスト経由で行う必要があります
- CI チェック（lint, format, type-check, build）がすべて通過する必要があります
- 緊急時の対応が必要な場合は、リポジトリ設定から一時的にルールを無効化できます（管理者のみ）
