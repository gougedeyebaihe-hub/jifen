import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (password !== savedPassword) {
      toast.error('登录密码错误，请重试！');
      return;
    }
    // Simulate login
    onLogin({ name: '教育管理者', role: 'admin' });
    toast.success('登录成功，欢迎回来！');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Side: Branding/Visual */}
            <div className="md:w-1/2 bg-brand p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                     <ShieldCheck className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight leading-tight mb-4 italic uppercase">
                    Scholar<br/>Points
                  </h2>
                  <p className="text-brand-light/70 text-lg font-medium leading-relaxed">
                    更高效的数字教育激励平台，<br/>
                    记录每一份努力。
                  </p>
               </div>

               <div className="relative z-10 pt-12">
                  <div className="flex -space-x-4 mb-6">
                     {[1,2,3,4].map(i => (
                       <img 
                          key={i}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                          className="w-10 h-10 rounded-full border-2 border-brand bg-white" 
                       />
                     ))}
                     <div className="w-10 h-10 rounded-full border-2 border-brand bg-brand-dark flex items-center justify-center text-[10px] font-bold">
                        +2k
                     </div>
                  </div>
                  <p className="text-xs font-bold text-brand-light/50 uppercase tracking-[0.2em]">Trusted by 2000+ Educators</p>
               </div>

               {/* Abstract Shapes */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-dark/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
            </div>

            {/* Right Side: Form */}
            <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
               <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

               <div className="max-w-xs mx-auto w-full">
                  <div className="mb-10">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                      欢迎回来
                    </h3>
                    <p className="text-slate-400 font-medium text-sm mt-2">
                       请登录您的账户以继续管理积分
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="电子邮箱" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="密码" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand p-5 rounded-2xl text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all active:scale-[0.98] mt-6"
                    >
                      由我掌控
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
