import { motion } from 'framer-motion';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { INTERVALS, getIntervalDescription } from '../utils/spacedRepetition';

export default function Stats() {
  const { words, records, progress } = useGameStore();

  // 计算统计数据
  const totalRecords = Object.keys(records).length;
  const masteredWords = Object.values(records).filter(r => r.熟练度 >= 5).length;
  const learningWords = Object.values(records).filter(r => r.熟练度 >= 2 && r.熟练度 < 5).length;
  const newWords = totalRecords - learningWords - masteredWords;

  // 计算正确率
  let totalCorrect = 0;
  let totalAttempts = 0;
  Object.values(records).forEach(r => {
    totalCorrect += r.正确次数;
    totalAttempts += r.正确次数 + r.错误次数;
  });
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // 熟练度分布
  const proficiencyDistribution = [1, 2, 3, 4, 5, 6].map(level => ({
    level,
    count: Object.values(records).filter(r => r.熟练度 === level).length,
    percentage: totalRecords > 0
      ? Math.round((Object.values(records).filter(r => r.熟练度 === level).length / totalRecords) * 100)
      : 0,
  }));

  const today = new Date().toDateString();
  const isStreakActive = progress.lastStudyDate === today;

  const statCards = [
    {
      icon: Trophy,
      label: '总经验值',
      value: progress.totalXP,
      color: 'text-amber-400',
      bg: 'bg-amber-400/20',
    },
    {
      icon: Flame,
      label: '连续学习',
      value: isStreakActive ? progress.currentStreak : 0,
      unit: '天',
      color: 'text-orange-400',
      bg: 'bg-orange-400/20',
    },
    {
      icon: Target,
      label: '正确率',
      value: accuracyRate,
      unit: '%',
      color: 'text-green-400',
      bg: 'bg-green-400/20',
    },
    {
      icon: TrendingUp,
      label: '已掌握',
      value: masteredWords,
      color: 'text-purple-400',
      bg: 'bg-purple-400/20',
    },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 relative z-10">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">学习统计</h1>
        <p className="text-white/60">追踪你的学习进度</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
              {stat.unit && <span className="text-base text-white/50 ml-1">{stat.unit}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 记忆熟练度分布 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">记忆熟练度分布</h3>

        {totalRecords === 0 ? (
          <p className="text-white/50 text-center py-4">开始学习后查看分布</p>
        ) : (
          <div className="space-y-3">
            {proficiencyDistribution.map(({ level, count, percentage }) => {
              const colors = [
                'from-red-500 to-red-400',
                'from-orange-500 to-orange-400',
                'from-yellow-500 to-yellow-400',
                'from-lime-500 to-lime-400',
                'from-green-500 to-green-400',
                'from-emerald-500 to-emerald-400',
              ];
              const labels = ['陌生', '模糊', '认识', '熟悉', '掌握', '精通'];

              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-12">{labels[level - 1]}</span>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: level * 0.1 }}
                      className={`h-full bg-gradient-to-r ${colors[level - 1]} rounded-full`}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-12 text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 记忆间隔说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-bold text-white mb-4">记忆间隔规律</h3>
        <p className="text-white/60 text-sm mb-4">
          基于艾宾浩斯遗忘曲线，科学安排复习时间:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { level: 1, label: '立即', color: 'bg-red-500' },
            { level: 2, label: '1分钟', color: 'bg-orange-500' },
            { level: 3, label: '10分钟', color: 'bg-yellow-500' },
            { level: 4, label: '1天', color: 'bg-lime-500' },
            { level: 5, label: '3天', color: 'bg-green-500' },
            { level: 6, label: '7天', color: 'bg-emerald-500' },
          ].map(({ level, label, color }) => (
            <div
              key={level}
              className="bg-white/5 rounded-xl p-3 text-center"
            >
              <div className={`w-3 h-3 ${color} rounded-full mx-auto mb-2`} />
              <p className="text-white/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 学习建议 */}
      {totalRecords > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl"
        >
          <h4 className="text-white font-bold mb-2">学习建议</h4>
          <p className="text-white/70 text-sm">
            {masteredWords < 10
              ? '继续努力!你已经记住了部分单词，保持每日复习的好习惯。'
              : masteredWords < 30
              ? '太棒了!你已经掌握了不少单词，继续保持这个节奏!'
              : '你已经是一个单词大师了!定期复习以保持记忆。'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
