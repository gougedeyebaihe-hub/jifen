import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lock, CheckCircle2, Coins, Search, X, Check, Palette } from 'lucide-react';
import { Student } from '../types';

export interface CreativeAvatar {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  avatarUrl: string;
  theme: string; // Tailwind gradient to-from
  animationType?: 'float' | 'wobble' | 'pulse' | 'spin' | 'none';
  badge?: string;
}

export const CREATIVE_AVATARS: CreativeAvatar[] = [
  {
    id: 'av-pikachu',
    name: '⚡️ 闪电皮卡丘 (动态GIF)',
    description: '电击十万伏特，散发黄色荧光电火花，让学习动力瞬间充满！',
    pointsCost: 750,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
    theme: 'from-amber-400 to-yellow-500',
    animationType: 'none',
    badge: '终极闪电'
  },
  {
    id: 'av-eevee',
    name: '🦊 幻面小伊布 (动态GIF)',
    description: '拥有多种进化可能性的神奇伊布，元气灵动，充满无限未知潜力！',
    pointsCost: 900,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif',
    theme: 'from-orange-300 to-amber-600',
    animationType: 'none',
    badge: '幻变潜能'
  },
  {
    id: 'av-psyduck',
    name: '🦆 呆呆可达鸭 (动态GIF)',
    description: '抱着脑袋摇摇晃晃的呆呆鸭，关键时刻脑力爆发突破难关！',
    pointsCost: 800,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/54.gif',
    theme: 'from-yellow-300 to-yellow-500',
    animationType: 'none',
    badge: '念力波动'
  },
  {
    id: 'av-snorlax',
    name: '💤 呼呼大卡比 (动态GIF)',
    description: '吃饱睡足、超级稳重的大卡比兽，是班级里让人无比安心的存在。',
    pointsCost: 1000,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif',
    theme: 'from-teal-600 to-slate-700',
    animationType: 'none',
    badge: '沉睡巨兽'
  },
  {
    id: 'av-gengar',
    name: '😈 邪魅鬼小耿 (动态GIF)',
    description: '吐着红舌头恶作剧的紫色小耿鬼，让你的日常充满超自然炫酷！',
    pointsCost: 1200,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif',
    theme: 'from-purple-600 to-indigo-950',
    animationType: 'none',
    badge: '暗影奇袭'
  },
  {
    id: 'av-jigglypuff',
    name: '🎵 歌姬小胖丁 (动态GIF)',
    description: '拿着麦克风唱起治愈歌谣的粉红胖丁，带走脑中所有嘈杂杂念！',
    pointsCost: 1050,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/39.gif',
    theme: 'from-pink-300 to-rose-400',
    animationType: 'none',
    badge: '催眠魔音'
  },
  {
    id: 'av-squirtle',
    name: '🐢 冲锋杰尼龟 (动态GIF)',
    description: '戴着酷炫墨镜极速奔跑的杰尼龟，冲散所有学习上的挫折！',
    pointsCost: 850,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif',
    theme: 'from-sky-300 to-blue-500',
    animationType: 'none',
    badge: '激流冲浪'
  },
  {
    id: 'av-bulbasaur',
    name: '🍃 治愈妙蛙花 (动态GIF)',
    description: '背上绽放青翠花瓣的乖巧妙蛙，随时为你播撒轻松绿意！',
    pointsCost: 850,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif',
    theme: 'from-emerald-400 to-teal-600',
    animationType: 'none',
    badge: '阳光烈焰'
  },
  {
    id: 'av-charmander',
    name: '🔥 喷火小火龙 (动态GIF)',
    description: '尾尖跃动着永不熄灭炽热火焰的小幼龙，点燃最执着的战斗激情！',
    pointsCost: 1100,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif',
    theme: 'from-orange-400 to-red-500',
    animationType: 'none',
    badge: '炽热火花'
  },
  {
    id: 'av-mew',
    name: '💫 圣光幻影梦幻 (动态GIF)',
    description: '身姿优雅漂浮在彩虹星光中的传说梦幻，给你带来无上好运！',
    pointsCost: 1500,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif',
    theme: 'from-fuchsia-400 via-pink-400 to-violet-500',
    animationType: 'none',
    badge: '宇宙幻影'
  }
];

interface AvatarShopProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  onUnlockSuccess: (studentName: string, avatarName: string, pointsPaid: number) => void;
}

