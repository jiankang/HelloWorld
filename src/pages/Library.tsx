import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import WordCard from '../components/WordCard/WordCard';

export default function Library() {
  const { words, addWord, deleteWord, updateWord } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWord, setEditingWord] = useState<string | null>(null);

  // 新增/编辑表单状态
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    sentence: '',
    phonetic: '',
  });

  const filteredWords = words.filter(
    w =>
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.includes(searchQuery)
  );

  const handleAddWord = () => {
    if (!formData.word.trim() || !formData.meaning.trim()) return;

    addWord({
      word: formData.word.trim().toLowerCase(),
      meaning: formData.meaning.trim(),
      sentence: formData.sentence.trim() || undefined,
      phonetic: formData.phonetic.trim() || undefined,
    });

    setFormData({ word: '', meaning: '', sentence: '', phonetic: '' });
    setShowAddModal(false);
  };

  const handleEditWord = (id: string) => {
    const word = words.find(w => w.id === id);
    if (!word) return;

    setFormData({
      word: word.word,
      meaning: word.meaning,
      sentence: word.sentence || '',
      phonetic: word.phonetic || '',
    });
    setEditingWord(id);
  };

  const handleSaveEdit = () => {
    if (!editingWord || !formData.word.trim() || !formData.meaning.trim()) return;

    updateWord(editingWord, {
      word: formData.word.trim().toLowerCase(),
      meaning: formData.meaning.trim(),
      sentence: formData.sentence.trim() || undefined,
      phonetic: formData.phonetic.trim() || undefined,
    });

    setFormData({ word: '', meaning: '', sentence: '', phonetic: '' });
    setEditingWord(null);
  };

  const handleDeleteWord = (id: string) => {
    if (confirm('确定要删除这个单词吗?')) {
      deleteWord(id);
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
        <h1 className="text-3xl font-bold text-white mb-2">词库管理</h1>
        <p className="text-white/60">共 {words.length} 个单词</p>
      </motion.div>

      {/* 搜索栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索单词..."
          className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
        />
      </motion.div>

      {/* 添加按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAddModal(true)}
        className="w-full mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center gap-2 text-purple-300 hover:border-purple-400 transition-colors"
      >
        <Plus size={20} />
        添加新单词
      </motion.button>

      {/* 单词列表 */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.03 }}
            >
              <WordCard
                word={word}
                onEdit={() => handleEditWord(word.id)}
                onDelete={() => handleDeleteWord(word.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredWords.length === 0 && (
          <p className="text-center text-white/40 py-8">
            {searchQuery ? '没有找到匹配的单词' : '词库为空，添加一些单词吧!'}
          </p>
        )}
      </div>

      {/* 添加/编辑模态框 */}
      <AnimatePresence>
        {(showAddModal || editingWord) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingWord(null);
              setFormData({ word: '', meaning: '', sentence: '', phonetic: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900/90 border border-white/20 rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingWord ? '编辑单词' : '添加新单词'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingWord(null);
                    setFormData({ word: '', meaning: '', sentence: '', phonetic: '' });
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-1">单词 *</label>
                  <input
                    type="text"
                    value={formData.word}
                    onChange={e => setFormData({ ...formData, word: e.target.value })}
                    placeholder="apple"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm block mb-1">中文释义 *</label>
                  <input
                    type="text"
                    value={formData.meaning}
                    onChange={e => setFormData({ ...formData, meaning: e.target.value })}
                    placeholder="苹果"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm block mb-1">音标 (可选)</label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={e => setFormData({ ...formData, phonetic: e.target.value })}
                    placeholder="/ˈæpl/"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm block mb-1">例句 (可选)</label>
                  <input
                    type="text"
                    value={formData.sentence}
                    onChange={e => setFormData({ ...formData, sentence: e.target.value })}
                    placeholder="An apple a day keeps the doctor away."
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={editingWord ? handleSaveEdit : handleAddWord}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full"
                >
                  {editingWord ? '保存修改' : '添加单词'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
