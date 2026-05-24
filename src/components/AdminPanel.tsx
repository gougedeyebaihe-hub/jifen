import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Gift, Tags, ClipboardList, History, 
  Plus, Edit2, Trash2, Search, Check, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Award, PlusCircle, MinusCircle,
  Clock, Calendar, User, Upload, Image, X, Gavel, Trophy, Settings, RefreshCw, Lock
} from 'lucide-react';
import { Student, Reward, PointItem, AuctionItem } from '../types';
import { toast } from 'sonner';

interface Category {
  id: string;
  label: string;
}

interface Redemption {
  id: string;
  studentName: string;
  rewardName: string;
  pointsPaid: number;
  time: string;
  status: '待发放' | '已发放';
}

interface PointLog {
  id: string;
  studentName: string;
  activity: string;
  points: number;
  time: string;
  type: 'add' | 'deduct';
}

interface AdminPanelProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  rewards: Reward[];
  setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  redemptions: Redemption[];
  setRedemptions: React.Dispatch<React.SetStateAction<Redemption[]>>;
  pointLogs: PointLog[];
  setPointLogs: React.Dispatch<React.SetStateAction<PointLog[]>>;
  pointItems: PointItem[];
  setPointItems: React.Dispatch<React.SetStateAction<PointItem[]>>;
  auctions: AuctionItem[];
  setAuctions: React.Dispatch<React.SetStateAction<AuctionItem[]>>;
}

