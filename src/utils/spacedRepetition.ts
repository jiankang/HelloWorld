// 间隔配置（毫秒）
export const INTERVALS: Record<number, number> = {
  1: 0,                      // 立即
  2: 60 * 1000,              // 1分钟
  3: 10 * 60 * 1000,         // 10分钟
  4: 24 * 60 * 60 * 1000,    // 1天
  5: 3 * 24 * 60 * 60 * 1000, // 3天
  6: 7 * 24 * 60 * 60 * 1000, // 7天
};

export const getIntervalDescription = (level: number): string => {
  const descriptions: Record<number, string> = {
    1: '立即复习',
    2: '1分钟后',
    3: '10分钟后',
    4: '1天后',
    5: '3天后',
    6: '7天后',
  };
  return descriptions[level] || '';
};

// 计算下次复习时间
export const calculateNextReviewTime = (熟练度: number): number => {
  return Date.now() + INTERVALS[熟练度] || 0;
};

// 根据答题结果更新熟练度
export const updateProficiency = (
  currentLevel: number,
  isCorrect: boolean
): number => {
  if (isCorrect) {
    // 连续正确，熟练度上升，最多到6
    return Math.min(currentLevel + 1, 6);
  } else {
    // 答错，熟练度下降，最低到1
    return Math.max(currentLevel - 1, 1);
  }
};

// 判断单词是否需要复习
export const needsReview = (nextReviewTime: number): boolean => {
  return Date.now() >= nextReviewTime;
};

// 排序单词：优先复习即将遗忘的
export const sortByReviewPriority = <T extends { wordId: string; 下次复习时间: number }>(
  records: Record<string, T>,
  words: { id: string }[]
): string[] => {
  const now = Date.now();

  return words
    .map(w => {
      const record = records[w.id];
      if (!record) return { id: w.id, priority: -1 }; // 新单词优先度最低
      const timeUntilReview = record.下次复习时间 - now;
      // 越接近复习时间的优先度越高，负数表示已过期
      return { id: w.id, priority: -timeUntilReview };
    })
    .sort((a, b) => b.priority - a.priority)
    .map(item => item.id);
};
