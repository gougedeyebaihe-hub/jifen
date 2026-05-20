import { Tab } from '../types';
import { LogIn } from 'lucide-react';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLoginClick: () => void;
  user: any;
}

export default function Navbar({ activeTab, setActiveTab, onLoginClick, user }: NavbarProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'quick-add', label: '快捷加分' },
    { id: 'leaderboard', label: '积分榜' },
    { id: 'auction', label: '拍卖' },
    { id: 'shop', label: '兑换商城' },
    { id: 'admin', label: '管理后台' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 rounded-b-[2rem]">
      <div className="flex items-center shrink-0">
        <span className="text-brand font-black text-xl md:text-2xl tracking-tighter italic uppercase">SP</span>
        <span className="hidden sm:inline text-brand font-bold text-xl md:text-2xl ml-1 tracking-tight">ScholarPoints</span>
      </div>
      
      <div className="flex items-center overflow-x-auto no-scrollbar md:overflow-visible flex-1 md:flex-none justify-center md:justify-start mx-2 md:mx-0 py-1 md:py-0 md:space-x-8 scroll-smooth">
        <div className="flex items-center space-x-6 md:space-x-8 px-4 md:px-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm md:text-base font-bold transition-all relative pb-1 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-brand border-b-2 border-brand scale-105' 
                  : 'text-slate-400 hover:text-brand'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <button 
          onClick={onLoginClick}
          className="bg-brand-light text-brand p-2.5 md:px-6 md:py-2.5 rounded-full font-bold hover:bg-[#d1ecd8] transition-colors shadow-sm flex items-center gap-2"
        >
          <LogIn className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:inline">{user ? user.name : '登录'}</span>
        </button>
      </div>
    </nav>
  );
}
