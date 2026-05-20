export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  points: number;
  recentPoints?: number;
  activities?: Activity[];
  mode?: 'online' | 'offline'; // 'online' = 线上, 'offline' = 线下
  careTypes?: string[];       // ['zhongtuo', 'wantuo'] 等
}

export interface Activity {
  label: string;
  value: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image?: string;
  icon?: string;
  category: 'stationery' | 'campus' | 'electronics' | 'other';
}

export interface AuctionItem {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  currentBid: number;
  endTime: string;
  image: string;
  status: 'active' | 'finished';
  winner?: string;
}

export type Tab = 'quick-add' | 'leaderboard' | 'auction' | 'shop' | 'admin';

export interface PointItem {
  id: string;
  label: string;
  value: number;
  type: 'default' | 'other' | 'deduct'; // 'default' = 默认加分项, 'other' = 其他加分项, 'deduct' = 减分项
}
