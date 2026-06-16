import { create } from 'zustand';
import { Word, GamePhase, LearningRecords, UserProgress, Settings } from '../types';
import { defaultWords } from '../data/defaultWords';
import { updateProficiency, calculateNextReviewTime, needsReview } from '../utils/spacedRepetition';

interface GameState {
  // 单词数据
  words: Word[];
  currentWordIndex: number;
  shuffledWordIds: string[];

  // 游戏状态
  phase: GamePhase;
  selectedLetters: string[];
  correctLetters: string[];
  score: number;
  streak: number; // 连续答对
  roundCorrect: number;
  roundTotal: number;

  // 学习记录
  records: LearningRecords;

  // 用户进度
  progress: UserProgress;

  // 设置
  settings: Settings;

  // 方法
  initGame: () => void;
  selectLetter: (letter: string) => void;
  removeLetter: (index: number) => void;
  clearSelection: () => void;
  submitAnswer: () => void;
  nextWord: () => void;
  resetRound: () => void;

  // 单词管理
  addWord: (word: Omit<Word, 'id'>) => void;
  deleteWord: (id: string) => void;
  updateWord: (id: string, updates: Partial<Word>) => void;

  // 获取当前单词
  getCurrentWord: () => Word | null;
  getShuffledLetters: () => string[];
  getDueWords: () => Word[];

  // 设置
  toggleSound: () => void;
}

const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageData = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// 生成唯一ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// 打乱字母
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameStore = create<GameState>((set, get) => ({
  words: getStorageData('memory_star_words', defaultWords),
  currentWordIndex: 0,
  shuffledWordIds: [],

  phase: 'IDLE',
  selectedLetters: [],
  correctLetters: [],
  score: 0,
  streak: 0,
  roundCorrect: 0,
  roundTotal: 0,

  records: getStorageData('memory_star_records', {}),

  progress: getStorageData('memory_star_progress', {
    totalWordsLearned: 0,
    currentStreak: 0,
    totalXP: 0,
    achievements: [],
    lastStudyDate: '',
  }),

  settings: getStorageData('memory_star_settings', {
    soundEnabled: true,
    theme: 'dark',
  }),

  initGame: () => {
    const { words, records } = get();

    // 按复习优先级排序单词
    const sortedIds = [...words]
      .map(w => w.id)
      .sort((a, b) => {
        const recordA = records[a];
        const recordB = records[b];
        if (!recordA) return 1;  // 新单词放后面
        if (!recordB) return -1;
        return recordA.下次复习时间 - recordB.下次复习时间;
      });

    // 优先选择需要复习的单词
    const dueWords = sortedIds.filter(id => {
      const record = records[id];
      return record && needsReview(record.下次复习时间);
    });

    // 混合待复习和新单词
    const newWords = sortedIds.filter(id => !records[id] || !needsReview(records[id].下次复习时间));
    const combined = [...dueWords, ...newWords.filter(id => !dueWords.includes(id))];

    set({
      shuffledWordIds: combined,
      currentWordIndex: 0,
      phase: 'SHOW_WORD',
      selectedLetters: [],
      roundCorrect: 0,
      roundTotal: 0,
    });
  },

  selectLetter: (letter: string) => {
    set(state => ({
      selectedLetters: [...state.selectedLetters, letter],
      phase: 'USER_INPUT',
    }));
  },

  removeLetter: (index: number) => {
    set(state => {
      const newSelected = [...state.selectedLetters];
      newSelected.splice(index, 1);
      return {
        selectedLetters: newSelected,
        phase: newSelected.length === 0 ? 'IDLE' : 'USER_INPUT',
      };
    });
  },

  clearSelection: () => {
    set({ selectedLetters: [], phase: 'IDLE' });
  },

  submitAnswer: () => {
    const { selectedLetters, getCurrentWord, records } = get();
    const currentWord = getCurrentWord();
    if (!currentWord) return;

    const correct = selectedLetters.join('') === currentWord.word;
    const wordId = currentWord.id;
    const currentRecord = records[wordId] || {
      wordId,
      熟练度: 1,
      下次复习时间: 0,
      正确次数: 0,
      错误次数: 0,
      lastReviewTime: 0,
    };

    const newProficiency = updateProficiency(currentRecord.熟练度, correct);
    const newRecord = {
      ...currentRecord,
      熟练度: newProficiency,
      下次复习时间: calculateNextReviewTime(newProficiency),
      正确次数: currentRecord.正确次数 + (correct ? 1 : 0),
      错误次数: currentRecord.错误次数 + (correct ? 0 : 1),
      lastReviewTime: Date.now(),
    };

    const newRecords = { ...records, [wordId]: newRecord };
    setStorageData('memory_star_records', newRecords);

    set(state => ({
      phase: 'CHECK_ANSWER',
      correctLetters: currentWord.word.split(''),
      score: correct ? state.score + 100 + state.streak * 10 : state.score,
      streak: correct ? state.streak + 1 : 0,
      roundCorrect: correct ? state.roundCorrect + 1 : state.roundCorrect,
      roundTotal: state.roundTotal + 1,
      records: newRecords,
    }));

    // 更新用户进度
    const { progress } = get();
    const today = new Date().toDateString();
    const newProgress = {
      ...progress,
      totalWordsLearned: progress.totalWordsLearned + 1,
      totalXP: progress.totalXP + (correct ? 100 : 10),
      currentStreak: correct ? progress.currentStreak : 0,
      lastStudyDate: today,
    };
    setStorageData('memory_star_progress', newProgress);
    set({ progress: newProgress });
  },

  nextWord: () => {
    set(state => {
      const nextIndex = state.currentWordIndex + 1;
      if (nextIndex >= state.shuffledWordIds.length) {
        return { phase: 'RESULT' };
      }
      return {
        currentWordIndex: nextIndex,
        phase: 'SHOW_WORD',
        selectedLetters: [],
        correctLetters: [],
      };
    });
  },

  resetRound: () => {
    set({
      phase: 'IDLE',
      currentWordIndex: 0,
      score: 0,
      streak: 0,
      roundCorrect: 0,
      roundTotal: 0,
    });
  },

  addWord: (word) => {
    const newWord: Word = {
      ...word,
      id: generateId(),
    };
    set(state => {
      const newWords = [...state.words, newWord];
      setStorageData('memory_star_words', newWords);
      return { words: newWords };
    });
  },

  deleteWord: (id) => {
    set(state => {
      const newWords = state.words.filter(w => w.id !== id);
      setStorageData('memory_star_words', newWords);
      return { words: newWords };
    });
  },

  updateWord: (id, updates) => {
    set(state => {
      const newWords = state.words.map(w =>
        w.id === id ? { ...w, ...updates } : w
      );
      setStorageData('memory_star_words', newWords);
      return { words: newWords };
    });
  },

  getCurrentWord: () => {
    const { words, shuffledWordIds, currentWordIndex } = get();
    if (shuffledWordIds.length === 0) return null;
    const wordId = shuffledWordIds[currentWordIndex];
    return words.find(w => w.id === wordId) || null;
  },

  getShuffledLetters: () => {
    const currentWord = get().getCurrentWord();
    if (!currentWord) return [];
    return shuffleArray(currentWord.word.split(''));
  },

  getDueWords: () => {
    const { words, records } = get();
    return words.filter(w => {
      const record = records[w.id];
      return record && needsReview(record.下次复习时间);
    });
  },

  toggleSound: () => {
    set(state => {
      const newSettings = { ...state.settings, soundEnabled: !state.settings.soundEnabled };
      setStorageData('memory_star_settings', newSettings);
      return { settings: newSettings };
    });
  },
}));
