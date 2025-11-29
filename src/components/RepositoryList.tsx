'use client';

import { useState } from 'react';
import { GitHubRepository } from '@/types/github';
import RepositoryCard from './RepositoryCard';

interface RepositoryListProps {
  repositories: GitHubRepository[];
}

type SortOption = 'updated' | 'stars' | 'forks' | 'name';

export default function RepositoryList({ repositories }: RepositoryListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');

  const languages = Array.from(
    new Set(
      repositories
        .map((repo) => repo.language)
        .filter((lang): lang is string => lang !== null)
    )
  ).sort();

  const sortedAndFilteredRepos = repositories
    .filter((repo) => {
      if (filterLanguage === 'all') return true;
      return repo.language === filterLanguage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            並び替え:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="updated">最終更新</option>
            <option value="stars">スター数</option>
            <option value="forks">フォーク数</option>
            <option value="name">名前</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            言語:
          </span>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {sortedAndFilteredRepos.length} 件のリポジトリ
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedAndFilteredRepos.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>

      {sortedAndFilteredRepos.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          リポジトリが見つかりませんでした
        </div>
      )}
    </div>
  );
}
