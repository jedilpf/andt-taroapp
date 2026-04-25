
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
    ArrowLeft, ShoppingBasket, Users, Clock, Zap, ChevronRight, 
    X, CheckCircle2, ShieldCheck, CreditCard, Loader2, Sparkles,
    CheckCircle, UserPlus, Info, Check, Coins
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

// --- 拼团确认抽屉 ---
const JoinGroupDrawer = ({ item, onClose, onConfirm }: { item: any, onClose: () => void, onConfirm: (method: string) => void }) => {
    const [method, setMethod] = useState('wechat');
    
    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="w-full max-w-md bg-[#F8FAFC] rounded-t-[3rem] p-6 relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[90vh]">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="text-xl font-black text-slate-800">确认拼团订单</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-24 px-2">
                    {/* 商品卡片 */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center space-x-4 shadow-sm">
                        <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                        <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-sm mb-1">{item.title}</h4>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-red-600 font-black text-xl">¥{item.price}</span>
                                <span className="text-xs text-slate-300 line-through">¥{item.original}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">支付详情</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">实付金额</span>
                                <span className="text-slate-900 font-black">¥{item.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50">
                                <span className="text-slate-500 font-medium flex items-center">
                                    <Coins size={14} className="text-amber-500 mr-1.5" /> 预计获得积分
                                </span>
                                <span className="text-amber-600 font-black">+{Math.floor(item.price)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">支付方式</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => setMethod('wechat')}
                                className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${method === 'wechat' ? 'border-emerald-500 bg-emerald-50/30' : 'border-white bg-white'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 bg-[#07C160] rounded-xl flex items-center justify-center text-white">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 13.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm7 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm.707-10.457c-4.832 0-8.75 3.518-8.75 7.857 0 2.348 1.152 4.453 2.969 5.86l-.766 2.296 2.664-1.332c.609.18 1.258.281 1.883.281 4.832 0 8.75-3.518 8.75-7.857 0-4.339-3.918-7.857-8.75-7.857zm-11.233 4.286c-4.142 0-7.5 3.015-7.5 6.735 0 2.012.986 3.816 2.544 5.023l-.656 1.968 2.284-1.142c.523.155 1.078.241 1.614.241 4.142 0 7.5-3.015 7.5-6.735 0-3.72-3.358-6.735-7.5-6.735z"/></svg>
                                    </div>
                                    <span className="font-black text-slate-700 text-sm">微信支付</span>
                                </div>
                                {method === 'wechat' && <CheckCircle2 size={18} className="text-emerald-500" />}
                            </button>
                            <button 
                                onClick={() => setMethod('balance')}
                                className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${method === 'balance' ? 'border-blue-500 bg-blue-50/30' : 'border-white bg-white'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white"><CreditCard size={18} /></div>
                                    <span className="font-black text-slate-700 text-sm">余额支付</span>
                                </div>
                                {method === 'balance' && <CheckCircle2 size={18} className="text-blue-500" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start space-x-3">
                        <Info size={16} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-orange-700 font-bold leading-relaxed">拼团说明：付款成功后即视为参与成功。若在 20:00 结束时未能达到目标人数，款项将原路退回至您的支付账户，积分也将收回。</p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white p-6 pb-safe border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={() => onConfirm(method)}
                        className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-95 transition-all"
                    >
                        确认支付 ¥{item.price} 并参团
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const UserGroupBuy = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser, earnPoints } = useApp();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [lastPurchasedItem, setLastPurchasedItem] = useState<any>(null); // 保存最后一次购买的商品数据
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const groupItems = [
        { id: 1, title: '公牛五孔插座 (10只装)', price: 99, original: 152, joined: 45, target: 50, image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=300&fit=crop' },
        { id: 2, title: '欧普全屋灯具焕新套餐', price: 888, original: 1280, joined: 8, target: 10, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&fit=crop' },
        { id: 3, title: '施耐德全屋开关礼盒', price: 499, original: 680, joined: 21, target: 30, image: 'https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=300&fit=crop' },
    ];

    const handleConfirmJoin = (method: string) => {
        const itemToBuy = { ...selectedItem }; // 捕获当前选中的商品
        setLastPurchasedItem(itemToBuy);
        setSelectedItem(null);
        setProcessing(true);
        
        setTimeout(() => {
            if (currentUser) {
                createOrder({
                    type: 'Install',
                    title: `社区拼单 - ${itemToBuy.title}`,
                    description: `【拼团成功】支付方式：${method}\n商品：${itemToBuy.title}\n状态：等待成团`,
                    priceEstimate: { min: itemToBuy.price, max: itemToBuy.price, final: itemToBuy.price },
                    location: currentUser.location,
                    status: OrderStatus.PAID,
                    pointsReward: Math.floor(itemToBuy.price), // 确保订单里记录了积分
                    scheduledTime: '今日 20:00 后配送'
                });
                earnPoints(Math.floor(itemToBuy.price));
            }
            setProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/user/orders', { state: { initialTab: '待收货/使用' } });
            }, 2500);
        }, 1500);
    };

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-50">
                <button onClick={() => navigate(-1)} className="p-2.5 -ml-2 rounded-full bg-slate-100 active:scale-90 transition-transform">
                    <ArrowLeft size={24} className="text-slate-800" strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">社区团购</h1>
                <div className="flex items-center text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full text-xs font-black shadow-inner border border-orange-100">
                    <Clock size={12} className="mr-1.5 animate-pulse" /> 20:00 结束
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {/* Hero Banner */}
                <div className="p-4">
                    <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-100">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
                        <Users size={160} className="absolute -right-6 -bottom-10 text-white/10 rotate-12" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black leading-tight tracking-tighter">邻里拼单<br/>击穿底价</h2>
                            <p className="mt-4 text-sm text-orange-50 font-bold opacity-90 max-w-[80%] leading-relaxed">集聚社区力量，直接对接源头工厂。下单立享 1:1 积分返还，当钱花！</p>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="px-4 space-y-4">
                    {groupItems.map(item => {
                        const progress = (item.joined / item.target) * 100;
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedItem(item)}
                                className="bg-white rounded-[2.2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col relative active:scale-[0.99] transition-all group"
                            >
                                <div className="flex p-5">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-slate-50 border border-slate-50">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    </div>
                                    <div className="flex-1 ml-5 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg truncate leading-tight mb-1">{item.title}</h3>
                                            <div className="flex items-center space-x-1.5">
                                                <div className="flex -space-x-1.5">
                                                    {[1, 2, 3].map(i => (
                                                        <img 
                                                            key={i} 
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + item.id}`} 
                                                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                                                            alt=""
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold">等 {item.joined} 人已参团</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <div className="bg-amber-50 text-amber-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-100 w-fit mb-1">
                                                    下单返 {Math.floor(item.price)} 积分
                                                </div>
                                                <div className="flex items-baseline space-x-1.5">
                                                    <span className="text-red-600 font-black text-2xl tracking-tighter">¥{item.price}</span>
                                                    <span className="text-[10px] text-slate-300 line-through font-bold">¥{item.original}</span>
                                                </div>
                                            </div>
                                            <button className="bg-[#F97316] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black shadow-lg shadow-orange-100 active:scale-90 transition-transform flex items-center">
                                                立即拼团
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-5 pb-5">
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#F97316] to-[#EF4444] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black mt-2 uppercase tracking-tight">
                                        <span className="text-blue-500">当前进度 {progress.toFixed(0)}%</span>
                                        <span className="text-orange-600">还差 <span className="text-lg">{item.target - item.joined}</span> 人成团</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 px-8 py-6 text-center opacity-30">
                    <ShieldCheck size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Neighbor Collaboration Economy</p>
                </div>
            </div>

            {/* 支付/加载中状态 */}
            {processing && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-scale-in">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                                <UserPlus size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">正在为您预占名额</h3>
                        <p className="text-xs text-slate-400 font-bold mt-2">拼团席位锁定中...</p>
                    </div>
                </div>
            )}

            {/* 成功反馈 */}
            {showSuccess && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none p-6">
                    <div className="bg-[#1C1E22] text-white px-8 py-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-scale-in border border-white/10 w-full max-w-xs text-center">
                        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/40">
                             <Check size={40} className="text-white" strokeWidth={4} />
                        </div>
                        <p className="text-2xl font-black tracking-tight">成功参团</p>
                        <div className="mt-4 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 flex items-center space-x-2">
                            <Coins size={16} className="text-amber-500" />
                            <span className="text-lg font-black text-amber-500">+{Math.floor(lastPurchasedItem?.price || 0)} 积分</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-4 leading-relaxed uppercase tracking-widest">
                            Points Awarded Successfully<br/>
                            请留意今日 20:00 的成团通知
                        </p>
                    </div>
                </div>
            )}

            {selectedItem && (
                <JoinGroupDrawer 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    onConfirm={handleConfirmJoin} 
                />
            )}
        </div>
    );
};
