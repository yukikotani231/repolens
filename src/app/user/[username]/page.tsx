import { getUserProfile, getUserRepositories } from '@/lib/github';
import UserProfile from '@/components/UserProfile';
import RepositoryList from '@/components/RepositoryList';
import Link from 'next/link';
import { Metadata } from 'next';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} - RepoLens`,
    description: `View ${username}'s GitHub repositories and profile`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  try {
    const [user, repositories] = await Promise.all([
      getUserProfile(username),
      getUserRepositories(username),
    ]);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
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
            ホームに戻る
          </Link>

          <div className="space-y-8">
            <UserProfile user={user} />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                リポジトリ
              </h2>
              <RepositoryList repositories={repositories} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ユーザーが見つかりません
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ユーザー名 &quot;{username}&quot; のGitHubユーザーが見つかりませんでした。
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
