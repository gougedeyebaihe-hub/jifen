import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import { Student } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export default function HistoryModal({ isOpen, onClose, student }: HistoryModalProps) {
  // Mock history data
  const mockHistory = [
    { id: 1, label: '作业优秀', value: 5, date: '2024-05-18 14:30', type: 'add' },
    { id: 2, label: '按时签到', value: 2, date: '2024-05-18 08:15', type: 'add' },
    { id: 3, label: 'Lamy 钢笔', value: -1500, date: '2024-05-17 16:45', type: 'consume' },
    { id: 4, label: '阅读打卡', value: 3, date: '2024-05-16 19:20', type: 'add' },
  ];

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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[110] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <img src={student?.avatar} alt={student?.name} className="w-14 h-14 rounded-full border-4 border-white shadow-sm" />
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{student?.name} 的记录</h2>
                  <p className="text-slate-400 text-sm font-medium">查看最近的积分获取与消耗</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="bg-white p-3 rounded-2xl shadow-sm text-slate-400 hover:text-red-500 transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 bg-white px-8 py-6 gap-4 border-b border-slate-50">
               <div className="bg-brand-light/20 p-4 rounded-3xl">
                  <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">当前存量</p>
                  <p className="text-2xl font-black text-brand italic">{student?.points.toLocaleString()} pts</p>
               </div>
               <div className="bg-orange-50/30 p-4 rounded-3xl">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">今日获得</p>
                  <p className="text-2xl font-black text-orange-400 italic">+7 pts</p>
               </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-4 max-h-[400px] custom-scrollbar">
               {mockHistory.map((item) => (
                 <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                         item.type === 'consume' ? 'bg-orange-100 text-orange-500' : 'bg-brand-light text-brand'
                       }`}>
                          {item.type === 'consume' ? <ArrowUpRight className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                       </div>
                       <div>
                          <p className="font-bold text-slate-700">{item.label}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
                             <Calendar className="w-3 h-3" />
                             {item.date}
                          </div>
                       </div>
                    </div>
                    <div className={`text-lg font-black italic ${item.type === 'consume' ? 'text-orange-400' : 'text-brand'}`}>
                       {item.value > 0 ? `+${item.value}` : item.value}
                    </div>
                 </div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-8 pt-0 mt-4">
               <button 
                onClick={onClose}
                className="w-full py-5 bg-brand-dark hover:bg-brand text-white font-black rounded-3xl transition-all shadow-xl shadow-brand/20 active:scale-[0.98]"
               >
                 我知道了
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
