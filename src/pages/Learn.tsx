import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import LetterPuzzle from '../components/LetterPuzzle/LetterPuzzle';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import ScorePopup from '../components/ScorePopup/ScorePopup';

export default function Learn() {
  const {
    phase,
    selectedLetters,
    correctLetters,
    score,
    streak,
    roundCorrect,
    roundTotal,
    shuffledWordIds,
    currentWordIndex,
    initGame,
    selectLetter,
    removeLetter,
    clearSelection,
    submitAnswer,
    nextWord,
    resetRound,
    getCurrentWord,
    getShuffledLetters,
  } = useGameStore();

  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scoreType, setScoreType] = useState<'correct' | 'wrong' | 'streak'>('correct');

  const currentWord = getCurrentWord();

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  // 更新字母
  useEffect(() => {
    if (phase === 'SHOW_WORD' && currentWord) {
      setShuffledLetters(getShuffledLetters());
      // 自动切换到输入阶段
      const timer = setTimeout(() => {
        useGameStore.setState({ phase: 'USER_INPUT' });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, currentWord, getShuffledLetters]);

  // 显示分数弹出
  useEffect(() => {
    if (phase === 'CHECK_ANSWER') {
      const isCorrect = selectedLetters.join('') === currentWord?.word;
      setScoreType(isCorrect ? (streak >= 3 ? 'streak' : 'correct') : 'wrong');
      setShowScorePopup(true);
      const timer = setTimeout(() => setShowScorePopup(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, selectedLetters, currentWord, streak]);

  const handleSubmit = useCallback(() => {
    submitAnswer();
  }, [submitAnswer]);

  const handleNext = useCallback(() => {
    nextWord();
  }, [nextWord]);

  const handleReset = useCallback(() => {
    resetRound();
    initGame();
  }, [resetRound, initGame]);

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'USER_INPUT') {
        if (e.key === 'Enter') {
          handleSubmit();
        } else if (e.key === 'Backspace') {
          removeLetter(selectedLetters.length - 1);
        }
      } else if (phase === 'CHECK_ANSWER') {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNext();
        }
      } else if (phase === 'SHOW_WORD') {
        if (e.key === 'Enter' || e.key === ' ') {
          // 开始输入
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleSubmit, handleNext, removeLetter, selectedLetters.length]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 relative z-10">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-bold text-lg">
            {score} 分
          </span>
          {streak > 0 && (
            <span className="text-orange-400 text-sm">
              {streak} 连击
            </span>
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <ProgressBar
          current={currentWordIndex}
          total={shuffledWordIds.length}
          label="学习进度"
          color="yellow"
        />
      </div>

      {/* 游戏区域 */}
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AnimatePresence mode="wait">
          {phase === 'SHOW_WORD' && currentWord && (
            <motion.div
              key="show-word"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-8"
            >
              {/* 单词卡片 */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
                <h2 className="text-5xl font-bold text-white mb-2"
                  style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
                  {currentWord.word}
                </h2>
                <p className="text-purple-300 text-xl">{currentWord.meaning}</p>
                {currentWord.phonetic && (
                  <p className="text-white/50 text-sm mt-2">{currentWord.phonetic}</p>
                )}
              </div>
              <p className="text-white/50 text-sm animate-pulse">
                点击字母组成这个单词
              </p>
            </motion.div>
          )}

          {phase === 'USER_INPUT' && currentWord && (
            <motion.div
              key="user-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <LetterPuzzle
                letters={shuffledLetters}
                selectedLetters={selectedLetters}
                onSelect={selectLetter}
                onRemove={removeLetter}
              />

              <div className="flex gap-4 mt-8 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSelection}
                  className="px-6 py-3 bg-white/10 text-white rounded-full"
                >
                  <RotateCcw size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={selectedLetters.length !== currentWord.word.length}
                  className={`
                    px-8 py-3 rounded-full font-bold
                    ${selectedLetters.length === currentWord.word.length
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }
                  `}
                >
                  <Check size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 'CHECK_ANSWER' && currentWord && (
            <motion.div
              key="check-answer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <LetterPuzzle
                letters={shuffledLetters}
                selectedLetters={selectedLetters}
                onSelect={() => {}}
                onRemove={() => {}}
                disabled={true}
                showResult={true}
                correctLetters={correctLetters}
              />

              {/* 结果反馈 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`
                  mt-8 p-4 rounded-2xl text-center
                  ${selectedLetters.join('') === currentWord.word
                    ? 'bg-green-500/20 border border-green-400/50'
                    : 'bg-red-500/20 border border-red-400/50'
                  }
                `}
              >
                {selectedLetters.join('') === currentWord.word ? (
                  <p className="text-green-300 font-bold text-lg">
                    正确! {streak >= 3 && '🔥 连击!'}
                  </p>
                ) : (
                  <p className="text-red-300 font-bold text-lg">
                    正确答案是: {currentWord.word}
                  </p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-full mx-auto flex items-center gap-2"
              >
                下一个
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {phase === 'RESULT' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-4">本轮结束!</h2>
                <div className="space-y-2 mb-6">
                  <p className="text-white/70">
                    正确率: <span className="text-yellow-400 font-bold">{roundCorrect}/{roundTotal}</span>
                  </p>
                  <p className="text-white/70">
                    获得分数: <span className="text-yellow-400 font-bold">+{score}</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full"
                  >
                    再学一轮
                  </motion.button>
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/10 text-white font-bold rounded-full"
                    >
                      返回首页
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 分数弹出 */}
      <ScorePopup
        score={scoreType === 'wrong' ? -10 : 100 + (streak > 1 ? streak * 10 : 0)}
        isVisible={showScorePopup}
        type={scoreType}
      />
    </div>
  );
}