export default function AvatarShop({ students, setStudents, onUnlockSuccess }: AvatarShopProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<CreativeAvatar | null>(null);
  const [isUnlockDrawerOpen, setIsUnlockDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'affordable'>('all');
  const [unlockingStudentId, setUnlockingStudentId] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<string>('');

  // Find which students unlocked which avatar (by comparing URLs)
  const getOwnersOfAvatar = (avatarUrl: string) => {
    return students.filter(s => s.unlockedAvatars?.includes(avatarUrl));
  };

  const handleOpenUnlock = (avatar: CreativeAvatar) => {
    setSelectedAvatar(avatar);
    setSearchQuery('');
    setIsUnlockDrawerOpen(true);
  };

  const triggerUnlockWithLoading = (studentId: string) => {
    if (!selectedAvatar) return;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setUnlockingStudentId(studentId);
    setLoadingPhase('verifying');

    setTimeout(() => {
      setLoadingPhase('deducting');
      
      setTimeout(() => {
        setLoadingPhase('equipping');

        setTimeout(() => {
          handleConfirmUnlock(studentId);
          setUnlockingStudentId(null);
          setLoadingPhase('');
        }, 800);
      }, 900);
    }, 800);
  };

  const handleConfirmUnlock = (studentId: string) => {
    if (!selectedAvatar) return;

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (student.points < selectedAvatar.pointsCost) {
      return; // Safety guard
    }

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const unlocked = s.unlockedAvatars || [s.avatar];
        const newUnlocked = unlocked.includes(selectedAvatar.avatarUrl)
          ? unlocked
          : [...unlocked, selectedAvatar.avatarUrl];
        return {
          ...s,
          points: s.points - selectedAvatar.pointsCost,
          avatar: selectedAvatar.avatarUrl, // Automatically equip
          unlockedAvatars: newUnlocked
        };
      }
      return s;
    }));

    onUnlockSuccess(student.name, selectedAvatar.name, selectedAvatar.pointsCost);
    setIsUnlockDrawerOpen(false);
  };

  const filteredAvatars = CREATIVE_AVATARS.filter(av => {
    if (filterMode === 'all') return true;
    if (filterMode === 'unlocked') {
      // Show avatars with at least one owner
      return getOwnersOfAvatar(av.avatarUrl).length > 0;
    }
    if (filterMode === 'affordable') {
      // Show if ANY student can afford it (simple proxy)
      return students.some(s => s.points >= av.pointsCost && !s.unlockedAvatars?.includes(av.avatarUrl));
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Banner design */}
      <div className="bg-gradient-to-r from-teal-500/10 via-brand/5 to-indigo-500/10 border border-slate-100 p-8 rounded-[3rem] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-600 bg-teal-100/60 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            个性扮靓
          </span>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-2">🎨 创意个性头像馆</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            积累学力积分，唤醒专属于你的高光宇宙数字形态。解锁后头像将 <b>直接套用并自动加入你的永久衣橱</b>，随时在积分历史卡片中自由穿戴或调换！
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm relative z-10">
          <Palette className="w-8 h-8 text-teal-500" />
          <div className="text-left text-xs">
            <p className="text-slate-400 font-bold">全馆头像数量</p>
            <p className="font-mono text-lg font-black text-slate-700">{CREATIVE_AVATARS.length} 款精品</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-300/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      </div>

      {/* Filter switcher */}
      <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
        <div className="flex gap-1">
          {[
            { id: 'all', label: '🚀 全球馆' },
            { id: 'affordable', label: '💰 余额可兑' },
            { id: 'unlocked', label: '👥 有人拥有' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterMode(opt.id as any)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                filterMode === opt.id
                  ? 'bg-white text-teal-600 shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-bold tracking-tight">点击心仪作品一键换装</span>
      </div>

      {/* Avatar grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAvatars.map((av) => {
          const owners = getOwnersOfAvatar(av.avatarUrl);
          const animClass = 
            av.animationType === 'float' ? 'animate-avatar-float' :
            av.animationType === 'wobble' ? 'animate-avatar-wobble' :
            av.animationType === 'pulse' ? 'animate-avatar-pulse-subtle' :
            av.animationType === 'spin' ? 'animate-avatar-spin-slow' : '';
            
          return (
            <motion.div
              layoutId={`av-card-${av.id}`}
              key={av.id}
              className="bg-white rounded-[2.2rem] border border-slate-100/70 p-5 shadow-card hover:shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Visual Avatar frame */}
                <div className="flex justify-center mb-5 relative">
                  {/* Dynamic tag */}
                  {av.badge && (
                    <div className="absolute top-1 left-2 bg-teal-50 border border-teal-100 text-teal-600 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 text-teal-500 animate-spin" />
                      <span>{av.badge}</span>
                    </div>
                  )}
                  
                  <div className={`p-1.5 rounded-full bg-gradient-to-tr ${av.theme} shadow-lg relative group-hover:scale-105 transition-transform duration-300`}>
                    <div className="bg-white rounded-full p-1 border-4 border-white/40 overflow-hidden">
                      <img
                        src={av.avatarUrl}
                        alt={av.name}
                        className={`w-24 h-24 rounded-full bg-slate-50 select-none pointer-events-none ${animClass}`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute top-1 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Coins className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{av.pointsCost} Pts</span>
                  </div>
                </div>

                {/* Identity Text */}
                <div className="text-center px-2">
                  <h4 className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-teal-600 transition-colors flex items-center justify-center gap-1">
                    {av.name}
                  </h4>
                </div>
              </div>

              {/* Interaction Block */}
              <div className="mt-5 pt-4 border-t border-slate-50 space-y-3.5">
                {/* Small face stack of owners */}
                {owners.length > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">已拥有人次</span>
                    <div className="flex -space-x-2 group-hover:translate-x-0.5 transition-transform">
                      {owners.slice(0, 4).map((owner) => (
                        <div key={owner.id} className="relative group/owner">
                          <img
                            src={owner.avatar}
                            alt={owner.name}
                            className="w-6 h-6 rounded-full bg-white border border-slate-100 shadow-sm"
                            referrerPolicy="no-referrer"
                            title={owner.name}
                          />
                        </div>
                      ))}
                      {owners.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-black flex items-center justify-center shadow-sm">
                          +{owners.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleOpenUnlock(av)}
                  className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-teal-500 hover:text-white transition-all text-slate-600 font-bold text-xs shadow-sm shadow-slate-100 hover:shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>积分解锁该头像</span>
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredAvatars.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Palette className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400">没有匹配条件的创意头像</p>
            <p className="text-xs text-slate-300 mt-1">换个过滤选项，再来看看吧</p>
          </div>
        )}
      </div>

      {/* Unlock Dialog / Drawer */}
      <AnimatePresence>
        {isUnlockDrawerOpen && selectedAvatar && (
          <>
            {/* Dark fuzzy cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !unlockingStudentId && setIsUnlockDrawerOpen(false)}
              className={`fixed inset-0 bg-slate-900/40 z-[200] ${unlockingStudentId ? 'pointer-events-none' : 'cursor-pointer'}`}
            />

            {/* Float drawer sliding from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[210] flex flex-col rounded-l-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full bg-gradient-to-tr ${selectedAvatar.theme} shadow-sm`}>
                    <img
                      src={selectedAvatar.avatarUrl}
                      alt={selectedAvatar.name}
                      className="w-12 h-12 rounded-full border border-white bg-slate-50"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">解锁专属头像</h3>
                    <p className="text-[11px] text-teal-600 font-bold flex items-center gap-0.5 mt-0.5">
                      <Coins className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse" />
                      需扣减 <span className="font-mono">{selectedAvatar.pointsCost}</span> 积分
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !unlockingStudentId && setIsUnlockDrawerOpen(false)}
                  disabled={!!unlockingStudentId}
                  className={`p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all ${unlockingStudentId ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selector Search */}
              <div className="p-6 pb-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!!unlockingStudentId}
                    placeholder="寻找要换装解密的学生..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 outline-none font-bold disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Students grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
                {students
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => {
                    const alreadyUnlocked = s.unlockedAvatars?.includes(selectedAvatar.avatarUrl);
                    const canAfford = s.points >= selectedAvatar.pointsCost;

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (!alreadyUnlocked && canAfford && !unlockingStudentId) {
                            triggerUnlockWithLoading(s.id);
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          alreadyUnlocked
                            ? 'bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed'
                            : !canAfford
                            ? 'bg-red-50/20 border-red-100/40 opacity-70 cursor-not-allowed'
                            : unlockingStudentId
                            ? 'border-slate-100 opacity-50 cursor-not-allowed'
                            : 'border-slate-100 hover:bg-teal-50/50 hover:border-teal-500/20 shadow-sm cursor-pointer hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-slate-800 text-sm block">
                              {s.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                              {s.class} • 余额 {s.points.toLocaleString()} pts
                            </span>
                          </div>
                        </div>

                        <div>
                          {alreadyUnlocked ? (
                            <span className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-600 px-3 py-1 rounded-full text-[10px] font-black animate-none">
                              <CheckCircle2 className="w-3 h-3" />
                              已拥有并可用
                            </span>
                          ) : !canAfford ? (
                            <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold">
                              积分不足 ({s.points} pts)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-black hover:bg-teal-600 shadow-sm shadow-teal-500/10">
                              立即解锁
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Bottom message */}
              <div className="p-8 border-t border-slate-50 bg-slate-50/60 rounded-bl-[2.5rem] text-center text-xs font-semibold text-slate-400 leading-relaxed">
                解锁成功后，新头像将自动替换该生当前的默认头像，并激活首发穿戴。
              </div>

              {/* Seamless Animated Verification Overlay */}
              <AnimatePresence>
                {unlockingStudentId && (
                  (() => {
                    const targetStudent = students.find(s => s.id === unlockingStudentId);
                    if (!targetStudent) return null;

                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-md z-[220] rounded-l-[2.5rem] flex flex-col items-center justify-center p-8 text-center"
                      >
                        {/* Outer floating orbital effect */}
                        <div className="relative mb-8 flex items-center justify-center">
                          {/* Pulsing light rings */}
                          <div className="absolute w-36 h-36 rounded-full bg-teal-400/10 border border-teal-400/20 animate-ping" />
                          <div className="absolute w-28 h-28 rounded-full bg-brand/5 border border-brand/10 animate-pulse" />
                          
                          {/* Transfer Magic Link */}
                          <div className="flex items-center gap-6 relative z-10">
                            <div className="relative">
                              <img 
                                src={targetStudent.avatar} 
                                alt="Current" 
                                className="w-16 h-16 rounded-full border-4 border-slate-100 shadow-md bg-white animate-pulse"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white text-[9px] font-bold">
                                原
                              </div>
                            </div>

                            {/* Magic sparks connecting them */}
                            <div className="flex gap-1.5 justify-center items-center">
                              <motion.div 
                                animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }} 
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="w-2 h-2 rounded-full bg-teal-400"
                              />
                              <motion.div 
                                animate={{ x: [0, 12, 0], opacity: [0.1, 0.9, 0.1] }} 
                                transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                                className="w-1.5 h-1.5 rounded-full bg-brand"
                              />
                              <motion.div 
                                animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }} 
                                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                                className="w-2 h-2 rounded-full bg-indigo-400"
                              />
                            </div>

                            <div className="relative">
                              <div className={`p-1 rounded-full bg-gradient-to-tr ${selectedAvatar.theme} shadow-lg`}>
                                <img 
                                  src={selectedAvatar.avatarUrl} 
                                  alt="New Avatar" 
                                  className="w-16 h-16 rounded-full border-4 border-white bg-white animate-bounce"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white text-[9px] font-bold">
                                创
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Animated descriptions */}
                        <div className="flex flex-col items-center gap-4 max-w-sm">
                          <div className="inline-flex items-center justify-center p-3.5 bg-teal-50 text-teal-600 rounded-full border border-teal-100 text-sm font-black animate-spin mb-1">
                            <Sparkles className="w-6 h-6 text-teal-500" />
                          </div>

                          <h4 className="text-xl font-black text-slate-800 tracking-tight">
                            {loadingPhase === 'verifying' && '🔍 正在验算积分与学籍信息...'}
                            {loadingPhase === 'deducting' && '💰 正在安全划扣积分中...'}
                            {loadingPhase === 'equipping' && '✨ 正在连通宇宙能量戴上装扮...'}
                          </h4>

                          <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">
                            {loadingPhase === 'verifying' && '正在检验积分余额及装扮配对条件，请稍候...'}
                            {loadingPhase === 'deducting' && `安全扣减 ${targetStudent.name} 的 ${selectedAvatar.pointsCost} 记分并写入学籍账目...`}
                            {loadingPhase === 'equipping' && '极光换装光能注入中！马上戴上新形象，开启全新光芒学力旅程！'}
                          </p>

                          {/* Progress bar */}
                          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                            <motion.div 
                              initial={{ width: '5%' }}
                              animate={{ 
                                width: loadingPhase === 'verifying' ? '35%' : 
                                       loadingPhase === 'deducting' ? '70%' : '100%' 
                              }}
                              transition={{ duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-teal-400 via-brand to-indigo-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
