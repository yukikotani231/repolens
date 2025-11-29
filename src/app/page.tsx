import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepoLens
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium">
            GitHub PR Review Tool
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            GitHubのプルリクエストを独自のUIでレビュー。
            <br />
            効率的なコードレビューを実現します。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
              主な機能
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    PR一覧表示
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    アクセス可能なすべてのPRを一覧表示
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-2xl">🔍</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Diff表示
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    変更内容を見やすく表示
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    レビューコメント
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    直接コメントを追加してレビュー
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/dashboard' });
            }}
            className="pt-4"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            GitHubアカウントでログインして、PRレビューを開始
          </p>
        </div>
      </main>
    </div>
  );
}
