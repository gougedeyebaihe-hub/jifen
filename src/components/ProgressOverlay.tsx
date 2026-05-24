import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Sparkles, RefreshCw, Trash2, ShieldCheck, Check } from 'lucide-react';

interface ProgressOverlayProps {
  isOpen: boolean;
  type: 'submit' | 'edit' | 'delete' | 'sync' | 'load';
  title: string;
  statusText?: string;
  onComplete: () => void;
}

export default function ProgressOverlay({
  isOpen,
  type,
  title,
  statusText = '正在同步数据...',
  onComplete,
}: ProgressOverlayProps) {
  const [progressVal, setProgressVal] = useState(0);
  const [phaseText, setPhaseText] = useState('开始传输事务...');

  useEffect(() => {
    if (!isOpen) {
      setProgressVal(0);
      return;
    }

    setProgressVal(0);
    setPhaseText('开始验证请求安全性...');

    const duration = type === 'delete' ? 700 : type === 'edit' ? 850 : 1000;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / totalSteps;
      
      // Add a slight realistic organic slowing down near the end
      let nextProgress = Math.min(Math.round(ratio * 100), 100);
      
      setProgressVal(nextProgress);

      // Phase descriptive translation that feels both authentic and visual-heavy
      if (nextProgress < 30) {
        setPhaseText('正在传输业务加密负载...');
      } else if (nextProgress < 65) {
        setPhaseText(type === 'delete' ? '正在执行节点数据擦除并刷新关联图档...' : '正在封包数据格式并提交底层持久层存储...');
      } else if (nextProgress < 90) {
        setPhaseText('正在校验主副本一致性并清除前端缓存...');
      } else if (nextProgress < 100) {
        setPhaseText('正在完成操作，准备刷新视图界面...');
      } else {
        setPhaseText('事务提交成功！全站已同步刷新。');
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 150); // Small delay to let the user admire the 100% completion glow
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, type, onComplete]);

  // Icons mapper for high-fidelity representation
  const renderIcon = () => {
    const iconClass = "w-7 h-7 stroke-[2.2px]";
    switch (type) {
      case 'submit':
        return <Database className={`${iconClass} text-indigo-500`} />;
      case 'edit':
        return <RefreshCw className={`${iconClass} text-violet-500 animate-[spin_3s_linear_infinite]`} />;
      case 'delete':
        return <Trash2 className={`${iconClass} text-rose-500`} />;
      case 'sync':
        return <Sparkles className={`${iconClass} text-amber-500`} />;
      default:
        return <ShieldCheck className={`${iconClass} text-indigo-500`} />;
    }
  };

  const gradientStyles = {
    submit: 'from-indigo-500 via-indigo-600 to-cyan-500',
    edit: 'from-violet-500 via-fuchsia-500 to-rose-500',
    delete: 'from-red-500 via-rose-500 to-orange-500',
    sync: 'from-amber-400 via-yellow-500 to-orange-500',
    load: 'from-sky-500 to-indigo-600'
  }[type];

  const badgeBg = {
    submit: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    edit: 'bg-violet-50 border-violet-100 text-violet-700',
    delete: 'bg-rose-50 border-rose-100 text-rose-700',
    sync: 'bg-amber-50 border-amber-100 text-amber-700',
    load: 'bg-sky-50 border-sky-100 text-sky-700',
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Core HUD Progress Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full overflow-hidden text-center flex flex-col items-center"
          >
            {/* Top Glowing Ambient Accents */}
            <div className={`absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r ${gradientStyles}`} />

            {/* Icon housing */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${badgeBg} mb-6 shadow-xs`}>
              {renderIcon()}
            </div>

            {/* Formatted Titles */}
            <span className={`text-[11px] uppercase tracking-widest font-black inline-block px-3 py-1 rounded-full border mb-3 ${badgeBg}`}>
              {type === 'submit' ? '新数据提交' : type === 'edit' ? '数据修改更新' : type === 'delete' ? '数据安全擦除' : '多端事务同步'}
            </span>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight px-2">
              {title}
            </h3>

            {/* Percentage Display */}
            <div className="my-8 relative flex items-center justify-center">
              <span className={`text-6xl font-black tracking-tighter bg-gradient-to-r ${gradientStyles} bg-clip-text text-transparent select-none`}>
                {progressVal}%
              </span>
            </div>

            {/* Outer Track */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden mb-4 p-0.5 border border-slate-200/50">
              {/* Inner Progress Stream */}
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradientStyles} shadow-sm transition-all duration-75 relative`}
                style={{ width: `${progressVal}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
              </div>
            </div>

            {/* State indicators - avoid unrequested metadata like container ports */}
            <p className="text-xs font-semibold text-slate-500 tracking-tight min-h-[16px]">
              {phaseText}
            </p>

            <p className="text-[10px] font-medium text-slate-400 mt-2 select-none">
              {statusText}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
