
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, ClipboardList, User, Briefcase, DollarSign, ShieldCheck, Zap, PlaySquare, ShoppingBag, LayoutGrid, Shield, Gift, HeartHandshake, X } from 'lucide-react';

export const MapLoading = () => {
  const [text, setText] = React.useState('正在定位您的位置...');
  
  React.useEffect(() => {
      const texts = ['正在定位您的位置...', '正在加载地图数据...', '正在搜寻附近师傅...'];
      let i = 0;
      const timer = setInterval(() => {
          i = (i + 1) % texts.length;
          setText(texts[i]);
      }, 1500);
      return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-slate-50 flex flex-col items-center justify-center touch-none overflow-hidden animate-fade-in">
       <div className="absolute inset-0 pointer-events-none opacity-30" 
            style={{
                backgroundImage: `
                    linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                    linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)'
            }}>
       </div>

       <div className="relative mb-12 scale-125">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-green-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] border border-green-500/30 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
           
           <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-2xl shadow-green-500/20 flex items-center justify-center p-1.5 ring-4 ring-green-50">
                <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center border border-green-100 relative overflow-hidden">
                     <div className="absolute inset-0 animate-[spin_3s_linear_infinite] origin-center">
                         <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400/10 to-transparent blur-sm transform rotate-45"></div>
                     </div>
                     <Zap size={36} className="text-green-600 fill-green-600 relative z-20 animate-pulse" />
                </div>
           </div>
       </div>

       <div className="relative z-20 flex flex-col items-center space-y-5">
           <h3 className="text-2xl font-black text-gray-800 tracking-wide">安电通</h3>
           <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-green-100 shadow-xl shadow-green-100/50 flex items-center space-x-3">
               <div className="flex space-x-1.5">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
               </div>
               <span className="text-xs font-bold text-gray-600 min-w-[120px] text-center tracking-wide">{text}</span>
           </div>
       </div>
    </div>
  );
};

export const BottomNav: React.FC<{ role: 'USER' | 'ELECTRICIAN' }> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPointsBubble, setShowPointsBubble] = useState(() => {
      return sessionStorage.getItem('pointsBubbleClosed') !== 'true';
  });

  const isActive = (path: string) => location.pathname.startsWith(path);

  const closeBubble = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowPointsBubble(false);
      sessionStorage.setItem('pointsBubbleClosed', 'true');
  };

  if (role === 'ELECTRICIAN') {
      const navItems = [
        { path: '/electrician/hall', icon: Briefcase, label: '任务大厅' },
        { path: '/electrician/tasks', icon: ClipboardList, label: '我的任务' },
        { path: '/electrician/income', icon: DollarSign, label: '收入' },
        { path: '/electrician/profile', icon: User, label: '个人中心' },
      ];
      
      return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[60] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-14 max-w-screen-md mx-auto">
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)} 
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-[10px] ${isActive(item.path) ? "text-green-600 font-bold" : "text-gray-400 hover:text-gray-600"}`}
              >
                <item.icon size={24} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[60] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-end h-16 px-2 max-w-screen-md mx-auto">
            <button onClick={() => navigate('/user/home')} className={`flex-1 flex flex-col items-center justify-center h-14 pb-1 space-y-0.5 ${isActive('/user/home') ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                <LayoutGrid size={24} strokeWidth={isActive('/user/home') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">首页</span>
            </button>
            
            <button onClick={() => navigate('/user/store')} className={`flex-1 flex flex-col items-center justify-center h-14 pb-1 space-y-0.5 ${isActive('/user/store') ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                <ShoppingBag size={24} strokeWidth={isActive('/user/store') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">生活商城</span>
            </button>

            <div className="relative -top-7 w-20 flex justify-center z-10">
                {showPointsBubble && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 animate-bounce" style={{animationDuration: '3s'}}>
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center tracking-wide group pr-7">
                            积分抵物业费！
                            <button 
                                onClick={closeBubble}
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20"
                            >
                                <X size={8} strokeWidth={4} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-amber-500 rotate-45"></div>
                    </div>
                )}

                <button 
                    onClick={() => navigate('/user/points-mall')}
                    className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-[5px] border-white active:scale-90 transition-all duration-300 group relative overflow-visible"
                >
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none"></div>
                    <div className="relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-active:rotate-3 flex-col">
                        <HeartHandshake size={32} className="text-white drop-shadow-sm mb-0.5" strokeWidth={2} />
                        <span className="text-[10px] font-black text-amber-50 tracking-tighter leading-none shadow-black drop-shadow-sm">社区福利</span>
                    </div>
                </button>
            </div>

            <button onClick={() => navigate('/user/community')} className={`flex-1 flex flex-col items-center justify-center h-14 pb-1 space-y-0.5 ${isActive('/user/community') ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                <PlaySquare size={24} strokeWidth={isActive('/user/community') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">社区视界</span>
            </button>
            <button onClick={() => navigate('/user/profile')} className={`flex-1 flex flex-col items-center justify-center h-14 pb-1 space-y-0.5 ${isActive('/user/profile') ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                <User size={24} strokeWidth={isActive('/user/profile') ? 2.5 : 2} />
                <span className="text-[10px] font-medium">我的</span>
            </button>
        </div>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    'Pending': { label: '待接单', color: 'bg-yellow-100 text-yellow-800' },
    'Accepted': { label: '已接单', color: 'bg-blue-100 text-blue-800' },
    'Arrived': { label: '已上门', color: 'bg-indigo-100 text-indigo-800' },
    'In Progress': { label: '服务中', color: 'bg-purple-100 text-purple-800' },
    'Completed': { label: '已完成', color: 'bg-green-100 text-green-800 font-bold border border-green-200' },
    'Paid': { label: '待收货', color: 'bg-blue-50 text-blue-600 font-bold border border-blue-100' },
    'Cancelled': { label: '已取消', color: 'bg-red-100 text-red-800' }
  };

  const config = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] ${config.color}`}>
      {config.label}
    </span>
  );
};
