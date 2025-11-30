// Diff ラインの型定義
export interface DiffLine {
  type: 'header' | 'addition' | 'deletion' | 'context' | 'hunk';
  content: string;
  lineNumber?: number;
}

/**
 * Unified Diff フォーマットをパースして、色分けできるラインの配列に変換
 * @param patch - GitHub API から取得した patch テキスト
 * @returns パースされたdiff ライン配列
 */
export function parseDiffPatch(patch: string): DiffLine[] {
  const lines = patch.split('\n');
  const result: DiffLine[] = [];

  for (const line of lines) {
    if (line.startsWith('@@')) {
      // Hunk header
      result.push({
        type: 'hunk',
        content: line,
      });
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      // Addition line
      result.push({
        type: 'addition',
        content: line.slice(1),
      });
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      // Deletion line
      result.push({
        type: 'deletion',
        content: line.slice(1),
      });
    } else if (line.startsWith('\\')) {
      // "\ No newline at end of file" message
      result.push({
        type: 'context',
        content: line,
      });
    } else {
      // Context line (starts with space) or header
      result.push({
        type: line.startsWith('---') || line.startsWith('+++') ? 'header' : 'context',
        content: line.startsWith(' ') ? line.slice(1) : line,
      });
    }
  }

  return result;
}

/**
 * Diff ラインタイプに対応する背景色を返す
 */
export function getDiffLineColor(type: DiffLine['type']): string {
  switch (type) {
    case 'addition':
      return 'bg-green-100 dark:bg-green-900';
    case 'deletion':
      return 'bg-red-100 dark:bg-red-900';
    case 'hunk':
      return 'bg-blue-50 dark:bg-blue-900/40';
    case 'header':
      return 'bg-gray-100 dark:bg-gray-700';
    default:
      return 'bg-transparent';
  }
}

/**
 * Diff ラインタイプに対応するテキスト色を返す
 */
export function getDiffLineTextColor(type: DiffLine['type']): string {
  switch (type) {
    case 'addition':
      return 'text-green-700 dark:text-green-300';
    case 'deletion':
      return 'text-red-700 dark:text-red-300';
    case 'hunk':
      return 'text-blue-700 dark:text-blue-300 font-semibold';
    case 'header':
      return 'text-gray-700 dark:text-gray-300 font-semibold';
    default:
      return 'text-gray-900 dark:text-gray-100';
  }
}

/**
 * Diff ラインの左側インジケーターを返す
 */
export function getDiffLineIndicator(type: DiffLine['type']): string {
  switch (type) {
    case 'addition':
      return '+';
    case 'deletion':
      return '-';
    default:
      return ' ';
  }
}

// サイド・バイ・サイド表示用の行ペア
export interface DiffLinePair {
  oldLine?: DiffLine;
  newLine?: DiffLine;
}

/**
 * パースされたdiff ラインを、左右並べて表示する形式に変換
 * @param lines - parseDiffPatch で取得したdiff ライン配列
 * @returns 左右のラインペア配列
 */
export function createDiffLinePairs(lines: DiffLine[]): DiffLinePair[] {
  const pairs: DiffLinePair[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.type === 'hunk' || line.type === 'header') {
      // ハンク・ヘッダーは左右両方に表示
      pairs.push({
        oldLine: line,
        newLine: line,
      });
      i++;
    } else if (line.type === 'context') {
      // コンテキスト行は左右両方に同じ内容を表示
      pairs.push({
        oldLine: line,
        newLine: line,
      });
      i++;
    } else if (line.type === 'deletion') {
      // 削除行は左側に表示
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.type === 'addition') {
        // 次の行が追加行なら、左右で対応付け
        pairs.push({
          oldLine: line,
          newLine: nextLine,
        });
        i += 2;
      } else {
        // 追加行がなければ、削除行のみ左側に表示
        pairs.push({
          oldLine: line,
        });
        i++;
      }
    } else if (line.type === 'addition') {
      // 単独の追加行（前の行が削除行でなかった場合）は右側のみ
      pairs.push({
        newLine: line,
      });
      i++;
    } else {
      i++;
    }
  }

  return pairs;
}
