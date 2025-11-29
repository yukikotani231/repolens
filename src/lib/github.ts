import {
  GitHubUser,
  GitHubRepository,
  GitHubLanguageStats,
  GitHubCommit,
  GitHubPullRequest,
  GitHubPRFile,
  GitHubReviewComment,
} from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function fetchGitHub<T>(
  endpoint: string,
  accessToken?: string
): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
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

async function fetchGraphQL<T>(
  query: string,
  accessToken: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
    next: { revalidate: 3600 }, // キャッシュを1時間保持
  });

  if (!response.ok) {
    throw new GitHubAPIError(
      `GitHub GraphQL API request failed: ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();

  if (data.errors) {
    throw new GitHubAPIError(
      `GitHub GraphQL error: ${data.errors.map((e: any) => e.message).join(', ')}`,
      response.status
    );
  }

  return data.data as T;
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

// PR関連の関数

export async function getUserPullRequests(
  accessToken: string,
  state: 'open' | 'closed' | 'all' = 'open'
): Promise<GitHubPullRequest[]> {
  // GraphQL v4 を使用してアクセス可能な PR のみを取得
  // viewer.pullRequests はユーザーが author または reviewer である PR を返す
  // viewer.repositories 経由でアクセス可能なリポジトリの PR を取得する別の方法もあるが、
  // viewer.pullRequests がシンプルで効率的

  const query = `
    query GetUserPullRequests($states: [PullRequestState!], $first: Int!) {
      viewer {
        pullRequests(
          first: $first
          states: $states
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          nodes {
            id
            number
            title
            body
            state
            createdAt
            updatedAt
            author {
              login
              avatarUrl
            }
            repository {
              nameWithOwner
              owner {
                login
              }
              name
            }
            labels(first: 10) {
              nodes {
                id
                name
                color
              }
            }
            commits(first: 1) {
              totalCount
            }
            additions
            deletions
            merged
            url
          }
        }
      }
    }
  `;

  const states =
    state === 'all'
      ? ['OPEN', 'CLOSED']
      : state === 'open'
        ? ['OPEN']
        : ['CLOSED'];

  try {
    const response = await fetchGraphQL<{
      viewer: {
        pullRequests: {
          nodes: any[];
        };
      };
    }>(query, accessToken, {
      states,
      first: 100,
    });

    return response.viewer.pullRequests.nodes.map((node: any) => ({
      id: node.id,
      number: node.number,
      title: node.title,
      body: node.body,
      state: node.state.toLowerCase(),
      created_at: node.createdAt,
      updated_at: node.updatedAt,
      user: {
        login: node.author?.login || 'unknown',
        avatar_url: node.author?.avatarUrl || '',
      },
      repository_url: `https://api.github.com/repos/${node.repository.nameWithOwner}`,
      labels: (node.labels?.nodes || []).map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
      commits: node.commits.totalCount,
      additions: node.additions,
      deletions: node.deletions,
      merged: node.merged,
      html_url: node.url,
    }));
  } catch (error) {
    console.error('Failed to fetch PRs with GraphQL:', error);
    throw error;
  }
}

export async function getPullRequest(
  owner: string,
  repo: string,
  pr_number: number,
  accessToken: string
): Promise<GitHubPullRequest> {
  return fetchGitHub<GitHubPullRequest>(
    `/repos/${owner}/${repo}/pulls/${pr_number}`,
    accessToken
  );
}

export async function getPullRequestFiles(
  owner: string,
  repo: string,
  pr_number: number,
  accessToken: string
): Promise<GitHubPRFile[]> {
  return fetchGitHub<GitHubPRFile[]>(
    `/repos/${owner}/${repo}/pulls/${pr_number}/files`,
    accessToken
  );
}

export async function getPullRequestComments(
  owner: string,
  repo: string,
  pr_number: number,
  accessToken: string
): Promise<GitHubReviewComment[]> {
  return fetchGitHub<GitHubReviewComment[]>(
    `/repos/${owner}/${repo}/pulls/${pr_number}/comments`,
    accessToken
  );
}

export async function createReviewComment(
  owner: string,
  repo: string,
  pr_number: number,
  body: string,
  commit_id: string,
  path: string,
  line: number,
  accessToken: string
): Promise<GitHubReviewComment> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${pr_number}/comments`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body,
        commit_id,
        path,
        line,
      }),
    }
  );

  if (!response.ok) {
    throw new GitHubAPIError(
      `Failed to create review comment: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}
