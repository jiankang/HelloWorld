import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LetterPuzzleProps {
  letters: string[];
  selectedLetters: string[];
  onSelect: (letter: string) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctLetters?: string[];
}

export default function LetterPuzzle({
  letters,
  selectedLetters,
  onSelect,
  onRemove,
  disabled = false,
  showResult = false,
  correctLetters = [],
}: LetterPuzzleProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* 字母选择区 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {letters.map((letter, index) => {
          const isSelected = selectedLetters.includes(letter);
          const selectedIndex = selectedLetters.indexOf(letter);
          const isInCorrectPosition = showResult && correctLetters[selectedIndex] === letter;

          return (
            <motion.button
              key={`${letter}-${index}`}
              whileHover={{ scale: disabled ? 1 : 1.1 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              onClick={() => !disabled && !isSelected && onSelect(letter)}
              disabled={disabled || isSelected}
              className={`
                w-14 h-14 rounded-xl font-bold text-2xl
                transition-all duration-200
                ${isSelected
                  ? 'bg-purple-500/30 text-purple-300 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }
                ${showResult && !isSelected && correctLetters.includes(letter)
                  ? 'bg-yellow-500/30 text-yellow-300'
                  : ''
                }
                ${isInCorrectPosition
                  ? 'bg-green-500/40 text-green-300 ring-2 ring-green-400'
                  : ''
                }
                shadow-lg
              `}
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
            >
              {letter.toUpperCase()}
            </motion.button>
          );
        })}
      </div>

      {/* 答案区 */}
      <div className="min-h-[70px] bg-white/5 rounded-2xl p-4 flex items-center justify-center">
        {selectedLetters.length === 0 ? (
          <p className="text-white/40 text-lg">点击字母组成单词</p>
        ) : (
          <div className="flex gap-2">
            {selectedLetters.map((letter, index) => (
              <motion.button
                key={`answer-${index}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                onClick={() => !disabled && onRemove(index)}
                disabled={disabled}
                className={`
                  w-12 h-12 rounded-lg font-bold text-xl
                  flex items-center justify-center
                  transition-all duration-200
                  ${showResult
                    ? correctLetters[index] === letter
                      ? 'bg-green-500/50 text-green-200 cursor-default'
                      : 'bg-red-500/50 text-red-200 cursor-default'
                    : 'bg-purple-500/40 text-white hover:bg-red-500/40'
                  }
                `}
              >
                {letter.toUpperCase()}
                {!disabled && !showResult && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={10} />
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
