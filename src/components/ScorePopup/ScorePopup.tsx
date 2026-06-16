import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ScorePopupProps {
  score: number;
  isVisible: boolean;
  type: 'correct' | 'wrong' | 'streak';
}

export default function ScorePopup({ score, isVisible, type }: ScorePopupProps) {
  const config = {
    correct: {
      icon: Sparkles,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-400/50',
    },
    wrong: {
      icon: Sparkles,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-400/50',
    },
    streak: {
      icon: Sparkles,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-400/50',
    },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={`
            fixed top-1/3 left-1/2 -translate-x-1/2
            ${bg} ${border} border-2 rounded-2xl px-6 py-4
            backdrop-blur-md shadow-2xl
            z-50
          `}
        >
          <div className="flex items-center gap-3">
            <Icon className={`${color}`} size={28} />
            <div>
              <p className={`${color} font-bold text-xl`}>
                {type === 'correct' && '+'}
                {type === 'wrong' && '-'}
                {score}
              </p>
              {type === 'streak' && (
                <p className="text-yellow-300/80 text-sm">连续答对!</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
