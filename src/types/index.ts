// 单词
export interface Word {
  id: string;
  word: string;
  meaning: string;
  sentence?: string;
  phonetic?: string;
}

// 学习记录
export interface LearningRecord {
  wordId: string;
  熟练度: number; // 1-6
  下次复习时间: number; // timestamp
  正确次数: number;
  错误次数: number;
  lastReviewTime: number;
}

// 用户进度
export interface UserProgress {
  totalWordsLearned: number;
  currentStreak: number;
  totalXP: number;
  achievements: string[];
  lastStudyDate: string;
}

// 记忆记录Map
export type LearningRecords = Record<string, LearningRecord>;

// 游戏状态
export type GamePhase = 'IDLE' | 'SHOW_WORD' | 'USER_INPUT' | 'CHECK_ANSWER' | 'RESULT';

// 设置
export interface Settings {
  soundEnabled: boolean;
  theme: 'dark' | 'light';
}
