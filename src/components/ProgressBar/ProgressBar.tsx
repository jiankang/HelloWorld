import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: 'yellow' | 'purple' | 'green';
}

export default function ProgressBar({
  current,
  total,
  label,
  color = 'yellow',
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const colorClasses = {
    yellow: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    green: 'bg-gradient-to-r from-green-400 to-emerald-500',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/70">{label}</span>
          <span className="text-white font-medium">
            {current}/{total}
          </span>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
}
