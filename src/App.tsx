import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bolt, Filter, ChevronRight, Zap, ShoppingBag, Clock, History, Trophy, Gavel, CheckCircle2, Palette } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import Navbar from './components/Navbar';
import Podium from './components/Podium';
import LeaderboardList from './components/LeaderboardList';
import RewardCard from './components/RewardCard';
import BatchActionCard from './components/BatchActionCard';
import RedeemDrawer from './components/RedeemDrawer';
import AuctionBidDrawer from './components/AuctionBidDrawer';
import HistoryModal from './components/HistoryModal';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import AvatarShop from './components/AvatarShop';

import { Tab, Reward, AuctionItem, Student, PointItem } from './types';
import { STUDENTS_MOCK, REWARDS_MOCK, AUCTION_MOCK } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
  const [activeGroup, setActiveGroup] = useState<'mid' | 'late'>('mid');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardCategory, setRewardCategory] = useState<string>('all');
  const [shopMode, setShopMode] = useState<'gifts' | 'avatars'>('gifts');
  
  const [isAuctionDrawerOpen, setIsAuctionDrawerOpen] = useState(false);
  const [selectedAuctionItem, setSelectedAuctionItem] = useState<AuctionItem | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Core Persistent Local States
  const [students, setStudents] = useState<Student[]>(() =>
    STUDENTS_MOCK.map(s => ({
      ...s,
      unlockedAvatars: s.unlockedAvatars || [s.avatar]
    }))
  );
  const [rewards, setRewards] = useState<Reward[]>(REWARDS_MOCK);
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => [
    ...AUCTION_MOCK.active.map(item => ({ ...item, status: 'active' as const })),
    ...AUCTION_MOCK.finished.map(item => ({ ...item, status: 'finished' as const }))
  ]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: 'stationery', label: '文具用品' },
    { id: 'campus', label: '校园特权' },
    { id: 'electronics', label: '电子产品' },
    { id: 'other', label: '其他福利' }
  ]);
  const [redemptions, setRedemptions] = useState<any[]>([
    { id: 'red-1', studentName: '王美丽', rewardName: 'Lamy 钢笔', pointsPaid: 1500, time: '2026-05-20 10:05', status: '已发放' },
    { id: 'red-2', studentName: '张晓明', rewardName: 'Kindle 阅读器', pointsPaid: 8000, time: '2026-05-20 09:40', status: '待发放' },
    { id: 'red-3', studentName: '李思源', rewardName: '免做作业卡一次', pointsPaid: 3000, time: '2026-05-19 16:30', status: '已发放' }
  ]);
  const [pointLogs, setPointLogs] = useState<any[]>([
    { id: 'log-1', studentName: '张晓明', activity: '作业优秀', points: 5, time: '2026-05-20 09:30', type: 'add' },
    { id: 'log-2', studentName: '李思源', activity: '纪律良好', points: 3, time: '2026-05-20 08:20', type: 'add' },
    { id: 'log-3', studentName: '王美丽', activity: '兑换 Lamy 钢笔', points: -1500, time: '2026-05-19 16:45', type: 'deduct' }
  ]);

  const [pointItems, setPointItems] = useState<PointItem[]>([
    { id: 'pi-1', label: '按时签到', value: 2, type: 'default' },
    { id: 'pi-2', label: '作业优秀', value: 5, type: 'default' },
    { id: 'pi-3', label: '阅读打卡', value: 4, type: 'default' },
    { id: 'pi-4', label: '纪律良好', value: 3, type: 'other' },
    { id: 'pi-5', label: '乐于助人', value: 2, type: 'other' },
    { id: 'pi-6', label: '未交作业', value: 5, type: 'deduct' },
    { id: 'pi-7', label: '课堂分心', value: 2, type: 'deduct' },
    { id: 'pi-8', label: '迟到/旷课', value: 5, type: 'deduct' }
  ]);

  const filteredRewards = useMemo(() => {
    if (rewardCategory === 'all') return rewards;
    return rewards.filter(r => r.category === rewardCategory);
  }, [rewards, rewardCategory]);

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setIsDrawerOpen(true);
  };

  const handleConfirmRedemption = (studentIds: string[]) => {
    if (!selectedReward) return;
    const itemCost = selectedReward.points;
    const totalCost = studentIds.length * itemCost;

    // Deduct student points
    setStudents(prev => prev.map(s => {
      if (studentIds.includes(s.id)) {
        return {
          ...s,
          points: Math.max(0, s.points - itemCost)
        };
      }
      return s;
    }));

    // Add Redemption Records & Point change logs
    studentIds.forEach(id => {
      const student = students.find(s => s.id === id);
      if (!student) return;

      const newRed = {
        id: `red-${Date.now()}-${id}`,
        studentName: student.name,
        rewardName: selectedReward.name,
        pointsPaid: itemCost,
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: '待发放' as const
      };
      setRedemptions(prev => [newRed, ...prev]);

      const newLog = {
        id: `log-${Date.now()}-${id}`,
        studentName: student.name,
        activity: `兑换礼品: ${selectedReward.name}`,
        points: -itemCost,
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'deduct' as const
      };
      setPointLogs(prev => [newLog, ...prev]);
    });

    toast.success(`成功为 ${studentIds.length} 名学生兑换 ${selectedReward.name}`, {
      description: `消耗总计 ${totalCost} 积分`,
      icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />
    });
    setIsDrawerOpen(false);
  };

  const handleOpenBid = (item: AuctionItem) => {
    setSelectedAuctionItem(item);
    setIsAuctionDrawerOpen(true);
  };

  const handleConfirmBid = (studentId: string, amount: number) => {
    const student = students.find(s => s.id === studentId);
    if (selectedAuctionItem) {
      setAuctions(prev => prev.map(item => {
        if (item.id === selectedAuctionItem.id) {
          return { ...item, currentBid: amount };
        }
        return item;
      }));
    }
    toast.success(`竞拍出价提交成功！`, {
      description: `${student?.name} 对 ${selectedAuctionItem?.name} 出价 ${amount} pts`,
      icon: <Gavel className="w-4 h-4 text-brand" />
    });
    setIsAuctionDrawerOpen(false);
  };

  const handleQuickAdd = (studentId: string, points: number, reason?: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, points: s.points + points };
      }
      return s;
    }));

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Log Point change
    const newLog = {
      id: `log-${Date.now()}`,
      studentName: student.name,
      activity: reason || '快捷加分发放',
      points: points,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'add' as const
    };
    setPointLogs(prev => [newLog, ...prev]);

    toast.success(`积分发放成功！`, {
      description: `已为 ${student.name} 添加 ${points} pts`,
      action: {
        label: '查看记录',
        onClick: () => handleViewHistory(student)
      }
    });
  };

  const handleViewHistory = (student: Student) => {
    // Refresh the student object from newest local state to guarantee wardrobe updates
    const newestStudent = students.find(s => s.id === student.id) || student;
    setHistoryStudent(newestStudent);
    setIsHistoryOpen(true);
  };

  const handleUnlockAvatarSuccess = (studentName: string, avatarName: string, pointsPaid: number) => {
    const newLog = {
      id: `log-${Date.now()}`,
      studentName: studentName,
      activity: `解锁创意头像: ${avatarName}`,
      points: -pointsPaid,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'deduct' as const
    };
    setPointLogs(prev => [newLog, ...prev]);

    toast.success(`形象解锁成功！`, {
      description: `${studentName} 成功花费 ${pointsPaid} 积分解锁并配戴【${avatarName}】🎨`,
      icon: <Palette className="w-4 h-4 text-teal-500" />
    });
  };

  const handleEquipAvatar = (studentId: string, avatarUrl: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, avatar: avatarUrl };
      }
      return s;
    }));
    
    // Also update history mode modal visualization immediately
    setHistoryStudent(prev => prev && prev.id === studentId ? { ...prev, avatar: avatarUrl } : prev);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoginOpen(false);
    toast.success(`欢迎回来, ${userData.name}!`, {
      description: '系统已成功加载您的管理权限',
      icon: <CheckCircle2 className="w-4 h-4 text-sky-500" />
    });
  };

  const handleBatchConfirm = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
      loading: '正在同步积分数据...',
      success: '本时段所有加分项已成功发放！',
      error: '同步失败，请检查网络连接',
    });
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLoginClick={() => setIsLoginOpen(true)}
        user={user}
      />

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.section
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col lg:flex-row gap-12"
            >
              <div className="lg:w-2/5 flex flex-col gap-8">
                <div>
                  <h1 className="text-6xl font-black text-brand mb-4 tracking-tighter">积分榜</h1>
                  <p className="text-slate-500 text-lg font-medium">本学期实时积分排行</p>
                </div>
                <Podium topStudents={students} onStudentClick={handleViewHistory} />
                <LeaderboardList students={students} onStudentClick={handleViewHistory} />
              </div>

              <div className="lg:w-3/5">
                <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-[3rem] p-10 shadow-soft h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800">统计概况</h2>
                    <div className="flex gap-2">
                       <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-white/50 px-3 py-1.5 rounded-full border border-white/50">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         实时更新中
                       </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">累计加分次数</p>
                        <p className="text-4xl font-black text-brand">1,280</p>
                      </div>
                      <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-brand/5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">累计消耗积分</p>
                        <p className="text-4xl font-black text-orange-400">284,500</p>
                      </div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-4 -bottom-4"
                      >
                        <Bolt className="w-24 h-24 text-orange-400/5" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div className="bg-brand-dark p-8 rounded-[2rem] shadow-lg shadow-brand/20 relative overflow-hidden">
                      <div className="relative z-10 flex justify-between items-center text-white">
                        <div>
                          <p className="text-brand-light/60 text-sm font-bold mb-1 uppercase tracking-wider">平台积分池总量</p>
                          <p className="text-4xl font-black italic">1,452,000</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                          <Zap className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                       全站兑换动态
                       <ChevronRight className="w-4 h-4 text-slate-300" />
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: '王美丽', reward: 'Lamy 钢笔', points: 1500, time: '5 分钟前' },
                        { name: '张晓明', reward: 'Kindle 阅读器', points: 8000, time: '12 分钟前' },
                        { name: '李思源', reward: '免做作业卡', points: 3000, time: '45 分钟前' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/60 rounded-3xl border border-white/50 hover:bg-white transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ShoppingBag className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.name} 兑换了 <span className="text-orange-500">{item.reward}</span></p>
                              <p className="text-xs text-slate-400 font-medium">消耗 {item.points} 积分</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 font-bold italic">{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'shop' && (
            <motion.section
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="flex gap-2.5 bg-slate-100 p-2 rounded-[2rem] w-fit shrink-0 relative z-10 select-none">
                <button
                  type="button"
                  onClick={() => setShopMode('gifts')}
                  className={`px-8 py-3.5 rounded-[1.8rem] text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    shopMode === 'gifts'
                      ? 'bg-white text-brand shadow-md shadow-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>积分礼品兑换</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShopMode('avatars')}
                  className={`px-8 py-3.5 rounded-[1.8rem] text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    shopMode === 'avatars'
                      ? 'bg-white text-teal-600 shadow-md shadow-slate-200'
                      : 'text-slate-500 hover:text-teal-600'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>创意头像解锁</span>
                </button>
              </div>

              {shopMode === 'gifts' ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-5xl font-black text-brand tracking-tighter mb-2">积分礼品兑换</h2>
                      <p className="text-slate-500 font-medium text-lg">将你的努力转化为实实在在的奖励</p>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: 'all', label: '全部' },
                        { id: 'stationery', label: '文具用品' },
                        { id: 'campus', label: '校园特权' },
                        { id: 'electronics', label: '电子产品' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setRewardCategory(cat.id)}
                          className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                            rewardCategory === cat.id 
                              ? 'bg-brand text-white shadow-brand/20' 
                              : 'bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRewards.map((reward) => (
                      <RewardCard 
                        key={reward.id} 
                        reward={reward} 
                        onRedeem={handleRedeem} 
                      />
                    ))}
                  </div>
                </>
              ) : (
                <AvatarShop 
                  students={students}
                  setStudents={setStudents}
                  onUnlockSuccess={handleUnlockAvatarSuccess}
                />
              )}
            </motion.section>
          )}

          {activeTab === 'quick-add' && (
            <motion.section
              key="quick-add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-center bg-brand text-white p-12 rounded-[3.5rem] shadow-xl shadow-brand/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">批量操作中心</h1>
                  <p className="text-brand-light/80 text-xl font-medium max-w-md">快速为学生记录日常优异表现，高效管理积分。</p>
                </div>
                
                <div className="mt-8 md:mt-0 flex gap-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-1 rounded-[2rem] flex border border-white/20 shadow-inner">
                    <button 
                      onClick={() => setActiveGroup('mid')}
                      className={`px-10 py-4 rounded-[2rem] font-black transition-all ${
                        activeGroup === 'mid' ? 'bg-white text-brand shadow-lg' : 'text-white hover:bg-white/5'
                      }`}
                    >
                      中托全体
                    </button>
                    <button 
                      onClick={() => setActiveGroup('late')}
                      className={`px-10 py-4 rounded-[2rem] font-black transition-all ${
                        activeGroup === 'late' ? 'bg-white text-brand shadow-lg' : 'text-white hover:bg-white/5'
                      }`}
                    >
                      晚托全体
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {students.map((student) => (
                  <BatchActionCard 
                    key={student.id} 
                    student={student} 
                    pointItems={pointItems}
                    onQuickAdd={handleQuickAdd}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleBatchConfirm}
                  className="bg-brand-dark hover:bg-brand text-white px-16 py-6 rounded-full text-2xl font-black flex items-center gap-4 transition-all shadow-2xl shadow-brand/40 active:scale-95 group"
                >
                  <Zap className="w-8 h-8 fill-brand-light text-brand-light group-hover:scale-125 transition-transform" />
                  一键完成加分
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'auction' && (
            <motion.section
              key="auction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-12"
            >
              {/* Active Auctions */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tight">正在拍卖</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {auctions.filter(item => item.status === 'active').map((item) => (
                    <div key={item.id} className="bg-white rounded-[2.5rem] p-2 shadow-card border border-slate-50 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-shadow group">
                      <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden rounded-[2rem]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                          竞拍中
                        </div>
                      </div>
                      <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-slate-800 mb-2">{item.name}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">当前最高出价</p>
                              <p className="text-3xl font-black text-brand italic">{item.currentBid} <span className="text-sm not-italic font-bold">积分</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">起拍价</p>
                              <p className="text-sm font-bold text-slate-500">{item.minPoints} 积分</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleOpenBid(item)}
                            className="w-full bg-brand p-4 rounded-2xl text-white font-black hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Gavel className="w-4 h-4" />
                            立即出价
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Auctions */}
              <div className="bg-slate-100/50 p-10 rounded-[3.5rem] border border-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-slate-200 rounded-2xl">
                     <History className="w-6 h-6 text-slate-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">往期拍卖记录</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {auctions.filter(item => item.status === 'finished').map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-soft opacity-80 hover:opacity-100 transition-opacity">
                      <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-2xl mb-4 grayscale group-hover:grayscale-0" />
                      <h4 className="font-bold text-slate-700 text-lg mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                           <Trophy className="w-4 h-4 text-orange-400" />
                           <span className="text-xs font-bold text-brand">{item.winner || '无'}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400">{item.currentBid} 积分</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'admin' && (
            <motion.section
              key="admin"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <AdminPanel 
                students={students}
                setStudents={setStudents}
                rewards={rewards}
                setRewards={setRewards}
                categories={categories}
                setCategories={setCategories}
                redemptions={redemptions}
                setRedemptions={setRedemptions}
                pointLogs={pointLogs}
                setPointLogs={setPointLogs}
                pointItems={pointItems}
                setPointItems={setPointItems}
                auctions={auctions}
                setAuctions={setAuctions}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <RedeemDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        reward={selectedReward}
        onConfirm={handleConfirmRedemption}
      />

      <AuctionBidDrawer
        isOpen={isAuctionDrawerOpen}
        onClose={() => setIsAuctionDrawerOpen(false)}
        item={selectedAuctionItem}
        onConfirm={handleConfirmBid}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        student={historyStudent}
        pointLogs={pointLogs}
        onEquipAvatar={handleEquipAvatar}
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

