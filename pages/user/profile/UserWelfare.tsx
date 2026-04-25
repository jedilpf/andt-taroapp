
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Ticket, Clock, ChevronRight, Check, Sparkles, ShoppingBag, Wrench, Zap, Wallet, Flame, AlertCircle, Timer, TrendingUp, Lock, Award, Loader2 } from 'lucide-react';

type Category = 'all' | 'service' | 'store' | 'subsidy';
type SessionStatus = 'ended' | 'ongoing' | 'upcoming';

interface SnatchCoupon {
    id: number;
    amount: number;
    title: string;
    total: number;
    left: number;
    category: Category;
}

const SESSIONS = [
    { id: 1, time: '10:00', status: 'ended' as SessionStatus },
    { id: 2, time: '14:00', status: 'ongoing' as SessionStatus },
    { id: 3, time: '20:00', status: 'upcoming' as SessionStatus },
];

const SNATCH_DATA: SnatchCoupon[] = [
    { id: 101, amount: 100, title: '全场通用无门槛红包', total: 10, left: 1, category: 'all' },
    { id: 102, amount: 80, title: '老旧电路改造专项补贴', total: 25, left: 3, category: 'service' },
    { id: 103, amount: 50, title: '商城惠民辅材满减券', total: 100, left: 42, category: 'store' },
    { id: 104, amount: 20, title: '故障报修人工抵扣券', total: 200, left: 135, category: 'service' },
    { id: 105, amount: 10, title: '社区生活通用津贴', total: 500, left: 412, category: 'all' },
    { id: 106, amount: 5, title: '便民驿站满减红包', total: 1000, left: 950, category: 'store' },
];