export default function AdminPanel({
  students,
  setStudents,
  rewards,
  setRewards,
  categories,
  setCategories,
  redemptions,
  setRedemptions,
  pointLogs,
  setPointLogs,
  pointItems,
  setPointItems,
  auctions,
  setAuctions
}: AdminPanelProps) {
  const [subTab, setSubTab] = useState<'students' | 'rewards' | 'categories' | 'redemptions' | 'point-logs' | 'auctions' | 'misc'>('students');

  // Search/Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentModeFilter, setStudentModeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [studentCareFilter, setStudentCareFilter] = useState<'all' | 'zhongtuo' | 'wantuo'>('all');
  const [rewardSearch, setRewardSearch] = useState('');
  const [redemptionSearch, setRedemptionSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');

  // Modals / Editors
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState<{
    name: string;
    class: string;
    points: number;
    mode: 'online' | 'offline';
    careTypes: string[];
  }>({ name: '', class: '', points: 0, mode: 'online', careTypes: [] });

  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [pointTargetStudent, setPointTargetStudent] = useState<Student | null>(null);
  const [selectedPointItemId, setSelectedPointItemId] = useState<string>('');
  const [pointRemark, setPointRemark] = useState<string>('');
  const [isCustomPoint, setIsCustomPoint] = useState<boolean>(false);
  const [customPointType, setCustomPointType] = useState<'add' | 'deduct'>('add');
  const [customPointValue, setCustomPointValue] = useState<string>('');
  const [customPointRemark, setCustomPointRemark] = useState<string>('');

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points: 100,
    category: 'stationery',
    image: '',
    icon: ''
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ id: '', label: '' });

  const [categoryActiveSection, setCategoryActiveSection] = useState<'reward-categories' | 'point-items'>('reward-categories');
  const [isPointItemModalOpen, setIsPointItemModalOpen] = useState(false);
  const [editingPointItem, setEditingPointItem] = useState<PointItem | null>(null);
  const [pointItemForm, setPointItemForm] = useState<{
    id: string;
    label: string;
    value: number;
    type: 'default' | 'other' | 'deduct';
  }>({ id: '', label: '', value: 1, type: 'default' });

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'student' | 'reward' | 'category' | 'pointItem' | 'auction' | '';
    id: string;
    name: string;
  }>({ isOpen: false, type: '', id: '', name: '' });

  // Auction management state
  const [auctionSearch, setAuctionSearch] = useState('');
  const [auctionStatusFilter, setAuctionStatusFilter] = useState<'all' | 'active' | 'finished'>('all');
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState<AuctionItem | null>(null);
  const [auctionForm, setAuctionForm] = useState<{
    name: string;
    description: string;
    image: string;
    minPoints: number;
    currentBid: number;
    endTime: string;
    status: 'active' | 'finished';
    winner: string;
  }>({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    minPoints: 10,
    currentBid: 0,
    endTime: '2026-05-31 18:00',
    status: 'active',
    winner: ''
  });

  // 其他管理 (Misc Management) 状态与方法
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // 双重二次确认模式状态
  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (currentPassword !== savedPassword) {
      toast.error('当前密码输入不正确！');
      return;
    }
    if (newPassword.length < 4) {
      toast.error('新密码长度不能少于 4 位数！');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('两次新密码输入不一致！');
      return;
    }
    localStorage.setItem('adminPassword', newPassword);
    toast.success('管理员密码修改成功！下次登录时生效。');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const triggerFirstConfirm = () => {
    setIsFirstConfirmOpen(true);
  };

  const confirmFirstStep = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
    setTypedConfirmation('');
  };

  const executeSemesterReset = () => {
    if (typedConfirmation.trim().toUpperCase() !== 'RESET') {
      toast.error('输入验证词语不匹配，操作已安全终止！');
      return;
    }

    // 1. Clear point logs and redemption history completely for the new semester to prevent redudant data
    setPointLogs([]);
    setRedemptions([]);

    setIsSecondConfirmOpen(false);
    setTypedConfirmation('');
    toast.success('历史记录重置成功！已彻底擦除本学期的积分变更日志与兑换流转历史，学员当前的积分余额安全保留。');
  };

  // Filtered Lists
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesMode = studentModeFilter === 'all' || s.mode === studentModeFilter;
      const matchesCare = studentCareFilter === 'all' || (s.careTypes && s.careTypes.includes(studentCareFilter));
      return matchesSearch && matchesMode && matchesCare;
    });
  }, [students, studentSearch, studentModeFilter, studentCareFilter]);

  const filteredRewards = useMemo(() => {
    return rewards.filter(r => 
      r.name.toLowerCase().includes(rewardSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(rewardSearch.toLowerCase())
    );
  }, [rewards, rewardSearch]);

  const filteredRedemptions = useMemo(() => {
    return redemptions.filter(r => 
      r.studentName.toLowerCase().includes(redemptionSearch.toLowerCase()) ||
      r.rewardName.toLowerCase().includes(redemptionSearch.toLowerCase())
    ).sort((a,b) => b.time.localeCompare(a.time));
  }, [redemptions, redemptionSearch]);

  const filteredPointLogs = useMemo(() => {
    return pointLogs.filter(l => 
      l.studentName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.activity.toLowerCase().includes(logSearch.toLowerCase())
    ).sort((a,b) => b.time.localeCompare(a.time));
  }, [pointLogs, logSearch]);

  const filteredAuctions = useMemo(() => {
    return auctions.filter(a => 
      a.name.toLowerCase().includes(auctionSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(auctionSearch.toLowerCase())
    );
  }, [auctions, auctionSearch]);

  // AUCTION ACTIONS
  const openAddAuction = () => {
    setEditingAuction(null);
    setAuctionForm({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      minPoints: 10,
      currentBid: 0,
      endTime: '2026-05-31 18:00',
      status: 'active',
      winner: ''
    });
    setIsAuctionModalOpen(true);
  };

  const openEditAuction = (item: AuctionItem) => {
    setEditingAuction(item);
    setAuctionForm({
      name: item.name,
      description: item.description,
      image: item.image,
      minPoints: item.minPoints,
      currentBid: item.currentBid,
      endTime: item.endTime,
      status: item.status,
      winner: item.winner || ''
    });
    setIsAuctionModalOpen(true);
  };

  const handleAuctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auctionForm.name.trim()) {
      toast.error('请输入商品名称');
      return;
    }

    if (editingAuction) {
      setAuctions(prev => prev.map(a => a.id === editingAuction.id ? {
        ...a,
        name: auctionForm.name.trim(),
        description: auctionForm.description.trim(),
        image: auctionForm.image,
        minPoints: Number(auctionForm.minPoints),
        currentBid: Number(auctionForm.currentBid),
        endTime: auctionForm.endTime,
        status: auctionForm.status,
        winner: auctionForm.winner.trim() || undefined
      } : a));
      toast.success(`拍卖品 [${auctionForm.name}] 信息已更新`);
    } else {
      const newId = `auc-${Date.now()}`;
      setAuctions(prev => [
        ...prev,
        {
          id: newId,
          name: auctionForm.name.trim(),
          description: auctionForm.description.trim(),
          image: auctionForm.image,
          minPoints: Number(auctionForm.minPoints),
          currentBid: Number(auctionForm.currentBid),
          endTime: auctionForm.endTime,
          status: auctionForm.status,
          winner: auctionForm.winner.trim() || undefined,
          history: []
        }
      ]);
      toast.success(`新拍卖品 [${auctionForm.name}] 已发布`);
    }
    setIsAuctionModalOpen(false);
  };

  const handleDeleteAuction = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'auction',
      id,
      name
    });
  };

  const handleAuctionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('图片大小不能超过 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuctionForm(prev => ({ ...prev, image: reader.result as string }));
        toast.success('商品图片上传并生成预览成功！');
      };
      reader.readAsDataURL(file);
    }
  };

  // STUDENT ACTIONS
  const openAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({ name: '', class: '', points: 0, mode: 'online', careTypes: [] });
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      class: student.class,
      points: student.points,
      mode: student.mode || 'online',
      careTypes: student.careTypes || []
    });
    setIsStudentModalOpen(true);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) {
      toast.error('学生姓名不能为空');
      return;
    }

    if (editingStudent) {
      // Update
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? {
        ...s,
        name: studentForm.name,
        class: studentForm.class,
        points: Number(studentForm.points),
        mode: studentForm.mode,
        careTypes: studentForm.careTypes
      } : s));
      toast.success(`学生 [${studentForm.name}] 信息更新成功`);
    } else {
      // Add
      const newId = (students.length + 1).toString();
      const newStudent: Student = {
        id: newId,
        name: studentForm.name,
        class: studentForm.class,
        points: Number(studentForm.points),
        avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix',
        activities: [
          { label: '按时签到', value: 2 },
          { label: '作业优秀', value: 5 }
        ],
        mode: studentForm.mode,
        careTypes: studentForm.careTypes
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success(`新学生 [${studentForm.name}] 录入成功`);
    }
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'student',
      id,
      name
    });
  };

  // QUICK POINT ADJUSTMENT
  const openPointAdjust = (student: Student) => {
    setPointTargetStudent(student);
    const firstItem = pointItems[0]?.id || '';
    setSelectedPointItemId(firstItem);
    setPointRemark('');
    setIsCustomPoint(false);
    setCustomPointType('add');
    setCustomPointValue('');
    setCustomPointRemark('');
    setIsPointModalOpen(true);
  };

  const handlePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointTargetStudent) return;

    let finalChange = 0;
    let activityLabel = '';
    let isAddition = true;
    let successMessageLabel = '';

    if (isCustomPoint) {
      const val = parseInt(customPointValue, 10);
      if (isNaN(val) || val <= 0) {
        toast.error('请输入大于0的有效自定义分值');
        return;
      }
      if (!customPointRemark.trim()) {
        toast.error('自定义评分的备注说明不能为空');
        return;
      }
      isAddition = customPointType === 'add';
      finalChange = isAddition ? val : -val;
      activityLabel = `🌟 自定义评分: ${customPointRemark.trim()}`;
      successMessageLabel = `自定义调分 (${customPointRemark.trim()})`;
    } else {
      const selectedItem = pointItems.find(pi => pi.id === selectedPointItemId);
      if (!selectedItem) {
        toast.error('请选择一个有效的评分项');
        return;
      }

      const value = selectedItem.value;
      isAddition = selectedItem.type !== 'deduct';
      finalChange = isAddition ? value : -value;

      activityLabel = pointRemark.trim() 
        ? `${selectedItem.label} (${pointRemark.trim()})`
        : selectedItem.label;
      successMessageLabel = selectedItem.label;
    }

    // Update students points
    setStudents(prev => prev.map(s => {
      if (s.id === pointTargetStudent.id) {
        return {
          ...s,
          points: Math.max(0, s.points + finalChange)
        };
      }
      return s;
    }));

    // Record Log
    const newLog: PointLog = {
      id: `log-${Date.now()}`,
      studentName: pointTargetStudent.name,
      activity: activityLabel,
      points: finalChange,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: isAddition ? 'add' : 'deduct'
    };
    setPointLogs(prev => [newLog, ...prev]);

    toast.success(`成功为 ${pointTargetStudent.name} 调整 ${finalChange > 0 ? `+${finalChange}` : finalChange} 积分 (${successMessageLabel})`);
    setIsPointModalOpen(false);
  };

  // REWARD ACTIONS
  const openAddReward = () => {
    setEditingReward(null);
    setRewardForm({
      name: '',
      description: '',
      points: 500,
      category: categories[0]?.id || 'stationery',
      image: '',
      icon: 'Gift'
    });
    setIsRewardModalOpen(true);
  };

  const openEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setRewardForm({
      name: reward.name,
      description: reward.description,
      points: reward.points,
      category: reward.category,
      image: reward.image || '',
      icon: reward.icon || 'Gift'
    });
    setIsRewardModalOpen(true);
  };

  const handleGiftImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('图片大小不能超过 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRewardForm(prev => ({ ...prev, image: reader.result as string }));
        toast.success('图片上传并生成预览成功！');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardForm.name.trim()) {
      toast.error('礼品名称不能为空');
      return;
    }

    if (editingReward) {
      setRewards(prev => prev.map(r => r.id === editingReward.id ? {
        ...r,
        name: rewardForm.name,
        description: rewardForm.description,
        points: Number(rewardForm.points),
        category: rewardForm.category as any,
        image: rewardForm.image || undefined,
        icon: rewardForm.icon || undefined
      } : r));
      toast.success(`礼品 [${rewardForm.name}] 修改成功`);
    } else {
      const newReward: Reward = {
        id: `r-${Date.now()}`,
        name: rewardForm.name,
        description: rewardForm.description,
        points: Number(rewardForm.points),
        category: rewardForm.category as any,
        image: rewardForm.image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400'
      };
      setRewards(prev => [...prev, newReward]);
      toast.success(`新礼品 [${rewardForm.name}] 添加成功`);
    }
    setIsRewardModalOpen(false);
  };

  const handleDeleteReward = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'reward',
      id,
      name
    });
  };

  // CATEGORY ACTIONS
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ id: '', label: '' });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ id: category.id, label: category.label });
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.id.trim() || !categoryForm.label.trim()) {
      toast.error('分类编码和分类名称不能为空');
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, label: categoryForm.label } : c));
      toast.success(`分类已更新为 [${categoryForm.label}]`);
    } else {
      if (categories.some(c => c.id === categoryForm.id.trim())) {
        toast.error('该分类编码已存在');
        return;
      }
      setCategories(prev => [...prev, { id: categoryForm.id.trim(), label: categoryForm.label.trim() }]);
      toast.success(`分类 [${categoryForm.label}] 添加成功`);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string, label: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'category',
      id,
      name: label
    });
  };

  // POINT ITEM ACTIONS
  const openAddPointItem = () => {
    setEditingPointItem(null);
    setPointItemForm({ id: '', label: '', value: 1, type: 'default' });
    setIsPointItemModalOpen(true);
  };

  const openEditPointItem = (item: PointItem) => {
    setEditingPointItem(item);
    setPointItemForm({ id: item.id, label: item.label, value: item.value, type: item.type });
    setIsPointItemModalOpen(true);
  };

  const handlePointItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointItemForm.label.trim()) {
      toast.error('名称不能为空');
      return;
    }
    if (pointItemForm.value < 1) {
      toast.error('积分值必须至少为 1');
      return;
    }

    const itemTypeName = pointItemForm.type === 'deduct' ? '减分项' : '加分项';

    if (editingPointItem) {
      // Update
      setPointItems(prev => prev.map(pi => pi.id === editingPointItem.id ? {
        ...pi,
        label: pointItemForm.label.trim(),
        value: Number(pointItemForm.value),
        type: pointItemForm.type
      } : pi));
      toast.success(`${itemTypeName} [${pointItemForm.label}] 更新成功`);
    } else {
      // Create new
      const newId = `pi-${Date.now()}`;
      setPointItems(prev => [...prev, {
        id: newId,
        label: pointItemForm.label.trim(),
        value: Number(pointItemForm.value),
        type: pointItemForm.type
      }]);
      toast.success(`${itemTypeName} [${pointItemForm.label}] 添加成功`);
    }
    setIsPointItemModalOpen(false);
  };

  const handleDeletePointItem = (id: string, label: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'pointItem',
      id,
      name: label
    });
  };

  const executeDelete = () => {
    const { type, id, name } = deleteConfirm;
    if (!type || !id) return;

    if (type === 'student') {
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success(`学生 [${name}] 已成功删除`);
    } else if (type === 'reward') {
      setRewards(prev => prev.filter(r => r.id !== id));
      toast.success(`礼品 [${name}] 已成功删除`);
    } else if (type === 'category') {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success(`分类 [${name}] 已成功删除`);
    } else if (type === 'pointItem') {
      setPointItems(prev => prev.filter(pi => pi.id !== id));
      toast.success(`评分项 [${name}] 已成功删除`);
    } else if (type === 'auction') {
      setAuctions(prev => prev.filter(a => a.id !== id));
      toast.success(`拍卖品 [${name}] 已成功删除`);
    }

    setDeleteConfirm({ isOpen: false, type: '', id: '', name: '' });
  };

  // REDEMPTION ACTIONS
  const toggleRedemptionStatus = (id: string) => {
    setRedemptions(prev => prev.map(r => {
      if (r.id === id) {
        const newStatus = r.status === '待发放' ? '已发放' : '待发放';
        toast.info(`兑换状态已修改为: ${newStatus}`);
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Panel */}
      <div className="bg-brand text-white p-12 rounded-[3.5rem] shadow-xl shadow-brand/20 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">系统管理后台</h1>
          <p className="text-brand-light/85 text-xl font-medium max-w-2xl">
            提供数据看板、学生录入、积分调整、礼品库存维护及全站收发日志管理。
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center overflow-x-auto no-scrollbar bg-slate-50 border border-slate-100 p-2 rounded-3xl gap-2 self-start">
        {[
          { id: 'students', label: '学生管理', icon: Users },
          { id: 'rewards', label: '礼品管理', icon: Gift },
          { id: 'categories', label: '分类管理', icon: Tags },
          { id: 'redemptions', label: '兑换记录', icon: ClipboardList },
          { id: 'point-logs', label: '积分日志', icon: History },
          { id: 'auctions', label: '拍卖管理', icon: Gavel },
          { id: 'misc', label: '其他管理', icon: Settings }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = subTab === item.id;
          return (
            <button
               key={item.id}
               onClick={() => setSubTab(item.id as any)}
               className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20 scale-105'
                  : 'text-slate-500 hover:text-brand hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Sub-panel Content */}
      <div className="bg-white/50 backdrop-blur-xl border border-slate-50 rounded-[3rem] p-10 shadow-soft">
        <AnimatePresence mode="wait">
          
          {/* ================= STUDENTS PANEL ================= */}
          {subTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
                  {/* Mode Filter */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shrink-0">
                    <span className="text-[10px] text-slate-400 font-black px-2 whitespace-nowrap">上课模式:</span>
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'online', label: '线上' },
                      { id: 'offline', label: '线下' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setStudentModeFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          studentModeFilter === f.id
                            ? 'bg-brand text-white shadow-sm'
                            : 'text-slate-500 hover:text-brand hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Care Option Filters */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shrink-0">
                    <span className="text-[10px] text-slate-400 font-black px-2 whitespace-nowrap">托管状态:</span>
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'zhongtuo', label: '中托' },
                      { id: 'wantuo', label: '晚托' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setStudentCareFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          studentCareFilter === f.id
                            ? 'bg-brand text-white shadow-sm'
                            : 'text-slate-500 hover:text-brand hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={openAddStudent}
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand/10 transition-all shrink-0 self-end lg:self-center"
                >
                  <Plus className="w-4 h-4" />
                  添加学生
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-4 px-6">学生信息</th>
                      <th className="py-4 px-6">上课模式</th>
                      <th className="py-4 px-6">托管状态</th>
                      <th className="py-4 px-6">当前总积分</th>
                      <th className="py-4 px-6 text-center">快捷积分动作</th>
                      <th className="py-4 px-6 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100" />
                            <span className="font-bold text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {student.mode === 'online' ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-blue-50 text-blue-600 border border-blue-100 inline-block">
                              线上
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-purple-50 text-purple-600 border border-purple-100 inline-block">
                              线下
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {!student.careTypes || student.careTypes.length === 0 ? (
                              <span className="text-slate-400 font-semibold text-xs">-</span>
                            ) : (
                              student.careTypes.map(c => {
                                if (c === 'zhongtuo') {
                                  return (
                                    <span key={c} className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-600 border border-amber-150">
                                      中托
                                    </span>
                                  );
                                }
                                if (c === 'wantuo') {
                                  return (
                                    <span key={c} className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-600 border border-indigo-150">
                                      晚托
                                    </span>
                                  );
                                }
                                return null;
                              })
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-black italic text-brand text-lg">
                          {student.points.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 not-italic ml-0.5">pts</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => openPointAdjust(student)}
                            className="bg-brand-light hover:bg-brand hover:text-white transition-colors text-brand px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            积分调增/减
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openEditStudent(student)}
                            className="text-slate-400 hover:text-brand p-2 rounded-xl hover:bg-slate-100 transition-all inline-flex"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all inline-flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          没有找到符合条件的学生数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ================= REWARDS PANEL ================= */}
          {subTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={rewardSearch}
                    onChange={(e) => setRewardSearch(e.target.value)}
                    placeholder="按礼品名称、详情描述过滤搜索..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                  />
                </div>
                <button
                  onClick={openAddReward}
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand/10 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  上架新礼品
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => {
                  const catLabel = categories.find(c => c.id === reward.category)?.label || reward.category;
                  return (
                    <div key={reward.id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-brand/5 hover:border-brand/10 transition-all">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden shrink-0 flex items-center justify-center">
                          {reward.image ? (
                            <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                          ) : (
                            <Gift className="w-8 h-8 text-brand" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black tracking-widest uppercase text-brand bg-brand-light px-2.5 py-0.5 rounded-full inline-block">
                            {catLabel}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-brand transition-colors">
                            {reward.name}
                          </h4>
                          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{reward.description}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">所需积分</span>
                          <span className="font-black italic text-brand text-lg">{reward.points.toLocaleString()} pts</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEditReward(reward)}
                            className="bg-white hover:bg-slate-150 border border-slate-100 text-slate-400 hover:text-brand p-2.5 rounded-xl text-xs font-bold transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReward(reward.id, reward.name)}
                            className="bg-white hover:bg-red-50 border border-slate-100 text-slate-400 hover:text-red-500 p-2.5 rounded-xl text-xs font-bold transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================= CATEGORIES PANEL ================= */}
          {subTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-3xl"
            >
              {/* Category Segment Selector */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 max-w-xs md:max-w-sm">
                <button
                  type="button"
                  onClick={() => setCategoryActiveSection('reward-categories')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    categoryActiveSection === 'reward-categories'
                      ? 'bg-white text-brand shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  礼品分类维护
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryActiveSection('point-items')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    categoryActiveSection === 'point-items'
                      ? 'bg-white text-brand shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  加分项维护
                </button>
              </div>

              {categoryActiveSection === 'reward-categories' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">礼品分类维护</h3>
                      <p className="text-slate-400 text-xs font-medium mt-1">设置各礼品的展示池类别标签</p>
                    </div>
                    <button
                      onClick={openAddCategory}
                      className="bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新建礼品分类
                    </button>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
                    <div className="grid grid-cols-3 p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="pl-4">分类 ID (键名)</div>
                      <div>分类显示名称</div>
                      <div className="text-right pr-4">管理操作</div>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {categories.map((cat) => (
                        <div key={cat.id} className="grid grid-cols-3 p-4 items-center text-sm font-semibold hover:bg-slate-50/30 transition-all">
                          <div className="font-mono text-xs text-slate-500 pl-4">{cat.id}</div>
                          <div className="text-slate-800 font-extrabold">{cat.label}</div>
                          <div className="text-right pr-4 space-x-1.5">
                            <button
                              onClick={() => openEditCategory(cat)}
                              className="p-2 text-slate-400 hover:text-brand bg-slate-50 rounded-xl hover:bg-slate-100 transition-all inline-flex"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.label)}
                              className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-xl hover:bg-red-50 transition-all inline-flex"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Point Items Header */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">评分项维护</h3>
                      <p className="text-slate-400 text-xs font-medium mt-1">设置常用加分和减分动作，支持默认加分项、其他加分项以及减分项分类配置</p>
                    </div>
                    <button
                      onClick={openAddPointItem}
                      className="bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新建评分项
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Default Point Items Column */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <h4 className="font-bold text-slate-800 text-sm">默认加分项</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          常用预设
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto pr-1">
                        {pointItems.filter(item => item.type === 'default').length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">暂无默认加分项</p>
                        ) : (
                          pointItems.filter(item => item.type === 'default').map(item => (
                            <div key={item.id} className="flex justify-between items-center py-3.5">
                              <div>
                                <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-emerald-600 font-mono">+{item.value} pts</span>
                                <div className="space-x-1 flex items-center">
                                  <button
                                    onClick={() => openEditPointItem(item)}
                                    className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePointItem(item.id, item.label)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Other Point Items Column */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <h4 className="font-bold text-slate-800 text-sm">其他加分项</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          备用预设
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto pr-1">
                        {pointItems.filter(item => item.type === 'other').length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">暂无其他加分项</p>
                        ) : (
                          pointItems.filter(item => item.type === 'other').map(item => (
                            <div key={item.id} className="flex justify-between items-center py-3.5">
                              <div>
                                <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-blue-600 font-mono">+{item.value} pts</span>
                                <div className="space-x-1 flex items-center">
                                  <button
                                    onClick={() => openEditPointItem(item)}
                                    className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePointItem(item.id, item.label)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Deduct Point Items Column */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <h4 className="font-bold text-slate-800 text-sm">减分项</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          惩戒扣减
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto pr-1">
                        {pointItems.filter(item => item.type === 'deduct').length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">暂无减分项</p>
                        ) : (
                          pointItems.filter(item => item.type === 'deduct').map(item => (
                            <div key={item.id} className="flex justify-between items-center py-3.5">
                              <div>
                                <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-rose-600 font-mono">-{item.value} pts</span>
                                <div className="space-x-1 flex items-center">
                                  <button
                                    onClick={() => openEditPointItem(item)}
                                    className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePointItem(item.id, item.label)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Independent Custom Scoring Column (独特内置可变评分) */}
                    <div className="bg-gradient-to-b from-brand/5 to-white border border-brand/25 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-full translate-x-8 -translate-y-8 blur-lg group-hover:scale-125 transition-transform" />
                      <div className="flex items-center justify-between border-b border-brand/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-dark animate-pulse" />
                          <h4 className="font-extrabold text-slate-800 text-sm">系统内置项 (独立评分)</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-white bg-brand-dark px-2.5 py-1 rounded-md uppercase tracking-wider scale-95 shadow-xs">
                          🔥 特别预设
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white/85 border border-brand/10 rounded-2xl space-y-3 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-brand-dark text-sm">✨ 独立自定义评分候选项</p>
                              <p className="text-slate-400 text-[10px] font-medium mt-0.5">Custom Adjustment Option</p>
                            </div>
                            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              免维护
                            </span>
                          </div>
                          
                          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                            此项目为系统内置的独立评分机制。点击评分时可随时在“独立自定义评分”选项卡中：
                          </p>

                          <ul className="space-y-1.5 text-xs font-extrabold text-slate-700">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              自由设置【得分 / 扣分】
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              自由调整【分值大小】
                            </li>
                            <li className="flex items-center gap-2 text-rose-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                              校验限制【备注不能为空】
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-brand/5 rounded-xl border border-brand/10 flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 text-brand shrink-0" />
                          <p className="text-[10.5px] font-bold text-brand-dark leading-tight">
                            该项已在学员评分弹窗中独立展示，点击即可轻松自定义操作。
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= REDEMPTIONS PANEL ================= */}
          {subTab === 'redemptions' && (() => {
            const stats = {
              total: filteredRedemptions.length,
              pending: filteredRedemptions.filter(r => r.status === '待发放').length,
              done: filteredRedemptions.filter(r => r.status === '已发放').length,
              points: filteredRedemptions.reduce((sum, r) => sum + r.pointsPaid, 0)
            };

            return (
              <motion.div
                key="redemptions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* 评分兑换数据看盘 (以图标形式展现) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">总兑换次数</p>
                      <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{stats.total} <span className="text-xs font-semibold text-slate-500">次</span></p>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md ${stats.pending > 0 ? 'animate-pulse' : ''}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">待发放礼品</p>
                      <p className="text-2xl font-black text-amber-600 font-mono mt-0.5">{stats.pending} <span className="text-xs font-semibold text-slate-500">件</span></p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">已发放礼品</p>
                      <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{stats.done} <span className="text-xs font-semibold text-slate-500">件</span></p>
                    </div>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">累计消耗积分</p>
                      <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">{stats.points} <span className="text-xs font-semibold text-slate-500">pts</span></p>
                    </div>
                  </div>
                </div>

                <div className="relative max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={redemptionSearch}
                    onChange={(e) => setRedemptionSearch(e.target.value)}
                    placeholder="搜索兑换人、兑换礼品信息..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRedemptions.map((red) => {
                    const student = students.find(s => s.name === red.studentName);
                    const isPending = red.status === '待发放';

                    return (
                      <motion.div
                        key={red.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-slate-100 hover:border-brand/20 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
                      >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-brand/5 transition-colors pointer-events-none" />

                        {/* Student Name & Avatar (with elegant icons) */}
                        <div className="flex items-center gap-3 relative z-10">
                          {student?.avatar ? (
                            <img
                              src={student.avatar}
                              alt={red.studentName}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm">{red.studentName}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">上课学员 • {student?.mode === 'offline' ? '线下课程' : '线上课程'}</p>
                          </div>
                        </div>

                        {/* Gift & Points info panel */}
                        <div className="bg-slate-50/70 rounded-2xl p-4 flex items-center justify-between relative z-10 border border-slate-100/30">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                              <Gift className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">{red.rewardName}</p>
                              <p className="text-[10px] text-slate-400 font-medium">兑换礼品</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-orange-500 font-mono italic">
                              -{red.pointsPaid} pts
                            </span>
                          </div>
                        </div>

                        {/* Bottom date and Interactivity layout */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/40 text-xs text-slate-400 font-medium relative z-10">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {red.time}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleRedemptionStatus(red.id)}
                            title="点击切换发放状态"
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer hover:scale-105 active:scale-95 ${
                              isPending
                                ? 'bg-amber-50 text-amber-600 border-amber-250/30 hover:bg-amber-100/80'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-250/30 hover:bg-emerald-100/80'
                            }`}
                          >
                            {isPending ? (
                              <>
                                <Clock className="w-3.5 h-3.5" />
                                <span>待发放</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>已发放</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredRedemptions.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 font-bold">没有对应兑换条目</p>
                      <p className="text-xs text-slate-300 mt-1">换个搜索条件试一试吧</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}

          {/* ================= POINT LOGS PANEL ================= */}
          {subTab === 'point-logs' && (
            <motion.div
              key="point-logs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="搜索加分学员、事件事由..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-4 px-6">日志编号</th>
                      <th className="py-4 px-6">学员</th>
                      <th className="py-4 px-6">变动事由</th>
                      <th className="py-4 px-6">增减分数</th>
                      <th className="py-4 px-6">操作记录时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm font-semibold">
                    {filteredPointLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">{log.id}</td>
                        <td className="py-4 px-6 text-slate-800 font-bold">{log.studentName}</td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{log.activity}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 font-black italic text-base ${
                            log.type === 'add' ? 'text-emerald-500' : 'text-orange-400'
                          }`}>
                            {log.type === 'add' ? (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                +{log.points} pts
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="w-3.5 h-3.5" />
                                {log.points} pts
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">{log.time}</td>
                      </tr>
                    ))}
                    {filteredPointLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                          没有对应积分流向日志
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ================= AUCTIONS PANEL ================= */}
          {subTab === 'auctions' && (
            <motion.div
              key="auctions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-3 w-full md:max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={auctionSearch}
                      onChange={(e) => setAuctionSearch(e.target.value)}
                      placeholder="搜索拍卖品名称、商品描述..."
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="flex gap-1.5 self-start">
                    {(['all', 'active', 'finished'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setAuctionStatusFilter(status)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          auctionStatusFilter === status 
                            ? 'bg-slate-800 text-white' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'all' ? '全部' : status === 'active' ? '进行中' : '已结束'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={openAddAuction}
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-95 flex items-center gap-2 self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  上架拍卖商品
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.filter(a => auctionStatusFilter === 'all' || a.status === auctionStatusFilter).map((item) => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                          item.status === 'active' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-500 text-white'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-white animate-ping' : 'bg-slate-300'}`} />
                          {item.status === 'active' ? '正在竞拍' : '拍卖已结束'}
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="font-black text-slate-800 text-lg mb-1.5">{item.name}</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">起拍价</span>
                            <span className="font-mono text-xs font-bold text-slate-500">{item.minPoints} 积分</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">当前最高价</span>
                            <span className="font-mono text-sm font-black text-brand italic">{item.currentBid} 积分</span>
                          </div>
                        </div>

                        {item.winner && (
                          <div className="mt-4 flex items-center gap-2 bg-amber-50/60 border border-amber-100/50 p-3 rounded-xl">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <div className="text-xs">
                              <span className="text-slate-400 font-medium">得标人：</span>
                              <span className="font-bold text-slate-700">{item.winner}</span>
                            </div>
                          </div>
                        )}
                        {!item.winner && item.status === 'finished' && (
                          <div className="mt-4 flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-xs text-slate-400 font-medium italic">无得标人流拍</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between gap-3">
                      <div className="text-[10px] text-slate-400 font-medium">
                        截止：{item.endTime}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditAuction(item)}
                          className="p-2.5 bg-slate-50 hover:bg-brand/10 text-slate-500 hover:text-brand rounded-xl transition-all"
                          title="修改"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAuction(item.id, item.name)}
                          className="p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredAuctions.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <Gavel className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-bold">没有对应拍卖商品</p>
                    <p className="text-xs text-slate-300 mt-1">上架一件极具吸引力的奖品来活跃气氛吧！</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================= OTHER MANAGEMENT PANEL ================= */}
          {subTab === 'misc' && (
            <motion.div
              key="misc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Card 1: 修改密码 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="p-3 bg-brand/10 text-brand rounded-2xl">
                      <Lock className="w-6 h-6" />
                    </span>
                    <div>
                      <h4 className="font-black text-slate-800 text-xl">修改系统登录密码</h4>
                      <p className="text-slate-400 text-xs font-semibold">修改后台管理者的安全校验登录密码</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">当前密码</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="输入当前的管理员校验密码 (默认 admin123)"
                        className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">新密码</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="设置不低于4位的新密码"
                        className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">确认新密码</label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="再次输入新设置的密码"
                        className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-95"
                    >
                      提交修改密码
                    </button>
                  </form>
                </div>
              </div>

              {/* Card 2: 新学期历史记录清除 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                      <RefreshCw className="w-6 h-6" />
                    </span>
                    <div>
                      <h4 className="font-black text-slate-800 text-xl">新学期记录重置</h4>
                      <p className="text-slate-400 text-xs font-semibold">清除本学期的冗余积分变动和兑换历史，不改动已有学员点数</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-amber-50/85 border border-amber-100 p-5 rounded-2xl flex gap-3.5">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-amber-800 block">数据优化提示（防止冗余）</span>
                        <span className="text-[11px] text-amber-600 block leading-relaxed mt-1">
                          此操作仅用于彻底清理本学期产生的历史痕迹与流水账目（日志、兑换申请），<strong>不会将学生已获得的可用积分归零</strong>。请放心执行。
                        </span>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex gap-3.5">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block">积分安全保障</span>
                        <span className="text-[11px] text-emerald-600 block leading-relaxed mt-1">
                          各位学生的积分点数将被安全保留。此按钮只用来协助教师预防老学期数据的累积冗余。
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-100/50 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">受影响学员数量：</span>
                        <span className="font-mono font-black text-slate-700">{students.length} 名学生</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">学生目前可用积分：</span>
                        <span className="font-mono font-bold text-teal-600">全面保留 (安全无损)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">一键清理账单流：</span>
                        <span className="font-mono font-bold text-rose-500">积分变动日志、商品兑换历史</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={triggerFirstConfirm}
                      className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      一键清空本学期记录 (双重校验)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ======================================================= MODALS ======================================================= */}
      
      {/* 1. Student Add/Edit Modal */}
      <AnimatePresence>
        {isStudentModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStudentModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {editingStudent ? '修改学员资料' : '录入新学员'}
              </h3>
              <p className="text-slate-400 text-xs font-semibold mb-6">完善基础档案与课程托管服务等状态</p>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">学生姓名</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="张二明"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                  />
                </div>

                {/* Single Choice State: Online / Offline */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">上课模式 (单选状态)</label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setStudentForm(prev => ({ ...prev, mode: 'online' }))}
                      className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                        studentForm.mode === 'online'
                          ? 'bg-blue-600 text-white shadow-md font-extrabold scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                      }`}
                    >
                      线上
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentForm(prev => ({ ...prev, mode: 'offline' }))}
                      className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                        studentForm.mode === 'offline'
                          ? 'bg-purple-600 text-white shadow-md font-extrabold scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                      }`}
                    >
                      线下
                    </button>
                  </div>
                </div>

                {/* Multiple Choice State: Zhongtuo / Wantuo */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">托管类型 (多选状态)</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'zhongtuo', label: '中托' },
                      { id: 'wantuo', label: '晚托' }
                    ].map(type => {
                      const isSelected = studentForm.careTypes.includes(type.id);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setStudentForm(prev => {
                              const careTypes = prev.careTypes.includes(type.id)
                                ? prev.careTypes.filter(id => id !== type.id)
                                : [...prev.careTypes, type.id];
                              return { ...prev, careTypes };
                            });
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-brand bg-brand-light text-brand shadow-xs font-semibold'
                              : 'border-slate-150 bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <span>{type.label}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-extrabold ${
                            isSelected ? 'bg-brand border-brand text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">当前积分数值</label>
                  <input
                    type="number"
                    required
                    value={studentForm.points}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsStudentModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl transition-colors font-bold text-sm"
                  >
                    提交保存
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Direct Point Adjust Modal */}
      <AnimatePresence>
        {isPointModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPointModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">调整积分变动</h3>
              <p className="text-slate-400 text-xs font-semibold mb-5">正在为学员 <span className="text-brand font-black">{pointTargetStudent?.name}</span> 处理评分</p>

              {/* Independent Toggle Switch Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setIsCustomPoint(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !isCustomPoint 
                      ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📋 选用分类预设
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomPoint(true)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCustomPoint 
                      ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ✨ 独立自定义评分
                </button>
              </div>

              <form onSubmit={handlePointSubmit} className="space-y-4">
                {!isCustomPoint ? (
                  /* Presets Path */
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">选择评分预设项 (评分项维护)</label>
                      <select
                        required
                        value={selectedPointItemId}
                        onChange={(e) => {
                          if (e.target.value === 'custom-option') {
                            setIsCustomPoint(true);
                          } else {
                            setSelectedPointItemId(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                      >
                        <option value="" disabled>-- 请选择评分预设 --</option>
                        {pointItems.filter(item => item.type === 'default').length > 0 && (
                          <optgroup label="🟢 默认加分项">
                            {pointItems.filter(item => item.type === 'default').map(item => (
                              <option key={item.id} value={item.id} className="font-semibold text-emerald-600">
                                {item.label} (+{item.value} 积分)
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {pointItems.filter(item => item.type === 'other').length > 0 && (
                          <optgroup label="🔵 其他加分项">
                            {pointItems.filter(item => item.type === 'other').map(item => (
                              <option key={item.id} value={item.id} className="font-semibold text-blue-600">
                                {item.label} (+{item.value} 积分)
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {pointItems.filter(item => item.type === 'deduct').length > 0 && (
                          <optgroup label="🔴 减分项">
                            {pointItems.filter(item => item.type === 'deduct').map(item => (
                              <option key={item.id} value={item.id} className="font-semibold text-rose-600">
                                {item.label} (-{item.value} 积分)
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="⚙️ 特殊快捷指令">
                          <option value="custom-option" className="font-bold text-brand-dark bg-brand/5">
                            ✨ 使用独立自定义调分 (自由输入)
                          </option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Pre-calculated points preview badge */}
                    {(() => {
                      const currentItem = pointItems.find(pi => pi.id === selectedPointItemId);
                      if (!currentItem) return null;
                      const isAdd = currentItem.type !== 'deduct';
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl flex items-center justify-between font-bold text-xs ${
                            isAdd ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isAdd ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            当前变动作业类型
                          </span>
                          <span className="font-mono font-black text-sm">
                            {isAdd ? `+${currentItem.value}` : `-${currentItem.value}`} pts
                          </span>
                        </motion.div>
                      );
                    })()}
    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">备注信息 / 详细说明 (选填)</label>
                      <input
                        type="text"
                        value={pointRemark}
                        onChange={(e) => setPointRemark(e.target.value)}
                        placeholder="可在此添加具体评价、备注内容（选填）"
                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  /* Custom Path (加减分/分数自定义/备注必填/独立) */
                  <div className="space-y-4">
                    {/* 1. Point Direction Switch */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">挑选评分类型</label>
                      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setCustomPointType('add')}
                          className={`py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                            customPointType === 'add'
                              ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          加分 (+)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomPointType('deduct')}
                          className={`py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                            customPointType === 'deduct'
                              ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                          减分 (-)
                        </button>
                      </div>
                    </div>

                    {/* 2. Custom Point Value */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        自定义评分数值 <span className="text-rose-500 font-extrabold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="1"
                          max="10000"
                          value={customPointValue}
                          onChange={(e) => setCustomPointValue(e.target.value)}
                          placeholder="请输入自定义分数"
                          className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-black text-sm text-slate-400">
                          {customPointType === 'add' ? '+' : '-'}{Number(customPointValue) || 0} pts
                        </span>
                      </div>
                    </div>

                    {/* 3. Mandatory Remark */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        评分真实备注 (必填) <span className="text-rose-500 font-extrabold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customPointRemark}
                        onChange={(e) => setCustomPointRemark(e.target.value)}
                        placeholder="请输入变动原因（备注不可为空）"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/10 transition-all"
                      />
                    </div>
                  </div>
                )}
 
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsPointModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3.5 text-white rounded-xl transition-colors font-bold text-sm ${
                      isCustomPoint
                        ? (customPointType === 'add' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10' : 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/10')
                        : (() => {
                            const currentItem = pointItems.find(pi => pi.id === selectedPointItemId);
                            const isAdd = currentItem?.type !== 'deduct';
                            return isAdd ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600';
                          })()
                    }`}
                  >
                    确认评分
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Reward Add/Edit Modal */}
      <AnimatePresence>
        {isRewardModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRewardModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {editingReward ? '修改礼品规格' : '上架新礼品奖励'}
              </h3>
              <p className="text-slate-400 text-xs font-semibold mb-6">配置礼品的分类、价值积分及展示图片</p>

              <form onSubmit={handleRewardSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">礼品名称</label>
                  <input
                    type="text"
                    required
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="精装钢笔、专属午餐等..."
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">所需积分售价</label>
                  <input
                    type="number"
                    required
                    value={rewardForm.points}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">所属类别组</label>
                  <select
                    value={rewardForm.category}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">礼品图片</label>
                  
                  {rewardForm.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group">
                      <img 
                        src={rewardForm.image} 
                        alt="礼品预览" 
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md cursor-pointer transition-all hover:scale-105 inline-flex items-center gap-1.5 text-xs font-bold">
                          <Upload className="w-4 h-4" />
                          <span>重新上传</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleGiftImageUpload} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setRewardForm(prev => ({ ...prev, image: '' }))}
                          className="p-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-1.5 text-xs font-bold animate-none"
                        >
                          <X className="w-4 h-4" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-brand/40 hover:bg-slate-50/50 rounded-2xl p-6 cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-brand/5 text-slate-400 group-hover:text-brand flex items-center justify-center mb-3 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-brand">点击选择或拖拽图片上传</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">支持 JPG, PNG, WEBP格式，最大 2MB</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleGiftImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">礼品描述细节</label>
                  <textarea
                    value={rewardForm.description}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="简单说明一下此礼品的获得标准或兑换实物内容..."
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRewardModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl transition-colors font-bold text-sm"
                  >
                    提交发布
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Category Add/Edit Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {editingCategory ? '修改分类' : '新建礼品分类'}
              </h3>
              <p className="text-slate-400 text-xs font-semibold mb-6">设置分类标识符（不可重复）与友好显示名</p>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">分类唯编码(ID)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCategory}
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, id: e.target.value.toLowerCase() }))}
                    placeholder="例如: office"
                    className="w-full px-4 py-3.5 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">分类名称</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="例如: 办公用品"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl transition-colors font-bold text-sm"
                  >
                    确定保存
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Point Item Add/Edit Modal */}
      <AnimatePresence>
        {isPointItemModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPointItemModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {editingPointItem 
                  ? (pointItemForm.type === 'deduct' ? '修改减分项' : '修改加分项') 
                  : (pointItemForm.type === 'deduct' ? '新建减分项' : '新建加分项')}
              </h3>
              <p className="text-slate-400 text-xs font-semibold mb-6">
                {pointItemForm.type === 'deduct' 
                  ? '设置扣减规则的名称与对应的扣减点数' 
                  : '设置加分规则的名称与对应的加分点数'}
              </p>

              <form onSubmit={handlePointItemSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">评分项分类</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPointItemForm(prev => ({ ...prev, type: 'default' }))}
                      className={`py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${
                        pointItemForm.type === 'default'
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      默认加分
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointItemForm(prev => ({ ...prev, type: 'other' }))}
                      className={`py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${
                        pointItemForm.type === 'other'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      其他加分
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointItemForm(prev => ({ ...prev, type: 'deduct' }))}
                      className={`py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${
                        pointItemForm.type === 'deduct'
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      减分项
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    {pointItemForm.type === 'deduct' ? '减分项名称' : '加分项名称'}
                  </label>
                  <input
                    type="text"
                    required
                    value={pointItemForm.label}
                    onChange={(e) => setPointItemForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder={pointItemForm.type === 'deduct' ? "例如: 未交作业 / 课堂分心" : "例如: 作业优秀 / 按时签到"}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    {pointItemForm.type === 'deduct' ? '扣减积分绝对值' : '奖励加积分值'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={pointItemForm.value}
                    onChange={(e) => setPointItemForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsPointItemModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3.5 text-white rounded-xl transition-colors font-bold text-sm ${
                      pointItemForm.type === 'default' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                      pointItemForm.type === 'other' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'
                    }`}
                  >
                    确定保存
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Auction Add/Edit Modal */}
      <AnimatePresence>
        {isAuctionModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuctionModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[85vh] no-scrollbar"
            >
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {editingAuction ? '修改拍卖品信息' : '发布新拍卖品'}
              </h3>
              <p className="text-slate-400 text-xs font-semibold mb-6">配置起拍卖和商品状态</p>

              <form onSubmit={handleAuctionSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">商品名称</label>
                  <input
                    type="text"
                    required
                    value={auctionForm.name}
                    onChange={(e) => setAuctionForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：定制马克杯、免写一次卡..."
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">商品描述</label>
                  <textarea
                    value={auctionForm.description}
                    onChange={(e) => setAuctionForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入商品说明、特殊属性描述..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">起拍积分</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={auctionForm.minPoints}
                    onChange={(e) => setAuctionForm(prev => ({ ...prev, minPoints: Number(e.target.value) }))}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">商品封面图片</label>
                  
                  {auctionForm.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group">
                      <img 
                        src={auctionForm.image} 
                        alt="商品预览" 
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md cursor-pointer transition-all hover:scale-105 inline-flex items-center gap-1.5 text-xs font-bold">
                          <Upload className="w-4 h-4" />
                          <span>重新上传</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAuctionImageUpload} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuctionForm(prev => ({ ...prev, image: '' }))}
                          className="p-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-1.5 text-xs font-bold animate-none"
                        >
                          <X className="w-4 h-4" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-brand/40 hover:bg-slate-50/50 rounded-2xl p-6 cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-brand/5 text-slate-400 group-hover:text-brand flex items-center justify-center mb-3 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-brand">点击选择或拖拽图片上传</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">支持 JPG, PNG, WEBP 格式，最大 2MB</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAuctionImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAuctionModalOpen(false)}
                    className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl transition-colors font-bold text-sm shadow-md shadow-brand/10"
                  >
                    发布并上架
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Global Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden z-10"
            >
              {/* Alert Indicator */}
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-slate-800 tracking-tight text-center mb-2">
                确认要删除吗？
              </h3>
              
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                  正在删除{
                    deleteConfirm.type === 'student' ? '学员' :
                    deleteConfirm.type === 'reward' ? '礼品' :
                    deleteConfirm.type === 'category' ? '分类' :
                    deleteConfirm.type === 'auction' ? '拍卖商品' : '评分项'
                  }
                </p>
                <p className="text-sm font-black text-red-600 truncate animate-none">
                  {deleteConfirm.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-2">
                  此操作会立即从系统移除该项，且无法撤销！
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold text-sm cursor-pointer shadow-md shadow-red-500/10"
                >
                  确定删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 7. New Semester Reset Modal - Step 1/2 */}
      <AnimatePresence>
        {isFirstConfirmOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFirstConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden z-10 font-sans"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-slate-800 tracking-tight text-center mb-1">
                第一阶段：历史记录清理核实
              </h3>
              <p className="text-slate-400 text-xs font-semibold text-center mb-6">您即将彻底擦除本学期的变动明细与兑换流转单</p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">涉及学员总量</span>
                  <span className="font-mono font-black text-slate-700">{students.length} 名学生</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">重置后学员积分</span>
                  <span className="font-mono font-bold text-teal-600">全面安全保留 (不改变也绝不归零)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">将被清理的数据</span>
                  <span className="font-bold text-rose-600">
                    全站积分变动日志、兑换历史明细
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFirstConfirmOpen(false)}
                  className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmFirstStep}
                  className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-bold text-sm cursor-pointer shadow-md shadow-rose-500/10"
                >
                  下一步 (风险确认)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. New Semester Reset Modal - Step 2/2 */}
      <AnimatePresence>
        {isSecondConfirmOpen && (
          <div className="fixed inset-0 z-[310] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecondConfirmOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden z-10 border border-red-100 font-sans"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
                <AlertCircle className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-rose-600 tracking-tight text-center mb-1">
                核心警示：操作不可撤销
              </h3>
              <p className="text-slate-400 text-xs font-semibold text-center mb-6">此操作将清空整学期的变动明细与兑换流转单</p>

              <div className="bg-rose-50/40 border border-rose-100/50 rounded-2xl p-5 mb-6">
                <p className="text-xs text-rose-700 leading-relaxed font-bold text-center">
                  确定要安全清理本学期的流通冗余记录吗？<strong>学生的当前拥有积分将被保留</strong>。如果您十分确定，请在下方手动输入安全校验词 <span className="underline select-all text-red-600 font-mono font-bold tracking-widest bg-white px-2 py-0.5 rounded border border-rose-200">RESET</span> 确认：
                </p>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  required
                  value={typedConfirmation}
                  onChange={(e) => setTypedConfirmation(e.target.value)}
                  placeholder="手动输入 RESET 确认操作..."
                  className="w-full text-center px-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-rose-500 rounded-xl text-sm font-bold uppercase outline-none transition-all font-mono tracking-widest text-rose-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSecondConfirmOpen(false)}
                  className="flex-1 py-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 font-bold text-sm cursor-pointer"
                >
                  放弃退出
                </button>
                <button
                  type="button"
                  disabled={typedConfirmation.trim().toUpperCase() !== 'RESET'}
                  onClick={executeSemesterReset}
                  className={`flex-1 py-3.5 rounded-xl transition-all font-bold text-sm shadow-md cursor-pointer ${
                    typedConfirmation.trim().toUpperCase() === 'RESET'
                      ? 'bg-rose-600 hover:bg-red-600 text-white shadow-rose-500/10'
                      : 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                  }`}
                >
                  确定清理记录并重置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
