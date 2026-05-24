import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Zap, ArrowUpRight, Palette, Check } from 'lucide-react';
import { Student } from '../types';
import { toast } from 'sonner';
import { CREATIVE_AVATARS, CreativeAvatar } from './AvatarShop';
 
interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  pointLogs?: any[];
  onEquipAvatar?: (studentId: string, avatarUrl: string) => void;
  creativeAvatars?: CreativeAvatar[];
}

export default function HistoryModal({ isOpen, onClose, student, pointLogs = [], onEquipAvatar, creativeAvatars }: HistoryModalProps) {
  const avatarsList = creativeAvatars || CREATIVE_AVATARS;

  // Filter logs for this specific student
  const studentLogs = student 
    ? pointLogs.filter(log => log.studentName === student.name)
    : [];

  // Calculate today's rewards/deductions
  const todayStr = new Date().toISOString().slice(0, 10); // "2026-05-22"
  const todayPoints = studentLogs
    .filter(log => log.time.startsWith(todayStr) && log.points > 0)
    .reduce((sum, log) => sum + log.points, 0);

  // List of unlocked avatars for clothes rack
  const unlockedAvatarsList = student?.unlockedAvatars || (student ? [student.avatar] : []);

  // Compute dynamic avatar animation for current equipped one
  const currentAvatarConfig = student
    ? avatarsList.find(av => av.avatarUrl === student.avatar)
    : null;
  const currentAnimClass = currentAvatarConfig
    ? (currentAvatarConfig.animationType === 'float' ? 'animate-avatar-float' :
       currentAvatarConfig.animationType === 'wobble' ? 'animate-avatar-wobble' :
       currentAvatarConfig.animationType === 'pulse' ? 'animate-avatar-pulse-subtle' :
       currentAvatarConfig.animationType === 'spin' ? 'animate-avatar-spin-slow' : '')
    : '';

  const handleSelectAvatar = (url: string) => {
    if (!student || !onEquipAvatar) return;
    if (student.avatar === url) return;

    onEquipAvatar(student.id, url);
    toast.success('形象切换成功！', {
      description: `${student.name} 已成功配戴该创意装扮 🎨`,
      duration: 1500
    });
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[110] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={student?.avatar} alt={student?.name} className={`w-16 h-16 rounded-full border-4 border-white shadow-md bg-slate-100 ${currentAnimClass}`} referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1 rounded-full border border-white">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{student?.name} 的记录</h2>
                  <p className="text-slate-400 text-sm font-medium">查看积分明细与专属创意换装</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="bg-white p-3 rounded-2xl shadow-sm text-slate-400 hover:text-red-500 transition-all hover:rotate-90 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 bg-white px-8 py-5 gap-4 border-b border-slate-50 shrink-0">
               <div className="bg-brand-light/30 p-4 rounded-3xl">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-0.5">当前存量</p>
                  <p className="text-2xl font-black text-brand italic">{student?.points.toLocaleString()} pts</p>
               </div>
               <div className="bg-amber-50/50 p-4 rounded-3xl">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">今日累计获得</p>
                  <p className="text-2xl font-black text-amber-600 italic">+{todayPoints} pts</p>
               </div>
            </div>

            {/* Wardrobe Segment */}
            <div className="bg-slate-50/80 border-b border-slate-100/50 p-6 px-8 shrink-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-teal-500" />
                <span>我的专享创意衣橱 ({unlockedAvatarsList.length} 件装扮)</span>
              </p>
              
              <div className="flex gap-3 overflow-x-auto py-1 px-1 no-scrollbar scroll-smooth">
                {unlockedAvatarsList.map((url, index) => {
                  const isCurrent = student?.avatar === url;
                  const itemConfig = avatarsList.find(av => av.avatarUrl === url);
                  const itemAnimClass = itemConfig
                    ? (itemConfig.animationType === 'float' ? 'animate-avatar-float' :
                       itemConfig.animationType === 'wobble' ? 'animate-avatar-wobble' :
                       itemConfig.animationType === 'pulse' ? 'animate-avatar-pulse-subtle' :
                       itemConfig.animationType === 'spin' ? 'animate-avatar-spin-slow' : '')
                    : '';
                  return (
                    <div
                      key={index}
                      onClick={() => handleSelectAvatar(url)}
                      className={`relative shrink-0 w-14 h-14 rounded-full p-0.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-4 ring-teal-500 ring-offset-2 scale-105 shadow-md shadow-teal-500/10'
                          : 'hover:scale-105 hover:bg-slate-200 bg-slate-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt="Unlocked option"
                        className={`w-full h-full rounded-full object-cover bg-white border border-slate-200 ${itemAnimClass}`}
                        referrerPolicy="no-referrer"
                      />
                      {isCurrent && (
                        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center p-0.5 border border-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                * 点击上方头像可以在我的个人主页以及排行榜上立即切换佩戴该创意形象。
              </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-4 max-h-[300px] custom-scrollbar">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">积分增减流转账单</p>
               {studentLogs.map((item) => (
                 <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                         item.points < 0 ? 'bg-orange-100 text-orange-500' : 'bg-brand-light text-brand'
                       }`}>
                          {item.points < 0 ? <ArrowUpRight className="w-5 h-5 rotate-90" /> : <Zap className="w-5 h-5" />}
                       </div>
                       <div>
                          <p className="font-bold text-slate-700 text-sm leading-tight">{item.activity}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-1">
                             <Calendar className="w-3 h-3" />
                             {item.time}
                          </div>
                       </div>
                    </div>
                    <div className={`text-base font-black italic ${item.points < 0 ? 'text-orange-400' : 'text-brand'}`}>
                       {item.points > 0 ? `+${item.points}` : item.points} pts
                    </div>
                 </div>
               ))}

               {studentLogs.length === 0 && (
                 <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                   暂无最近积分增减及流转账单日志
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-8 pt-4 shrink-0 bg-slate-50/40 border-t border-slate-50">
               <button 
                onClick={onClose}
                className="w-full py-4.5 bg-brand-dark hover:bg-brand text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-brand/10 active:scale-[0.98] cursor-pointer"
               >
                 查看完毕 (确 认)
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
