import { motion } from 'framer-motion';
import { Volume2, VolumeX, RefreshCw, Trash2, Github } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { defaultWords } from '../data/defaultWords';

export default function Settings() {
  const { settings, toggleSound, words, progress, records } = useGameStore();

  const handleResetData = () => {
    if (confirm('确定要重置所有学习数据吗?这将清除你的学习进度和自定义单词。')) {
      localStorage.removeItem('memory_star_words');
      localStorage.removeItem('memory_star_records');
      localStorage.removeItem('memory_star_progress');
      window.location.reload();
    }
  };

  const handleRestoreDefaultWords = () => {
    if (confirm('确定要恢复默认词库吗?这将覆盖当前所有单词。')) {
      localStorage.setItem('memory_star_words', JSON.stringify(defaultWords));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 relative z-10">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">设置</h1>
        <p className="text-white/60">个性化你的学习体验</p>
      </motion.div>

      {/* 设置项 */}
      <div className="space-y-4">
        {/* 声音设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? (
              <Volume2 className="text-purple-400" size={24} />
            ) : (
              <VolumeX className="text-white/40" size={24} />
            )}
            <div>
              <p className="text-white font-medium">音效</p>
              <p className="text-white/50 text-sm">游戏音效和反馈声音</p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`
              relative w-12 h-7 rounded-full transition-colors
              ${settings.soundEnabled ? 'bg-purple-500' : 'bg-white/20'}
            `}
          >
            <motion.div
              animate={{ x: settings.soundEnabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
        </motion.div>

        {/* 数据管理 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <h3 className="text-white font-medium mb-4">数据管理</h3>

          <div className="space-y-3">
            <button
              onClick={handleRestoreDefaultWords}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-3 text-white/80 transition-colors"
            >
              <RefreshCw size={20} className="text-purple-400" />
              <span>恢复默认词库</span>
            </button>

            <button
              onClick={handleResetData}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-3 text-red-400 transition-colors"
            >
              <Trash2 size={20} />
              <span>重置所有数据</span>
            </button>
          </div>
        </motion.div>

        {/* 学习统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <h3 className="text-white font-medium mb-4">学习统计</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">当前词库</span>
              <span className="text-white">{words.length} 个单词</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">学习记录</span>
              <span className="text-white">{Object.keys(records).length} 条</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">获得经验</span>
              <span className="text-yellow-400">{progress.totalXP} XP</span>
            </div>
          </div>
        </motion.div>

        {/* 关于 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
        >
          <h3 className="text-white font-medium mb-4">关于</h3>
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-1">记忆星空</h4>
            <p className="text-white/50 text-sm mb-3">探索星空，记忆单词</p>
            <p className="text-white/40 text-xs">
              基于艾宾浩斯遗忘曲线设计的背单词游戏
            </p>
            <p className="text-white/30 text-xs mt-2">
              v1.0.0 Demo
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
