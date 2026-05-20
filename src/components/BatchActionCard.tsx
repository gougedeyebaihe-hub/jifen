import { useState } from 'react';
import { Student, PointItem } from '../types';
import { MousePointer2, CheckCircle2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface BatchActionCardProps {
  key?: string | number;
  student: Student;
  pointItems?: PointItem[];
  onQuickAdd: (id: string, points: number, reason?: string) => void;
  onViewHistory: (student: Student) => void;
}

export default function BatchActionCard({ student, pointItems, onQuickAdd, onViewHistory }: BatchActionCardProps) {
  // Map dynamic point items or fallback to student activities
  const activeActivities = pointItems && pointItems.length > 0
    ? pointItems.filter(p => p.type === 'default').map(p => ({ label: p.label, value: p.value }))
    : (student.activities || []);

  const [selectedActivities, setSelectedActivities] = useState<number[]>(
    activeActivities.map((_, i) => i)
  );

  const toggleActivity = (idx: number) => {
    setSelectedActivities(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const currentTotal = selectedActivities.reduce((acc, idx) => {
    return acc + (activeActivities[idx]?.value || 0);
  }, 0);

  const hasPoints = activeActivities.length > 0;

  const handleSend = () => {
    const selectedLabels = selectedActivities
      .map(idx => activeActivities[idx]?.label)
      .filter(Boolean)
      .join(' & ');
    onQuickAdd(student.id, currentTotal, selectedLabels || '快捷部分加分');
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-[2rem] p-6 shadow-card border border-slate-50 min-w-[280px] flex flex-col h-full relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-full border-2 border-brand-light shadow-sm" />
          <div>
            <h3 className="font-bold text-slate-800 text-xl">{student.name}</h3>
            <p className="text-slate-400 text-xs font-medium">{student.mode === 'offline' ? '线下课程' : '线上课程'}</p>
          </div>
        </div>
        <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center text-[8px] text-white">★</span>
          {student.points.toLocaleString()}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {hasPoints ? (
          <>
            <div className="flex items-center gap-2 text-slate-400 text-xs text-brand/60">
              <MousePointer2 className="w-3 h-3" />
              <span>默认加分项 (多选)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activeActivities.map((act, idx) => {
                const isSelected = selectedActivities.includes(idx);
                return (
                  <button 
                    key={idx} 
                    onClick={() => toggleActivity(idx)}
                    className={`p-2 rounded-xl text-xs flex justify-between items-center transition-all border ${
                      isSelected 
                        ? 'bg-brand/10 border-brand/20 text-brand-dark' 
                        : 'bg-slate-50/50 border-transparent text-slate-400 grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-1 overflow-hidden">
                      {isSelected && <Check className="w-2 h-2 shrink-0" />}
                      <span className="truncate">{act.label}</span>
                    </div>
                    <span className="font-bold shrink-0">+{act.value}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 text-slate-300">
            <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-100" />
            <p className="text-xs font-medium">今日分数已发放完毕</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="text-slate-800">
          <span className="text-xs text-slate-400 block">本次共计:</span>
          <span className={`text-xl font-bold ${currentTotal > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
            {currentTotal > 0 ? `+${currentTotal}` : '0'}
          </span>
        </div>
        
        {hasPoints ? (
          <button 
            onClick={handleSend}
            disabled={currentTotal === 0}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
              currentTotal > 0 
                ? 'bg-brand-dark text-white hover:bg-brand shadow-brand/20' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            一键发放
          </button>
        ) : (
          <button 
            onClick={() => onViewHistory(student)}
            className="text-brand text-sm font-bold hover:underline cursor-pointer"
          >
            查看记录
          </button>
        )}
      </div>
    </motion.div>
  );
}
