import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Check, Gavel } from 'lucide-react';
import { Student, AuctionItem } from '../types';
import { STUDENTS_MOCK } from '../constants';

interface AuctionBidDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: AuctionItem | null;
  onConfirm: (studentId: string, bidAmount: number) => void;
}

export default function AuctionBidDrawer({ isOpen, onClose, item, onConfirm }: AuctionBidDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setSelectedId(null);
      setBidAmount(item.currentBid + 100); // Default to current + 100
      setSearchQuery('');
    }
  }, [isOpen, item]);

  const filteredStudents = STUDENTS_MOCK.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isValidBid = item ? bidAmount > item.currentBid : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col rounded-l-[2.5rem] shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">参与竞拍</h2>
                {item && <p className="text-slate-400 text-sm mt-1">拍卖物品: {item.name}</p>}
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Bid Input */}
              <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10">
                <label className="block text-xs font-bold text-brand uppercase tracking-widest mb-3">您的出价 (积分)</label>
                <div className="flex items-center gap-4">
                   <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 flex-1 flex items-center">
                      <span className="text-slate-300 mr-2 font-bold italic">$</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black text-brand outline-none"
                      />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">当前最高</p>
                      <p className="text-sm font-bold text-slate-500">{item?.currentBid} pts</p>
                   </div>
                </div>
                {!isValidBid && <p className="text-[10px] text-red-500 font-bold mt-2 italic">* 出价必须高于当前最高价</p>}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索参与竞拍的学生..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8">
              {filteredStudents.map((student) => {
                const isSelected = selectedId === student.id;
                return (
                  <label 
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-brand-light/30 border-brand/20 shadow-sm' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className={`w-12 h-12 rounded-full border border-slate-100 transition-transform ${isSelected ? 'scale-110' : ''}`} 
                      />
                      <div>
                        <h3 className={`font-bold text-lg leading-none mb-1 transition-colors ${isSelected ? 'text-brand' : 'text-slate-800'}`}>{student.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">{student.class}</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="auction-bid-student" 
                      checked={isSelected}
                      onChange={() => setSelectedId(student.id)}
                      className="w-5 h-5 text-brand border-slate-200 focus:ring-brand focus:ring-offset-0"
                    />
                  </label>
                );
              })}
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 rounded-bl-[2.5rem] flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 bg-white border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button 
                disabled={!selectedId || !isValidBid}
                onClick={() => selectedId && onConfirm(selectedId, bidAmount)}
                className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                  selectedId && isValidBid
                    ? 'bg-brand hover:bg-brand-dark shadow-brand/20' 
                    : 'bg-slate-300 shadow-none cursor-not-allowed text-slate-100'
                }`}
              >
                <Gavel className="w-4 h-4" />
                提交出价
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
