import {
  GitHubUser,
  GitHubRepository,
  GitHubLanguageStats,
  GitHubCommit,
} from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 3600 }, // キャッシュを1時間保持
  });

  if (!response.ok) {
    throw new GitHubAPIError(
      `GitHub API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function getUserProfile(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`);
}

export async function getUserRepositories(
  username: string,
  options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
  } = {}
): Promise<GitHubRepository[]> {
  const { sort = 'updated', direction = 'desc', per_page = 100 } = options;
  const params = new URLSearchParams({
    sort,
    direction,
    per_page: per_page.toString(),
  });

  return fetchGitHub<GitHubRepository[]>(
    `/users/${username}/repos?${params.toString()}`
  );
}

export async function getRepositoryLanguages(
  owner: string,
  repo: string
): Promise<GitHubLanguageStats> {
  return fetchGitHub<GitHubLanguageStats>(`/repos/${owner}/${repo}/languages`);
}

export async function getRepositoryCommits(
  owner: string,
  repo: string,
  per_page: number = 100
): Promise<GitHubCommit[]> {
  const params = new URLSearchParams({
    per_page: per_page.toString(),
  });

  return fetchGitHub<GitHubCommit[]>(
    `/repos/${owner}/${repo}/commits?${params.toString()}`
  );
}

export async function getRepositoryDetails(
  owner: string,
  repo: string
): Promise<GitHubRepository> {
  return fetchGitHub<GitHubRepository>(`/repos/${owner}/${repo}`);
}

// ユーティリティ関数
export function calculateLanguagePercentages(
  languages: GitHubLanguageStats
): Array<{ language: string; percentage: number; bytes: number }> {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  return Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / total) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Dart: '#00B4AB',
    Vue: '#41b883',
    Svelte: '#ff3e00',
  };

  return colors[language] || '#8b949e';
}
