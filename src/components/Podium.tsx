import { Student } from '../types';
import { motion } from 'motion/react';
import { Trophy, Crown, Medal } from 'lucide-react';
import { CREATIVE_AVATARS, CreativeAvatar } from './AvatarShop';

interface PodiumProps {
  topStudents: Student[];
  onStudentClick?: (student: Student) => void;
  creativeAvatars?: CreativeAvatar[];
}

export default function Podium({ topStudents, onStudentClick, creativeAvatars }: PodiumProps) {
  const avatarsList = creativeAvatars || CREATIVE_AVATARS;
  const sorted = [...topStudents].sort((a, b) => b.points - a.points);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const getAnimClass = (avatarUrl: string) => {
    const matched = avatarsList.find(av => av.avatarUrl === avatarUrl);
    return matched
      ? (matched.animationType === 'float' ? 'animate-avatar-float' :
         matched.animationType === 'wobble' ? 'animate-avatar-wobble' :
         matched.animationType === 'pulse' ? 'animate-avatar-pulse-subtle' :
         matched.animationType === 'spin' ? 'animate-avatar-spin-slow' : '')
      : '';
  };

  return (
    <div className="flex items-end justify-center gap-2 mt-20 mb-10 h-72 relative">
      {/* 2nd Place */}
      {second && (
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStudentClick?.(second)}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center group relative cursor-pointer"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-slate-200 p-1 bg-white overflow-hidden shadow-xl transform group-hover:scale-110 transition-transform">
              <img src={second.avatar} alt={second.name} className={`w-full h-full object-cover rounded-full ${getAnimClass(second.avatar)}`} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
              <Medal className="w-6 h-6 text-slate-500" />
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 shadow-soft w-32 text-center border border-white">
            <h3 className="font-black text-slate-800 text-sm truncate">{second.name}</h3>
            <p className="text-slate-400 text-xs font-bold mt-1 italic">{second.points.toLocaleString()} pts</p>
          </div>
          {/* Base */}
          <div className="h-20 w-36 bg-slate-200/50 rounded-t-3xl mt-4 backdrop-blur-sm border-x border-t border-white/40 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
             <span className="text-4xl font-black text-slate-300 group-hover:text-slate-400">2</span>
          </div>
        </motion.div>
      )}

      {/* 1st Place - The Champion */}
      {first && (
        <motion.div 
          initial={{ y: 0, scale: 0.8, opacity: 0 }}
          animate={{ y: -20, scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStudentClick?.(first)}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-center group z-20 relative px-4 cursor-pointer"
        >
          {/* Shine Effect Background */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative mb-8">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 z-10"
            >
              <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-xl" />
            </motion.div>
            
            <div className="w-32 h-32 rounded-full border-8 border-brand-light p-1 bg-white overflow-hidden shadow-2xl transform group-hover:scale-110 transition-transform">
              <img src={first.avatar} alt={first.name} className={`w-full h-full object-cover rounded-full ${getAnimClass(first.avatar)}`} />
            </div>
            
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand text-white px-4 py-1.5 rounded-full shadow-lg border-4 border-white flex items-center gap-1">
               <Trophy className="w-4 h-4" />
               <span className="text-[10px] font-black italic tracking-widest uppercase">Champion</span>
            </div>
          </div>

          <div className="bg-brand text-white rounded-3xl p-5 shadow-xl w-44 text-center border-2 border-brand-light shadow-brand/20 relative z-10 group-hover:bg-brand-dark transition-colors">
            <h3 className="font-black text-white text-lg truncate drop-shadow-sm">{first.name}</h3>
            <p className="text-brand-light text-sm font-black mt-1 italic tracking-wider">{first.points.toLocaleString()} pts</p>
          </div>

          {/* Base */}
          <div className="h-32 w-48 bg-brand-dark rounded-t-[2.5rem] mt-6 shadow-2xl relative overflow-hidden flex items-center justify-center border-t-2 border-brand-light/30 group-hover:bg-brand transition-colors">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand/0 to-white/10 opacity-30" />
             <span className="text-7xl font-black text-white/10 italic">1</span>
          </div>
        </motion.div>
      )}

      {/* 3rd Place */}
      {third && (
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStudentClick?.(third)}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center group relative cursor-pointer"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-orange-100 p-1 bg-white overflow-hidden shadow-xl transform group-hover:scale-110 transition-transform">
              <img src={third.avatar} alt={third.name} className={`w-full h-full object-cover rounded-full ${getAnimClass(third.avatar)}`} />
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
              <Medal className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 shadow-soft w-32 text-center border border-white">
            <h3 className="font-black text-slate-800 text-sm truncate">{third.name}</h3>
            <p className="text-slate-400 text-xs font-bold mt-1 italic">{third.points.toLocaleString()} pts</p>
          </div>
           {/* Base */}
           <div className="h-16 w-36 bg-orange-50/50 rounded-t-3xl mt-4 backdrop-blur-sm border-x border-t border-white/40 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
             <span className="text-4xl font-black text-orange-200 group-hover:text-orange-300">3</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
