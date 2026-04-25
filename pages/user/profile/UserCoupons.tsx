import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added missing 'Award' import from lucide-react
import { ArrowLeft, Gift, Ticket, Clock, ChevronRight, Check, Sparkles, ShoppingBag, Wrench, Zap, Wallet, Flame, AlertCircle, Timer, TrendingUp, Lock, Award } from 'lucide-react';

// --- Types ---
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

// --- Mock Data ---
const SESSIONS = [
    { id: 1, time: '10:00', status: 'ended' as SessionStatus },
    { id: 2, time: '14:00', status: 'ongoing' as SessionStatus },
    { id: 3, time: '20:00', status: 'upcoming' as SessionStatus },
];

const SNATCH_DATA: SnatchCoupon[] = [
    // 100元 - 极少量
    { id: 101, amount: 100, title: '全场通用无门槛', total: 10, left: 1, category: 'all' },
    // 80元 - 少量
    { id: 102, amount: 80, title: '电路改造专项补贴', total: 25, left: 3, category: 'service' },
    // 50元 - 适中
    { id: 103, amount: 50, title: '商城耗材满减券', total: 100, left: 42, category: 'store' },
    // 20元 - 较多
    { id: 104, amount: 20, title: '上门维修抵扣券', total: 200, left: 135, category: 'service' },
    // 10元 - 充沛
    { id: 105, amount: 10, title: '惠民通用红包', total: 500, left: 412, category: 'all' },
    // 5元 - 海量
    { id: 106, amount: 5, title: '便民驿站运费券', total: 1000, left: 950, category: 'store' },
];

