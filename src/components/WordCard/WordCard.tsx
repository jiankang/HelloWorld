import { motion } from 'framer-motion';
import { Word } from '../../types';

interface WordCardProps {
  word: Word;
  showDetails?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function WordCard({
  word,
  showDetails = true,
  onDelete,
  onEdit,
}: WordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-white">{word.word}</h3>
          {word.phonetic && (
            <p className="text-white/50 text-sm">{word.phonetic}</p>
          )}
        </div>
        {(onDelete || onEdit) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-white/50 hover:text-purple-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-white/50 hover:text-red-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-purple-300 font-medium mb-2">{word.meaning}</p>

      {showDetails && word.sentence && (
        <p className="text-white/60 text-sm italic mt-2">
          "{word.sentence}"
        </p>
      )}
    </motion.div>
  );
}
