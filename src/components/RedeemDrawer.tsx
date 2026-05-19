import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Check } from 'lucide-react';
import { Student, Reward } from '../types';
import { STUDENTS_MOCK } from '../constants';

interface RedeemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward | null;
  onConfirm: (studentIds: string[]) => void;
}

export default function RedeemDrawer({ isOpen, onClose, reward, onConfirm }: RedeemDrawerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset selection when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
      setSearchQuery('');
    }
  }, [isOpen]);

  const toggleStudent = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const filteredStudents = STUDENTS_MOCK.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col rounded-l-[2.5rem] shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">选择兑换学生</h2>
                {reward && <p className="text-slate-400 text-sm mt-1">兑换物品: {reward.name}</p>}
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索学生姓名..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8">
              {filteredStudents.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <label 
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-brand-light/30 border-brand/20 shadow-sm' 
                        : 'border-slate-100 hover:bg-brand-light/10 hover:border-brand/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className={`w-12 h-12 rounded-full bg-slate-100 border border-slate-100 transition-transform ${isSelected ? 'scale-105' : ''}`} 
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg leading-none mb-1 transition-colors ${isSelected ? 'text-brand' : 'text-slate-800'}`}>{student.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">{student.class}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleStudent(student.id)}
                      className="w-5 h-5 text-brand border-slate-200 focus:ring-brand focus:ring-offset-0 rounded"
                    />
                  </label>
                );
              })}
              {filteredStudents.length === 0 && (
                <div className="py-12 text-center text-slate-400">未找到相关学生</div>
              )}
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 rounded-bl-[2.5rem] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-slate-500">已选择: <span className="text-brand font-bold">{selectedIds.length}</span> 位学生</span>
                {selectedIds.length > 0 && (
                  <button 
                    onClick={() => setSelectedIds([])}
                    className="text-xs text-slate-400 hover:text-red-500 font-bold uppercase tracking-wider"
                  >
                    重置选择
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 bg-white border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  disabled={selectedIds.length === 0}
                  onClick={() => onConfirm(selectedIds)}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
                    selectedIds.length > 0 
                      ? 'bg-brand hover:bg-brand-dark shadow-brand/20' 
                      : 'bg-slate-300 shadow-none cursor-not-allowed text-slate-100'
                  }`}
                >
                  确认兑换
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