export const UserWelfare = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Category>('all');
    const [activeSession, setActiveSession] = useState(2);
    const [snatchingId, setSnatchingId] = useState<number | null>(null);
    const [claimedIds, setClaimedIds] = useState<number[]>([]);
    const [countdown, setCountdown] = useState('01:24:55');

    const filteredSnatch = useMemo(() => {
        return SNATCH_DATA.filter(c => activeTab === 'all' || c.category === activeTab);
    }, [activeTab]);

    const handleSnatch = (id: number) => {
        setSnatchingId(id);
        // 模拟抢券接口延迟
        setTimeout(() => {
            setClaimedIds(prev => [...prev, id]);
            setSnatchingId(null);
            // 提示成功
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
            audio.volume = 0.2;
            audio.play().catch(() => {});
        }, 1500);
    };

    return (
        <div className="h-full w-full bg-[#F8F9FA] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#E11D48] via-[#F43F5E] to-[#FB7185] px-4 pt-4 pb-14 relative overflow-hidden shrink-0 rounded-b-[3rem] shadow-2xl z-10">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] pointer-events-none"></div>
                
                <div className="flex items-center justify-between text-white relative z-20 mb-8">
                    <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-xl font-black tracking-tight">惠民福利中心</h1>
                    <button onClick={() => navigate('/user/coupons')} className="text-[10px] bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 font-bold active:bg-black/40">
                        我的资产
                    </button>
                </div>

                <div className="relative z-20 px-2">
                    <div className="flex items-center text-red-100 text-xs mb-1 font-black tracking-widest opacity-80 uppercase">
                        <Timer size={14} className="mr-1.5"/> Limited Time Snatch
                    </div>
                    <div className="flex items-baseline text-white">
                        <h2 className="text-5xl font-black tracking-tighter drop-shadow-lg">整点抢补贴</h2>
                    </div>
                    <p className="text-[10px] text-red-100 mt-2 font-medium bg-black/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm border border-white/5">
                        本月已为 2,451 位邻里累计节省 ¥28,510
                    </p>
                </div>
            </div>

            {/* Session Selector */}
            <div className="px-4 -mt-6 relative z-20 mb-4">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-red-900/10 p-1.5 flex items-center border border-white/50">
                    {SESSIONS.map(session => (
                        <button
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            className={`flex-1 flex flex-col items-center py-3 rounded-[1.8rem] transition-all relative overflow-hidden ${
                                activeSession === session.id 
                                ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <span className="text-lg font-black leading-none">{session.time}</span>
                            <span className={`text-[9px] font-black mt-1.5 uppercase tracking-tighter ${
                                activeSession === session.id ? 'text-red-400' : 
                                (session.status === 'ongoing' ? 'text-green-500' : 'text-slate-300')
                            }`}>
                                {session.status === 'ended' ? '已结束' : (session.status === 'ongoing' ? '抢购中' : '即将开启')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-4 flex items-center space-x-2 overflow-x-auto no-scrollbar mb-4 shrink-0">
                {[
                    { id: 'all', label: '全部' },
                    { id: 'service', label: '上门维修' },
                    { id: 'store', label: '商城购物' },
                    { id: 'subsidy', label: '政府专项' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Category)}
                        className={`flex items-center px-6 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap border-2 ${
                            activeTab === tab.id 
                            ? 'bg-red-50 text-red-600 border-red-500 shadow-sm scale-105' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Snatch List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 space-y-4 pt-1">
                {filteredSnatch.map(item => {
                    const progress = (item.left / item.total) * 100;
                    const isSoldOut = item.left === 0;
                    const isClaimed = claimedIds.includes(item.id);
                    const isSnatching = snatchingId === item.id;
                    const isUpcoming = SESSIONS.find(s => s.id === activeSession)?.status === 'upcoming';
                    
                    return (
                        <div key={item.id} className={`bg-white rounded-[2.5rem] p-5 flex items-center shadow-sm border border-slate-100 relative transition-all ${isSoldOut ? 'opacity-60 grayscale' : 'active:scale-[0.98]'}`}>
                            <div className="w-24 shrink-0 flex flex-col items-center justify-center border-r border-dashed border-slate-100 mr-5 pr-2">
                                <div className={`flex items-baseline font-black ${isSoldOut ? 'text-slate-400' : 'text-red-600'}`}>
                                    <span className="text-sm mr-0.5 font-bold italic">¥</span>
                                    <span className="text-4xl tracking-tighter">{item.amount}</span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Subsidy</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-slate-800 text-[13px] truncate leading-tight mb-2">{item.title}</h3>
                                
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex justify-between text-[9px] font-black text-slate-400 px-0.5">
                                        <span>已抢 {progress.toFixed(0)}%</span>
                                        <span className={isSoldOut ? 'text-slate-300' : 'text-red-500'}>仅剩 {item.left} 张</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${isSoldOut ? 'bg-slate-300' : 'bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`} 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => handleSnatch(item.id)}
                                        disabled={isSoldOut || isClaimed || isSnatching || isUpcoming}
                                        className={`px-6 py-2.5 rounded-full text-[11px] font-black transition-all shadow-lg flex items-center ${
                                            isUpcoming ? 'bg-blue-50 text-blue-400 cursor-not-allowed shadow-none' :
                                            isClaimed ? 'bg-green-50 text-green-600 border border-green-100 shadow-none' :
                                            isSoldOut ? 'bg-slate-100 text-slate-300 shadow-none' :
                                            'bg-slate-900 text-white active:scale-90 hover:shadow-slate-300'
                                        }`}
                                    >
                                        {isSnatching ? (
                                            <><Loader2 size={12} className="animate-spin mr-1.5" /> 抢购中</>
                                        ) : isUpcoming ? (
                                            <><Lock size={12} className="mr-1.5"/> 待开启</>
                                        ) : isClaimed ? (
                                            <><Check size={12} className="mr-1.5"/> 已领取</>
                                        ) : isSoldOut ? (
                                            '已抢光'
                                        ) : (
                                            <>立即抢购 <ChevronRight size={14} className="ml-0.5"/></>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Ticket Decoration */}
                            <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-[#F8F9FA] rounded-full -translate-y-1/2 shadow-inner border border-slate-100/50"></div>
                            <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-[#F8F9FA] rounded-full -translate-y-1/2 shadow-inner border border-slate-100/50"></div>
                        </div>
                    );
                })}

                <div className="py-12 text-center opacity-20">
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase">Andiantong Community Welfare</p>
                </div>
            </div>

            {/* Claimed Notification Floating */}
            {claimedIds.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center z-[100] animate-slide-up border border-white/10">
                    <Check size={18} className="text-green-400 mr-2" strokeWidth={4}/>
                    <span className="text-sm font-black tracking-tight">已成功放入卡包，请尽快使用</span>
                </div>
            )}
        </div>
    );
};
