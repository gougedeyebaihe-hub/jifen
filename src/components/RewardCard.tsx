import { Reward } from '../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface RewardCardProps {
  key?: string | number;
  reward: Reward;
  onRedeem: (reward: Reward) => void;
}

export default function RewardCard({ reward, onRedeem }: RewardCardProps) {
  const IconComponent = reward.icon ? (Icons as any)[reward.icon] : null;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-6 shadow-card flex flex-col justify-between border border-slate-50 transition-all duration-300"
    >
      {reward.image ? (
        <img 
          alt={reward.name} 
          className="w-full h-48 object-cover rounded-2xl mb-4 shadow-sm" 
          src={reward.image} 
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-48 bg-brand-light flex items-center justify-center rounded-2xl mb-4 shadow-sm">
          {IconComponent && <IconComponent className="text-brand w-12 h-12" />}
        </div>
      )}
      
      <div>
        <span className="inline-block bg-slate-100 text-slate-500 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full mb-4 font-bold">
          {reward.category === 'stationery' ? '文具用品' : 
           reward.category === 'campus' ? '校园特权' : 
           reward.category === 'electronics' ? '电子产品' : '其他'}
        </span>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{reward.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{reward.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-brand text-2xl font-bold">
          {reward.points.toLocaleString()} <span className="text-sm font-medium">积分</span>
        </span>
        <button 
          onClick={() => onRedeem(reward)}
          className="bg-brand-light text-brand px-6 py-2 rounded-full text-sm font-bold hover:bg-brand hover:text-white transition-all cursor-pointer"
        >
          兑换
        </button>
      </div>
    </motion.div>
  );
}
