import React, { useState } from 'react';
import {
    Search, ShoppingCart, User, Menu, Ticket,
    ChevronRight, MapPin, Scan, MessageCircle, MoreHorizontal,
    ShoppingBag, AlignLeft, Gift, Zap, Truck, CreditCard,
    Coffee, Wine, Baby, Cookie, Milk, UtensilsCrossed,
    ArrowUp, Timer, Sparkles, Apple, Plus, Check, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';
import SupermarketProductDetail from './SupermarketProductDetail';
import SupermarketCategoryPage from './SupermarketCategoryPage';

const SupermarketZone = () => {
    const { createOrder, currentUser } = useApp();
    const navigate = useNavigate();

    // Interaction State
    const [activeView, setActiveView] = useState<'home' | 'product' | 'category' | 'success'>('home');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [claimedCoupons, setClaimedCoupons] = useState<Record<string, boolean>>({});
    const [claiming, setClaiming] = useState<string | null>(null);
    const [purchasing, setPurchasing] = useState(false);

    // Handlers
    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setActiveView('product');
    };

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setActiveView('category');
    };

    const handleBack = () => {
        setActiveView('home');
        setSelectedProduct(null);
        setSelectedCategory(null);
    };

    const handleClaimCoupon = (id: string) => {
        if (claimedCoupons[id]) return;
        setClaiming(id);
        setTimeout(() => {
            setClaimedCoupons(prev => ({ ...prev, [id]: true }));
            setClaiming(null);
        }, 800);
    };

    const handleBuy = () => {
        setPurchasing(true);
        setTimeout(() => {
            if (selectedProduct) {
                createOrder({
                    type: 'Product',
                    title: selectedProduct.t || '超市商品',
                    description: `购买了 ${selectedProduct.t}`,
                    priceEstimate: { min: parseFloat(selectedProduct.price || selectedProduct.p || '0'), max: parseFloat(selectedProduct.price || selectedProduct.p || '0'), final: parseFloat(selectedProduct.price || selectedProduct.p || '0') },
                    location: currentUser?.location,
                    status: OrderStatus.COMPLETED,
                    scheduledTime: '立即送达'
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
                <p className="text-sm text-slate-400 font-bold mb-10">您的订单正在飞速配送中，预计30分钟内送达。</p>
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

    if (activeView === 'category') {
        return <SupermarketCategoryPage category={selectedCategory} onBack={handleBack} onProductSelect={handleProductClick} />;
    }

    // Main View
    return (
        <div className="min-h-screen bg-[#F6F6F6] pb-24 relative animate-fade-in text-slate-800">
            {/* --- Header Area (Green) --- */}
            <div className="bg-gradient-to-b from-[#00CF7E] to-[#F6F6F6] pb-4 sticky top-0 z-40">
                {/* Top Nav Status Bar Placeholder (Safe Area) */}
                <div className="h-safe-top" />

                {/* Main Header Bar */}
                <div className="flex items-center justify-between px-3 py-2">
                    <button onClick={() => navigate(-1)} className="p-1 text-white">
                        <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                    <div className="text-white text-lg font-bold tracking-wide">
                        安电超市
                    </div>
                    <div className="flex items-center space-x-3 text-white">
                        <div className="flex items-center bg-black/20 px-2 py-0.5 rounded-full text-[10px] space-x-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span>直播</span>
                        </div>
                        <MoreHorizontal className="w-6 h-6" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 mt-1">
                    <div className="bg-white rounded-full h-9 flex items-center px-4 shadow-sm border border-emerald-100 active:scale-95 transition-transform">
                        <Search className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="text-slate-400 text-sm">马吉拉身体乳</span>
                        <div className="ml-auto bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                            搜索
                        </div>
                    </div>
                </div>

                {/* Horizontal Tags Scroll */}
                <div className="flex items-center space-x-2 px-3 mt-3 overflow-x-auto no-scrollbar text-xs text-white pb-2">
                    <span className="bg-[#4D4D4D] text-[#FFD700] px-2 py-1 rounded flex items-center shrink-0 font-bold border border-[#FFD700]/30 shadow-lg">
                        <span className="bg-[#FFD700] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] mr-1">5</span>
                        黑五抢鸡蛋
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🚗 汽车人集结
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🎄 圣诞派对 有佳有味
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🔥 东哥同款
                    </span>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="px-3 -mt-2 space-y-3 relative z-10">

                {/* 1. Small Shop (Banner) */}
                <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-1">
                            <span className="text-pink-600 font-black italic text-lg">安电小卖部</span>
                            <span className="bg-pink-100 text-pink-600 text-[9px] px-1 rounded">快抢!</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                            直达学生低价频道 <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {[
                            { id: 'c1', val: '10', cond: '满69元可用' },
                            { id: 'c2', val: '5', cond: '满20元可用' },
                        ].map((c) => (
                            <div key={c.id} className="flex-1 bg-pink-50 rounded-lg p-2 flex justify-between items-center border border-pink-100 relative overflow-hidden">
                                <div>
                                    <p className="text-pink-600 font-bold text-lg">¥{c.val}</p>
                                    <p className="text-pink-400 text-[9px]">{c.cond}</p>
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-pink-600 text-[10px] font-bold mb-1">超市学生券</p>
                                    <button
                                        onClick={() => handleClaimCoupon(c.id)}
                                        disabled={claimedCoupons[c.id] || claiming === c.id}
                                        className={`text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transition-all ${claimedCoupons[c.id] ? 'bg-pink-300' : 'bg-gradient-to-r from-pink-500 to-pink-600 active:scale-90'}`}
                                    >
                                        {claiming === c.id ? <Loader2 size={10} className="animate-spin" /> : (claimedCoupons[c.id] ? '已领取' : '立即领取')}
                                    </button>
                                </div>
                                {/* Watermark for claimed */}
                                {claimedCoupons[c.id] && <div className="absolute -right-3 -bottom-3 text-pink-200 opacity-50 rotate-[-20deg] border-2 border-pink-200 rounded-full p-2 text-xs font-black">已领取</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Category Grid (10 Icons) */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-5 gap-y-4">
                        {[
                            { name: '乳品烘焙', icon: <Milk className="text-blue-500" />, color: 'bg-blue-50' },
                            { name: '粮油调味', icon: <Cookie className="text-amber-500" />, color: 'bg-amber-50' },
                            { name: '零食', icon: <Coffee className="text-orange-500" />, color: 'bg-orange-50' },
                            { name: '生鲜果蔬', icon: <Apple className="text-green-500" />, color: 'bg-green-50' },
                            { name: '地方特产', icon: <MapPin className="text-red-500" />, color: 'bg-red-50' },
                            { name: '中外美酒', icon: <Wine className="text-purple-500" />, color: 'bg-purple-50' },
                            { name: '饮料冲调', icon: <Coffee className="text-cyan-500" />, color: 'bg-cyan-50' },
                            { name: '母婴玩具', icon: <Baby className="text-pink-500" />, color: 'bg-pink-50' },
                            { name: '纸品清洁', icon: <Sparkles className="text-teal-500" />, color: 'bg-teal-50' },
                            { name: '个人洗护', icon: <User className="text-indigo-500" />, color: 'bg-indigo-50' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleCategoryClick(item)}
                                className="flex flex-col items-center space-y-2 active:opacity-60 transition-opacity cursor-pointer"
                            >
                                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <span className="text-[11px] text-slate-700 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Billions Subsidy (Green Banner) */}
                <div className="bg-gradient-to-r from-[#0EAC5C] to-[#4BC48A] rounded-xl p-3 shadow-sm text-white sticky top-[80px] z-30">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-[#FFD700] text-[#0EAC5C] text-xs font-black px-1.5 rounded">5%</span>
                        <h3 className="font-bold text-lg italic">百亿补贴 x 满额返超市卡</h3>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {/* Big Card */}
                        <div className="bg-white rounded-lg p-2 min-w-[100px] flex flex-col items-center text-center relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 bg-[#FFD700] text-[#B8860B] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                返 5%
                            </div>
                            <div className="mt-4 mb-1">
                                <p className="text-[#0EAC5C] font-bold text-xs">超市卡</p>
                                <p className="bg-[#F85E53] text-white text-[10px] px-2 rounded-full mt-0.5">满149元</p>
                            </div>
                        </div>
                        {/* Product Cards - Interactive */}
                        {[
                            { t: '金龙鱼', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200', price: '29.9', back: '1.49' },
                            { t: '披萨', img: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=200', price: '59.4', back: '2.97' },
                            { t: '蔬菜', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200', price: '59.41', back: '2.97' },
                        ].map((prod, i) => (
                            <div
                                key={i}
                                onClick={() => handleProductClick(prod)}
                                className="bg-white rounded-lg p-2 min-w-[90px] flex flex-col items-center active:scale-95 transition-transform"
                            >
                                <img src={prod.img} className="w-14 h-14 object-contain mb-1 mix-blend-multiply" alt={prod.t} />
                                <span className="text-[#F85E53] bg-[#FEF0F0] text-[9px] px-1 rounded">返{prod.back}元</span>
                                <span className="text-red-600 font-bold mt-1 text-sm">¥{prod.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Coupons Strip */}
                <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-1 shrink-0 mr-2 border-r border-slate-100 pr-2">
                        <span className="text-red-600 font-bold">优惠好券</span>
                        <span className="text-xs text-slate-400">查看更多</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="flex flex-1 space-x-2 overflow-x-auto no-scrollbar">
                        {[
                            { val: '3', cond: '满3.01元可用' },
                            { val: '8', cond: '满8.01元可用' },
                            { val: '5', cond: '满5.01元可用' }
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
                    {/* Left: Buy Good Things */}
                    <div className="flex-1 bg-gradient-to-b from-[#FFF0F0] to-white rounded-xl p-3 border border-red-50 relative overflow-hidden active:scale-98 transition-transform" onClick={() => handleProductClick({ t: '特色纯牛奶', price: '29.9' })}>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">买好物</span>
                                <span className="text-red-800 text-xs font-bold">逛安电超市</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="https://images.unsplash.com/photo-1563189037-3a6a978f85f1?w=150" className="w-20 h-20 object-contain mix-blend-multiply" alt="纯牛奶" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">特色好奶</p>
                                    <p className="text-sm font-bold text-slate-800">纯牛奶</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: New Arrivals */}
                    <div className="flex-1 bg-gradient-to-b from-[#F0FFF6] to-white rounded-xl p-3 border border-emerald-50 relative overflow-hidden active:scale-98 transition-transform" onClick={() => handleProductClick({ t: '新款耳机', price: '199' })}>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="text-emerald-800 text-sm font-bold italic">上新口</span>
                                <span className="bg-emerald-500 text-white text-[9px] px-1 rounded">1元抽奖</span>
                            </div>
                            <div className="flex justify-center mt-2">
                                <img src="https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=150" className="w-24 h-24 object-cover rounded-full shadow-sm border-2 border-white" alt="新款耳机" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Custom Bottom Nav (Mock) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-center z-50 text-[10px] text-slate-500 pb-safe">
                <div className="flex flex-col items-center text-emerald-600">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-0.5 shadow-lg shadow-emerald-200">
                        <AlignLeft size={20} />
                    </div>
                    <span>逛超市</span>
                </div>
                <div className="flex flex-col items-center">
                    <Gift size={22} className="mb-1 text-slate-700" />
                    <span>IP乐园</span>
                </div>
                <div className="flex flex-col items-center">
                    <CreditCard size={22} className="mb-1 text-slate-700" />
                    <span>超市卡</span>
                </div>
                <div className="flex flex-col items-center">
                    <ShoppingCart size={22} className="mb-1 text-slate-700" />
                    <span>购物车</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex items-center justify-center mb-1 font-bold text-xs">¥</div>
                    <span>赚钱</span>
                </div>
            </div>
        </div>
    );
};

export default SupermarketZone;
