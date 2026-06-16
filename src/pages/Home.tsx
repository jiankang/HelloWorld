import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Trophy, Flame } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

export default function Home() {
  const { words, progress, getDueWords } = useGameStore();
  const dueWords = getDueWords();

  const today = new Date().toDateString();
  const isStreakActive = progress.lastStudyDate === today;

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 relative z-10">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2"
          style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}>
          记忆星空
        </h1>
        <p className="text-white/60">探索星空，记忆单词</p>
      </motion.div>

      {/* 状态卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-purple-400" size={20} />
            <span className="text-white/70 text-sm">词库总量</span>
          </div>
          <p className="text-3xl font-bold text-white">{words.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-yellow-400" size={20} />
            <span className="text-white/70 text-sm">待复习</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{dueWords.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame className={isStreakActive ? 'text-orange-400' : 'text-white/30'} size={20} />
            <span className="text-white/70 text-sm">连续学习</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {isStreakActive ? progress.currentStreak : 0}
            <span className="text-lg text-white/50 ml-1">天</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-amber-400" size={20} />
            <span className="text-white/70 text-sm">经验值</span>
          </div>
          <p className="text-3xl font-bold text-white">{progress.totalXP}</p>
        </motion.div>
      </div>

      {/* 开始学习按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center"
      >
        <Link
          to="/learn"
          className="group relative w-48 h-48 flex items-center justify-center"
        >
          {/* 背景光晕 */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />

          {/* 按钮 */}
          <div className="relative w-36 h-36 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
            <Sparkles className="text-white" size={48} />
          </div>

          {/* 旋转光环 */}
          <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-full animate-spin-slow" />
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-full shadow-lg"
        >
          <Link to="/learn">开始学习</Link>
        </motion.button>

        <p className="text-white/50 text-sm mt-3">
          {dueWords.length > 0
            ? `你有 ${dueWords.length} 个单词需要复习`
            : '今天没有待复习单词'}
        </p>
      </motion.div>

      {/* 装饰性星星 */}
      <div className="absolute top-20 left-8 w-2 h-2 bg-white rounded-full animate-pulse opacity-50" />
      <div className="absolute top-32 right-12 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute top-48 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-60" />
    </div>
  );
}
