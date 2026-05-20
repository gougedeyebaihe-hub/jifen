import { Student, Reward } from './types';

export const STUDENTS_MOCK: Student[] = [
  {
    id: '1',
    name: '张晓明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    class: '初二 (3) 班',
    points: 9200,
    recentPoints: 11,
    activities: [
      { label: '按时签到', value: 2 },
      { label: '作业优秀', value: 5 },
      { label: '阅读打卡', value: 4 }
    ],
    mode: 'online',
    careTypes: ['zhongtuo']
  },
  {
    id: '2',
    name: '李思源',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    class: '初二 (3) 班',
    points: 8450,
    recentPoints: 10,
    activities: [
      { label: '按时签到', value: 2 },
      { label: '作业优秀', value: 5 },
      { label: '纪律良好', value: 3 }
    ],
    mode: 'offline',
    careTypes: ['wantuo']
  },
  {
    id: '3',
    name: '王美丽',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb',
    class: '初二 (3) 班',
    points: 7890,
    recentPoints: 0,
    activities: [],
    mode: 'online',
    careTypes: ['zhongtuo', 'wantuo']
  },
  {
    id: '4',
    name: '陈语涵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    class: '初二 (3) 班',
    points: 2100,
    recentPoints: 4,
    activities: [
      { label: '按时签到', value: 2 },
      { label: '乐于助人', value: 2 }
    ],
    mode: 'offline',
    careTypes: []
  },
  {
    id: '5',
    name: '黄宇航',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krystal',
    class: '初二 (3) 班',
    points: 6400,
    mode: 'online',
    careTypes: ['zhongtuo']
  },
  {
    id: '6',
    name: '赵佳欣',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason',
    class: '初二 (3) 班',
    points: 5980,
    mode: 'offline',
    careTypes: ['wantuo']
  },
  {
    id: '7',
    name: '周杰伦',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    class: '初二 (3) 班',
    points: 5500,
    mode: 'online',
    careTypes: ['zhongtuo', 'wantuo']
  },
  {
    id: '8',
    name: '吴亦凡',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    class: '初二 (3) 班',
    points: 5100,
    mode: 'offline',
    careTypes: ['wantuo']
  },
  {
    id: '9',
    name: '郑爽',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    class: '初二 (3) 班',
    points: 4800,
    mode: 'online',
    careTypes: ['zhongtuo']
  },
  {
    id: '10',
    name: '蔡徐坤',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    class: '初二 (1) 班',
    points: 4500,
    mode: 'offline',
    careTypes: ['zhongtuo']
  },
  {
    id: '11',
    name: '易烊千玺',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    class: '初二 (2) 班',
    points: 4200,
    mode: 'online',
    careTypes: ['wantuo']
  }
];

export const AUCTION_MOCK: { active: any[], finished: any[] } = {
  active: [
    {
      id: 'a1',
      name: '限量版校徽套装',
      description: '十年校庆限量纪念版，包含金银铜三色校徽。',
      minPoints: 2000,
      currentBid: 3500,
      endTime: '2026-05-25T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400',
      status: 'active'
    },
    {
      id: 'a2',
      name: '校长共进午餐券',
      description: '与校长面对面交流，获得人生指导。',
      minPoints: 5000,
      currentBid: 7200,
      endTime: '2026-05-22T12:00:00Z',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=400',
      status: 'active'
    }
  ],
  finished: [
    {
      id: 'f1',
      name: '图书馆VIP包厢一周',
      description: '专享安静学习空间，配备舒适沙发和空调。',
      minPoints: 1000,
      currentBid: 4500,
      endTime: '2026-05-15T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400',
      status: 'finished',
      winner: '张晓明'
    },
    {
      id: 'f2',
      name: '校运会开幕式旗手',
      description: '代表全校学生在校运会开幕式上举旗。',
      minPoints: 3000,
      currentBid: 12000,
      endTime: '2026-05-10T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400',
      status: 'finished',
      winner: '李思源'
    }
  ]
};

export const REWARDS_MOCK: Reward[] = [
  {
    id: 'r1',
    name: 'Lamy 钢笔',
    description: '高品质书写体验，德国制造的经典款钢笔。',
    points: 1500,
    image: 'https://images.unsplash.com/photo-1583485088034-7160b5b18145?auto=format&fit=crop&q=80&w=400',
    category: 'stationery'
  },
  {
    id: 'r2',
    name: '免做作业卡一次',
    description: '可抵消一次常规家庭作业（需班主任签字确认）。',
    points: 3000,
    icon: 'FileText',
    category: 'campus'
  },
  {
    id: 'r3',
    name: 'Kindle 阅读器',
    description: '沉浸式阅读体验，护眼电子墨水屏。',
    points: 8000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    category: 'electronics'
  },
  {
    id: 'r4',
    name: '定制笔记本套装',
    description: '包含精装笔记本、书签及多色中性笔。',
    points: 800,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400',
    category: 'stationery'
  },
  {
    id: 'r5',
    name: '食堂VIP专属通道',
    description: '午餐时间无需排队，享受VIP通道一周。',
    points: 2500,
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=400',
    category: 'campus'
  }
];
