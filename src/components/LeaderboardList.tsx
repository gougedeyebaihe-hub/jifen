import { Student } from '../types';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface LeaderboardListProps {
  students: Student[];
  onStudentClick?: (student: Student) => void;
}

export default function LeaderboardList({ students, onStudentClick }: LeaderboardListProps) {
  // Skipping top 3
  const others = students.slice(3);

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-soft mt-8 border border-white/40">
      <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {others.map((student, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: index * 0.05 }}
            key={student.id}
            onClick={() => onStudentClick?.(student)}
            className="flex items-center justify-between p-4 bg-white/70 rounded-3xl hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-brand/10 hover:shadow-lg hover:shadow-brand/5"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-100/50 text-slate-400 flex items-center justify-center font-black text-lg group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  {index + 4}
                </div>
                {/* Subtle indicator for momentum */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="w-11 h-11 rounded-full bg-white border border-slate-100 shadow-sm" 
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                     <TrendingUp className="w-3 h-3 text-brand" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-lg group-hover:text-brand transition-colors">{student.name}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {student.mode === 'offline' ? '线下学员' : '线上学员'}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-black text-xl italic leading-none">{student.points.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter self-end mb-0.5">pts</span>
              </div>
              <div className="h-1 w-12 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-brand transition-all duration-1000" 
                  style={{ width: `${(student.points / students[0].points) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Decorative summary footer */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of Leaderboard</p>
      </div>
    </div>
  );
}
