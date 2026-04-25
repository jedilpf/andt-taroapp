import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Search, ShoppingCart, Camera,
    Apple, Carrot, Beef, Fish,
    Milk, Wheat, Utensils, Sandwich,
    MoreHorizontal, ChevronRight, Zap, Gift,
    CreditCard, AlignLeft, Star, Truck, ShieldCheck,
    Timer, Sparkles, User, Loader2, Check
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';
import SupermarketProductDetail from './SupermarketProductDetail';

const FreshZone = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();

    // Interaction State
    const [activeView, setActiveView] = useState<'home' | 'product' | 'success'>('home');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [purchasing, setPurchasing] = useState(false);

    // States for interaction
    const [claimedCoupons, setClaimedCoupons] = useState<Record<string, boolean>>({});
    const [claiming, setClaiming] = useState<string | null>(null);

    const handleClaimCoupon = (id: string) => {
        if (claimedCoupons[id]) return;
        setClaiming(id);
        setTimeout(() => {
            setClaimedCoupons(prev => ({ ...prev, [id]: true }));
            setClaiming(null);
        }, 800);
    };

    // Handlers
    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setActiveView('product');
    };

    const handleBack = () => {
        setActiveView('home');
        setSelectedProduct(null);
    };

    const handleBuy = () => {
        setPurchasing(true);
        setTimeout(() => {
            if (selectedProduct) {
                createOrder({
                    type: 'Fresh',
                    title: selectedProduct.t || '生鲜产品',
                    description: `购买了 ${selectedProduct.t}`,
                    priceEstimate: { min: parseFloat(selectedProduct.price || selectedProduct.p || '0'), max: parseFloat(selectedProduct.price || selectedProduct.p || '0'), final: parseFloat(selectedProduct.price || selectedProduct.p || '0') },
                    location: currentUser?.location,
                    status: OrderStatus.COMPLETED,
                    scheduledTime: '立即配送'
                });
            }
            setPurchasing(false);
            setActiveView('success');
        }, 1500);
    };

    // Sub-Views
    if (activeView === 'success') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in h-screen bg-white fixed inset-0 z-[200]">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <Check size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">支付成功</h2>
                <p className="text-sm text-slate-400 font-bold mb-10">生鲜产品将尽快为您配送，请保持电话畅通。</p>
                <div className="space-y-3 w-full max-w-xs">
                    <button onClick={() => navigate('/user/orders')} className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-bold active:scale-95 transition-transform">
                        查看订单
                    </button>
                    <button onClick={handleBack} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-transform">
                        继续逛逛
                    </button>
                </div>
            </div>
        );
    }

    if (activeView === 'product') {
        if (purchasing) {
            return (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                    <Loader2 size={48} className="animate-spin mb-4" />
                    <p className="font-bold">正在安全支付...</p>
                </div>
            );
        }
        return <SupermarketProductDetail product={selectedProduct} onBack={handleBack} onBuy={handleBuy} />;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24 relative animate-fade-in text-slate-800">
            {/* --- Header Area (Fresh Green Gradient) --- */}
            <div className="bg-gradient-to-b from-emerald-600 to-[#F5F7FA] pb-4 sticky top-0 z-40">
                <div className="pt-safe px-3 pb-2 flex items-center justify-between text-white">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-lg font-bold tracking-wide">邻里生鲜</div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-black/20 px-2 py-0.5 rounded-full text-[10px] space-x-1">
                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                            <span>产地直采</span>
                        </div>
                        <MoreHorizontal className="w-6 h-6" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 mt-1">
                    <div className="bg-white rounded-full h-9 flex items-center px-4 shadow-sm border border-emerald-100 active:scale-95 transition-transform">
                        <Search className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="text-slate-400 text-sm">智利车厘子 JJ级</span>
                        <div className="ml-auto bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            搜索
                        </div>
                    </div>
                </div>

                {/* Horizontal Tags Scroll */}
                <div className="flex items-center space-x-2 px-3 mt-3 overflow-x-auto no-scrollbar text-xs text-white pb-2">
                    <span className="bg-[#064E3B] text-[#A7F3D0] px-2 py-1 rounded flex items-center shrink-0 font-bold border border-emerald-400/30 shadow-lg">
                        <span className="bg-[#A7F3D0] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] mr-1">Hot</span>
                        今日秒杀
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🍒 车厘子自由
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🥩 澳洲牛排
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🥬 0元领菜
                    </span>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="px-3 -mt-2 space-y-3 relative z-10">

                {/* 1. Fresh Station (Small Shop Equivalent) */}
                <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-1">
                            <span className="text-green-600 font-black italic text-lg">生鲜早市</span>
                            <span className="bg-green-100 text-green-600 text-[9px] px-1 rounded">早安卡</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                            去菜市场频道 <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {[
                            { id: 'f1', val: '5', cond: '满29元可用' },
                            { id: 'f2', val: '9', cond: '生鲜通用券' },
                        ].map((c) => (
                            <div key={c.id} className="flex-1 bg-green-50 rounded-lg p-2 flex justify-between items-center border border-green-100 relative overflow-hidden">
                                <div>
                                    <p className="text-green-600 font-bold text-lg">¥{c.val}</p>
                                    <p className="text-green-500 text-[9px]">{c.cond}</p>
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-green-600 text-[10px] font-bold mb-1">早市券</p>
                                    <button
                                        onClick={() => handleClaimCoupon(c.id)}
                                        disabled={claimedCoupons[c.id] || claiming === c.id}
                                        className={`text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transition-all ${claimedCoupons[c.id] ? 'bg-green-300' : 'bg-gradient-to-r from-green-500 to-green-600 active:scale-90'}`}
                                    >
                                        {claiming === c.id ? <Loader2 size={10} className="animate-spin" /> : (claimedCoupons[c.id] ? '已领取' : '立即领取')}
                                    </button>
                                </div>
                                {/* Watermark */}
                                {claimedCoupons[c.id] && <div className="absolute -right-3 -bottom-3 text-green-200 opacity-50 rotate-[-20deg] border-2 border-green-200 rounded-full p-2 text-xs font-black">已领取</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Category Grid */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-5 gap-y-4">
                        {[
                            { name: '时令水果', icon: <Apple className="text-red-500" />, color: 'bg-red-50' },
                            { name: '新鲜蔬菜', icon: <Carrot className="text-orange-500" />, color: 'bg-orange-50' },
                            { name: '肉禽蛋品', icon: <Beef className="text-rose-500" />, color: 'bg-rose-50' },
                            { name: '海鲜水产', icon: <Fish className="text-blue-500" />, color: 'bg-blue-50' },
                            { name: '乳品烘焙', icon: <Milk className="text-sky-500" />, color: 'bg-sky-50' },
                            { name: '粮油调味', icon: <Wheat className="text-amber-500" />, color: 'bg-amber-50' },
                            { name: '熟食面点', icon: <Utensils className="text-yellow-500" />, color: 'bg-yellow-50' },
                            { name: '快手菜', icon: <Sandwich className="text-green-500" />, color: 'bg-green-50' },
                            { name: '鲜花绿植', icon: <Sparkles className="text-pink-500" />, color: 'bg-pink-50' },
                            { name: '更多分类', icon: <MoreHorizontal className="text-gray-500" />, color: 'bg-gray-50' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center space-y-2 active:opacity-60 transition-opacity cursor-pointer">
                                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <span className="text-[11px] text-slate-700 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Fresh Subsidy (Green Gradient) */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl p-3 shadow-sm text-white sticky top-[80px] z-30">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-[#FFD700] text-emerald-800 text-xs font-black px-1.5 rounded">补</span>
                        <h3 className="font-bold text-lg italic">生鲜补贴 x 坏果包赔</h3>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {/* Big Card */}
                        <div className="bg-white rounded-lg p-2 min-w-[100px] flex flex-col items-center text-center relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 bg-[#FFD700] text-[#B8860B] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                爆款
                            </div>
                            <div className="mt-4 mb-1">
                                <p className="text-emerald-600 font-bold text-xs">车厘子</p>
                                <p className="bg-red-500 text-white text-[10px] px-2 rounded-full mt-0.5">JJ级 5斤</p>
                            </div>
                        </div>
                        {/* Product Cards */}
                        {[
                            { t: '车厘子', img: null, icon: <Apple size={32} className="text-red-500" />, price: '199', back: '20' },
                            { t: '草莓', img: null, icon: <Apple size={32} className="text-pink-500" />, price: '29.9', back: '5' },
                            { t: '带鱼', img: null, icon: <Fish size={32} className="text-gray-400" />, price: '18.8', back: '2' },
                        ].map((prod, i) => (
                            <div key={i} className="bg-white rounded-lg p-2 min-w-[90px] flex flex-col items-center active:scale-95 transition-transform" onClick={() => handleProductClick(prod)}>
                                <div className="w-14 h-14 flex items-center justify-center">{prod.icon}</div>
                                <span className="text-red-500 bg-red-50 text-[9px] px-1 rounded">补{prod.back}元</span>
                                <span className="text-slate-800 font-bold mt-1 text-sm">¥{prod.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Coupons Strip */}
                <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-1 shrink-0 mr-2 border-r border-slate-100 pr-2">
                        <span className="text-red-600 font-bold">领券买菜</span>
                        <span className="text-xs text-slate-400">天天低价</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="flex flex-1 space-x-2 overflow-x-auto no-scrollbar">
                        {[
                            { val: '3', cond: '无门槛' },
                            { val: '5', cond: '满39可用' },
                            { val: '10', cond: '满69可用' }
                        ].map((c, i) => (
                            <div key={i} className="bg-[#FFF4F4] text-red-600 px-3 py-1 rounded flex flex-col items-center min-w-[70px] border border-red-100 active:scale-95">
                                <div className="font-bold text-sm">¥<span className="text-lg">{c.val}</span></div>
                                <div className="text-[9px] whitespace-nowrap">{c.cond}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Dual Feed Cards */}
                <div className="flex space-x-3">
                    {/* Left: Seasonal */}
                    <div className="flex-1 bg-gradient-to-b from-green-50 to-white rounded-xl p-3 border border-green-50 relative overflow-hidden active:scale-98 transition-transform">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">时令上新</span>
                                <span className="text-green-800 text-xs font-bold">现摘现发</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <Carrot className="w-12 h-12 text-green-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">春菜上市</p>
                                    <p className="text-sm font-bold text-slate-800">尝鲜价</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Meat & Seafood */}
                    <div className="flex-1 bg-gradient-to-b from-red-50 to-white rounded-xl p-3 border border-red-50 relative overflow-hidden active:scale-98 transition-transform">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="text-red-800 text-sm font-bold italic">大口吃肉</span>
                                <span className="bg-red-500 text-white text-[9px] px-1 rounded">第二件半价</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <Beef className="w-12 h-12 text-red-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">进口原切</p>
                                    <p className="text-sm font-bold text-slate-800">¥29/斤</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Custom Bottom Nav (Mock) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-center z-50 text-[10px] text-slate-500 pb-safe">
                <div className="flex flex-col items-center text-emerald-600">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-0.5 shadow-lg shadow-emerald-200">
                        <AlignLeft size={20} />
                    </div>
                    <span>逛菜场</span>
                </div>
                <div className="flex flex-col items-center">
                    <Gift size={22} className="mb-1 text-slate-700" />
                    <span>0元领</span>
                </div>
                <div className="flex flex-col items-center">
                    <CreditCard size={22} className="mb-1 text-slate-700" />
                    <span>做任务</span>
                </div>
                <div className="flex flex-col items-center">
                    <ShoppingCart size={22} className="mb-1 text-slate-700" />
                    <span>购物车</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex items-center justify-center mb-1 font-bold text-xs">¥</div>
                    <span>我的</span>
                </div>
            </div>
        </div>
    );
};

export default FreshZone;
