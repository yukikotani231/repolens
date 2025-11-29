import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserPullRequests } from '@/lib/github';
import Link from 'next/link';
import Image from 'next/image';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.accessToken) {
    redirect('/');
  }

  let pullRequests = [];
  let error = null;

  try {
    // GitHub APIからPR一覧を取得（open, closed, allの全て）
    pullRequests = await getUserPullRequests(session.accessToken, 'all');
  } catch (e) {
    error = 'PRの取得に失敗しました';
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RepoLens
            </h1>
            {session.user?.image && (
              <div className="flex items-center gap-2">
                <Image
                  src={session.user.image}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {session.user.name || session.user.email}
                </span>
              </div>
            )}
          </div>

          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pull Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            あなたがアクセス可能なプルリクエスト一覧
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {pullRequests.length === 0 && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              プルリクエストが見つかりませんでした
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {pullRequests.map((pr: any) => {
            const [owner, repo] = pr.repository_url.split('/').slice(-2);
            return (
              <Link
                key={pr.id}
                href={`/pr/${owner}/${repo}/${pr.number}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {owner}/{repo}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        #{pr.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Image
                          src={pr.user.avatar_url}
                          alt={pr.user.login}
                          width={20}
                          height={20}
                          className="rounded-full"
                          unoptimized
                        />
                        <span>{pr.user.login}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(pr.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pr.state === 'open' && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                        Open
                      </span>
                    )}
                    {pr.state === 'closed' && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                        Closed
                      </span>
                    )}
                  </div>
                </div>

                {pr.labels && pr.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pr.labels.slice(0, 5).map((label: any) => (
                      <span
                        key={label.id}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `#${label.color}20`,
                          color: `#${label.color}`,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
