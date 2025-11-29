import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  getPullRequest,
  getPullRequestFiles,
  getPullRequestComments,
} from '@/lib/github';
import Link from 'next/link';
import Image from 'next/image';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

interface PRPageProps {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
}

export default async function PRPage({ params }: PRPageProps) {
  const session = await auth();
  const { owner, repo, number } = await params;

  if (!session || !session.accessToken) {
    redirect('/');
  }

  const pr_number = parseInt(number);

  let pr: any = null;
  let files: any[] = [];
  let comments: any[] = [];
  let error: string | null = null;

  try {
    [pr, files, comments] = await Promise.all([
      getPullRequest(owner, repo, pr_number, session.accessToken),
      getPullRequestFiles(owner, repo, pr_number, session.accessToken),
      getPullRequestComments(owner, repo, pr_number, session.accessToken),
    ]);
  } catch (e) {
    console.error('PR fetch error:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    if (errorMessage.includes('Forbidden')) {
      error = 'このリポジトリへのアクセス権限がありません';
    } else {
      error = 'PRの取得に失敗しました';
    }
  }

  if (!pr) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'PRが見つかりませんでした'}
          </h1>
          <Link
            href="/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ダッシュボードに戻る
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {owner}/{repo}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  #{pr.number}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pr.title}
              </h1>
            </div>

            {pr.state === 'open' && (
              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                Open
              </span>
            )}
            {pr.state === 'closed' && (
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {pr.merged ? 'Merged' : 'Closed'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {pr.body && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  説明
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {pr.body}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                変更ファイル ({files.length})
              </h2>

              <div className="space-y-4">
                {files.map((file: any) => (
                  <div
                    key={file.sha}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {file.status === 'added' && (
                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                            +
                          </span>
                        )}
                        {file.status === 'modified' && (
                          <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                            M
                          </span>
                        )}
                        {file.status === 'removed' && (
                          <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                            -
                          </span>
                        )}
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          +{file.additions}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          -{file.deletions}
                        </span>
                      </div>
                    </div>

                    {file.patch && (
                      <div className="bg-gray-900 p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-300 font-mono">
                          {file.patch}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {comments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  コメント ({comments.length})
                </h2>

                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Image
                          src={comment.user.avatar_url}
                          alt={comment.user.login}
                          width={32}
                          height={32}
                          className="rounded-full"
                          unoptimized
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {comment.user.login}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </div>

                      {comment.path && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-mono">
                          {comment.path}
                          {comment.line && `:${comment.line}`}
                        </div>
                      )}

                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                情報
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    width={24}
                    height={24}
                    className="rounded-full"
                    unoptimized
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {pr.user.login}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    作成日:
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {formatDate(pr.created_at)}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    最終更新:
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {formatDate(pr.updated_at)}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    ブランチ:
                  </div>
                  <div className="font-mono text-sm text-gray-900 dark:text-white">
                    {pr.head.ref} → {pr.base.ref}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pr.commits}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Commits
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{pr.additions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        追加
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        -{pr.deletions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        削除
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-4 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-center rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  GitHubで見る
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
