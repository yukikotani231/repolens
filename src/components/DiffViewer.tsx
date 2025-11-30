'use client';

import {
  parseDiffPatch,
  createDiffLinePairs,
  getDiffLineColor,
  getDiffLineTextColor,
  getDiffLineIndicator,
  type DiffLine,
} from '@/lib/diff-parser';

interface DiffViewerProps {
  patch: string;
  filename: string;
}

function DiffLineCell({ line, side }: { line?: DiffLine; side: 'old' | 'new' }) {
  if (!line) {
    return (
      <div
        className={`min-h-[1.5rem] ${side === 'old' ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'}`}
      />
    );
  }

  const isHeader = line.type === 'hunk' || line.type === 'header';

  if (isHeader) {
    return (
      <div className={`min-h-[1.5rem] px-3 py-1 flex items-center ${getDiffLineColor(line.type)}`}>
        <span className={getDiffLineTextColor(line.type)}>{line.content}</span>
      </div>
    );
  }

  // 背景色を決定
  const bgColor =
    line.type === 'context'
      ? side === 'old'
        ? 'bg-gray-50 dark:bg-gray-900/50'
        : 'bg-white dark:bg-gray-800'
      : getDiffLineColor(line.type);

  return (
    <div className={`min-h-[1.5rem] px-3 py-1 flex items-start gap-2 ${bgColor}`}>
      <span className="w-4 text-center flex-shrink-0 text-gray-500 dark:text-gray-400 select-none">
        {getDiffLineIndicator(line.type)}
      </span>
      <span className={`flex-1 whitespace-pre-wrap break-words ${getDiffLineTextColor(line.type)}`}>
        {line.content || '\u00A0'}
      </span>
    </div>
  );
}

export default function DiffViewer({ patch, filename }: DiffViewerProps) {
  const lines = parseDiffPatch(patch);
  const pairs = createDiffLinePairs(lines);

  return (
    <div className="space-y-2">
      <div className="text-sm font-mono text-gray-600 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded">
        {filename}
      </div>

      {/* Side-by-side diff view */}
      <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-white dark:bg-gray-800">
        <div className="text-xs font-mono">
          {pairs.map((pair, index) => (
            <div
              key={index}
              className="grid grid-cols-2 divide-x divide-gray-300 dark:divide-gray-600"
            >
              <DiffLineCell line={pair.oldLine} side="old" />
              <DiffLineCell line={pair.newLine} side="new" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
