export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepoLens
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            GitHubリポジトリを独自の視点で分析・表示するポートフォリオアプリ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">📊 分析</h2>
            <p className="text-gray-600 dark:text-gray-400">
              リポジトリの統計情報を視覚化
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">🔍 レビュー</h2>
            <p className="text-gray-600 dark:text-gray-400">
              コードの品質と活動を評価
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">🎨 表示</h2>
            <p className="text-gray-600 dark:text-gray-400">
              美しいUIでプロジェクトを紹介
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}
