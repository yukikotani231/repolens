import { calculateLanguagePercentages, getLanguageColor } from '@/lib/github';
import { GitHubLanguageStats } from '@/types/github';

interface LanguageStatsProps {
  languages: GitHubLanguageStats;
}

export default function LanguageStats({ languages }: LanguageStatsProps) {
  const stats = calculateLanguagePercentages(languages);

  if (stats.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        言語情報がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {stats.map(({ language, percentage }) => (
          <div
            key={language}
            style={{
              width: `${percentage}%`,
              backgroundColor: getLanguageColor(language),
            }}
            className="h-full"
            title={`${language}: ${percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map(({ language, percentage, bytes }) => (
          <div
            key={language}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(language) }}
              />
              <span className="text-gray-900 dark:text-white font-medium">
                {language}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
        合計: {(Object.values(languages).reduce((a, b) => a + b, 0) / 1024).toFixed(1)} KB
      </div>
    </div>
  );
}