export const UserCoupons = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Category>('all');
    const [activeSession, setActiveSession] = useState(2); // Default to ongoing 14:00
    const [claimedIds, setClaimedIds] = useState<number[]>([]);
    
    // Countdown Timer Logic
    const [countdown, setCountdown] = useState('01:24:55');

    const filteredSnatch = useMemo(() => {
        return SNATCH_DATA.filter(c => activeTab === 'all' || c.category === activeTab);
    }, [activeTab]);

    const handleSnatch = (id: number, left: number) => {
        if (left <= 0) return;
        if (claimedIds.includes(id)) return;
        setClaimedIds(prev => [...prev, id]);
        // Simulate a small toast or vibration could go here
    };

    return (
        <div className="h-full w-full bg-[#F8F9FA] flex flex-col relative overflow-hidden">
            {/* --- Immersive Header (Removed Points) --- */}
            <div className="bg-gradient-to-br from-[#E11D48] via-[#F43F5E] to-[#FB7185] px-4 pt-4 pb-14 relative overflow-hidden shrink-0 rounded-b-[3rem] shadow-2xl z-10">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] pointer-events-none"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-yellow-400 mix-blend-overlay blur-[90px] rounded-full pointer-events-none animate-pulse"></div>
                
                {/* Navbar */}
                <div className="flex items-center justify-between text-white relative z-20 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-xl font-black tracking-tight">惠民福利中心</h1>
                    <button className="text-[10px] bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 font-bold">
                        规则
                    </button>
                </div>

                {/* Savings Stats */}
                <div className="relative z-20 px-2">
                    <div className="flex items-center text-red-100 text-xs mb-1 font-black uppercase tracking-widest opacity-80">
                        <Wallet size={14} className="mr-1.5"/> Accumulated Savings
                    </div>
                    <div className="flex items-baseline text-white">
                        <span className="text-2xl font-black mr-1">¥</span>
                        <h2 className="text-6xl font-black tracking-tighter drop-shadow-lg">285.50</h2>
                    </div>
                    <p className="text-[10px] text-red-100 mt-2 font-medium bg-black/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-white/5">
                        本月已为 2,451 位社区居民节省开支
                    </p>
                </div>
            </div>

            {/* --- Session Selector (Timed Snatch) --- */}
            <div className="px-4 -mt-6 relative z-20 mb-4">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-1 flex items-center border border-gray-50">
                    {SESSIONS.map(session => (
                        <button
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            className={`flex-1 flex flex-col items-center py-3 rounded-[1.3rem] transition-all relative ${
                                activeSession === session.id 
                                ? 'bg-gray-900 text-white shadow-lg scale-105' 
                                : 'text-gray-400'
                            }`}
                        >
                            <span className="text-lg font-black">{session.time}</span>
                            <span className={`text-[10px] font-bold ${
                                activeSession === session.id ? 'text-red-400' : 
                                (session.status === 'ongoing' ? 'text-green-500' : 'text-gray-400')
                            }`}>
                                {session.status === 'ended' ? '已结束' : (session.status === 'ongoing' ? '抢购中' : '即将开始')}
                            </span>
                            {session.status === 'ongoing' && activeSession !== session.id && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Category Tabs --- */}
            <div className="px-4 flex items-center space-x-2 overflow-x-auto no-scrollbar mb-4 shrink-0">
                {[
                    { id: 'all', label: '全部补贴', icon: Sparkles },
                    { id: 'service', label: '上门维修', icon: Wrench },
                    { id: 'store', label: '商城购物', icon: ShoppingBag },
                    { id: 'subsidy', label: '政府专项', icon: Award }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Category)}
                        className={`flex items-center px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap border ${
                            activeTab === tab.id 
                            ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
                            : 'bg-white text-gray-500 border-gray-100'
                        }`}
                    >
                        <tab.icon size={12} className="mr-1.5"/>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* --- Snatch Grid --- */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 space-y-4 pt-1">
                {/* Countdown Header */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center text-gray-800 font-black text-sm">
                        <Timer size={16} className="mr-1.5 text-red-500"/> 距离本场结束还剩
                        <span className="ml-2 font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{countdown}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center">
                        <TrendingUp size={12} className="mr-1"/> 1.2w 人在抢
                    </span>
                </div>

                {filteredSnatch.map(item => {
                    const progress = (item.left / item.total) * 100;
                    const isSoldOut = item.left === 0;
                    const isClaimed = claimedIds.includes(item.id);
                    const isUpcoming = SESSIONS.find(s => s.id === activeSession)?.status === 'upcoming';
                    
                    return (
                        <div 
                            key={item.id} 
                            className={`bg-white rounded-[2rem] p-4 flex items-center shadow-sm border border-gray-100 relative transition-all ${isSoldOut ? 'opacity-60' : 'active:scale-[0.98]'}`}
                        >
                            {/* Left side: Denomination */}
                            <div className="w-24 shrink-0 flex flex-col items-center justify-center border-r border-dashed border-gray-100 mr-4">
                                <div className={`flex items-baseline font-black ${isSoldOut ? 'text-gray-400' : 'text-red-600'}`}>
                                    <span className="text-sm mr-0.5">¥</span>
                                    <span className="text-4xl tracking-tighter">{item.amount}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Voucher</span>
                            </div>

                            {/* Right side: Info and Action */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-gray-800 text-sm truncate">{item.title}</h3>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex justify-between text-[9px] font-bold text-gray-400 px-0.5">
                                        <span>{isSoldOut ? '已被抢光' : (progress < 20 ? '即将抢完' : '惠民补贴中')}</span>
                                        <span>仅剩 {item.left} 张</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                isSoldOut ? 'bg-gray-300' : (progress < 30 ? 'bg-gradient-to-r from-orange-400 to-red-600' : 'bg-gradient-to-r from-red-500 to-rose-400')
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => handleSnatch(item.id, item.left)}
                                        disabled={isSoldOut || isClaimed || isUpcoming}
                                        className={`px-5 py-2 rounded-full text-xs font-black transition-all shadow-md flex items-center ${
                                            isUpcoming ? 'bg-blue-50 text-blue-600 cursor-not-allowed' :
                                            isClaimed ? 'bg-green-50 text-green-600 border border-green-100' :
                                            isSoldOut ? 'bg-gray-100 text-gray-400 cursor-default shadow-none' :
                                            'bg-gray-900 text-white active:scale-90 hover:shadow-lg'
                                        }`}
                                    >
                                        {isUpcoming ? (
                                            <><Lock size={12} className="mr-1"/> 待开启</>
                                        ) : isClaimed ? (
                                            <><Check size={12} className="mr-1"/> 已领取</>
                                        ) : isSoldOut ? (
                                            '已抢光'
                                        ) : (
                                            <>立即抢 <ChevronRight size={12} className="ml-0.5"/></>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Ticket Decoration Holes */}
                            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#F8F9FA] rounded-full -translate-y-1/2 shadow-inner"></div>
                            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#F8F9FA] rounded-full -translate-y-1/2 shadow-inner"></div>
                        </div>
                    );
                })}

                {/* Empty State / Footer */}
                <div className="py-10 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-50">
                        <Flame size={24} className="text-red-200" />
                    </div>
                    <p className="text-xs text-gray-300 font-bold tracking-widest uppercase">安电通 · 温暖进万家</p>
                </div>
            </div>

            {/* --- Fixed Exchange Entry --- */}
            <div className="bg-white p-4 border-t border-gray-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-30">
                <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-50 h-12 rounded-2xl flex items-center px-4 border border-gray-200 focus-within:border-red-400 focus-within:bg-white transition-all shadow-inner">
                        <Ticket size={18} className="text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="输入线下活动兑换码" 
                            className="bg-transparent text-sm outline-none flex-1 text-gray-800 font-bold placeholder:text-gray-300"
                        />
                    </div>
                    <button className="h-12 px-8 bg-gray-900 text-white text-sm font-black rounded-2xl shadow-xl active:scale-95 transition-transform">
                        兑换
                    </button>
                </div>
            </div>

            {/* Floating Reward Notification (Claimed Success) */}
            {claimedIds.length > 0 && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center z-[1000] animate-slide-up border border-white/10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-green-500/30">
                        <Check size={18} strokeWidth={4}/>
                    </div>
                    <div>
                        <span className="text-sm font-black block leading-none mb-1">领取成功</span>
                        <span className="text-[10px] text-gray-400 font-bold">请前往“我的 - 优惠券”查看</span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .animate-shine {
                    animation: shine 2s infinite linear;
                }
            `}</style>
        </div>
    );
};
