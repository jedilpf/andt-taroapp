import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Search, ShoppingCart, Camera,
    Smartphone, Laptop, Watch, Headphones,
    Speaker, Battery, Gamepad, Tv,
    MoreHorizontal, ChevronRight, Zap, Gift,
    CreditCard, AlignLeft, Star, Truck, ShieldCheck,
    Timer, Sparkles, User, Loader2, Check
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';
import SupermarketProductDetail from './SupermarketProductDetail';
import DigitalCategoryPage from './DigitalCategoryPage';

const DigitalZone = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();

    // Interaction State
    const [activeView, setActiveView] = useState<'home' | 'product' | 'category' | 'success'>('home');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
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

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setActiveView('category');
    };

    const handleBack = () => {
        setActiveView('home');
        setSelectedProduct(null);
        setSelectedCategory(null);
    };

    const handleBuy = () => {
        setPurchasing(true);
        setTimeout(() => {
            if (selectedProduct) {
                createOrder({
                    type: 'Digital',
                    title: selectedProduct.t || '数码产品',
                    description: `购买了 ${selectedProduct.t}`,
                    priceEstimate: { min: parseFloat(selectedProduct.price || selectedProduct.p || '0'), max: parseFloat(selectedProduct.price || selectedProduct.p || '0'), final: parseFloat(selectedProduct.price || selectedProduct.p || '0') },
                    location: currentUser?.location,
                    status: OrderStatus.COMPLETED,
                    scheduledTime: '立即发货'
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
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <Check size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">支付成功</h2>
                <p className="text-sm text-slate-400 font-bold mb-10">数码产品将由京东物流专送，预计明日送达。</p>
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
        return <DigitalCategoryPage category={selectedCategory} onBack={handleBack} onProductSelect={handleProductClick} />;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24 relative animate-fade-in text-slate-800">
            {/* --- Header Area (Blue Gradient) --- */}
            <div className="bg-gradient-to-b from-blue-600 to-[#F5F7FA] pb-4 sticky top-0 z-40">
                <div className="pt-safe px-3 pb-2 flex items-center justify-between text-white">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-lg font-bold tracking-wide">数码电器</div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-black/20 px-2 py-0.5 rounded-full text-[10px] space-x-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>新品发布</span>
                        </div>
                        <MoreHorizontal className="w-6 h-6" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 mt-1">
                    <div className="bg-white rounded-full h-9 flex items-center px-4 shadow-sm border border-blue-100 active:scale-95 transition-transform">
                        <Search className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-slate-400 text-sm">Titanium X Pro 钛合金</span>
                        <div className="ml-auto bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            搜索
                        </div>
                    </div>
                </div>

                {/* Horizontal Tags Scroll */}
                <div className="flex items-center space-x-2 px-3 mt-3 overflow-x-auto no-scrollbar text-xs text-white pb-2">
                    <span className="bg-[#1E293B] text-[#38BDF8] px-2 py-1 rounded flex items-center shrink-0 font-bold border border-blue-400/30 shadow-lg">
                        <span className="bg-[#38BDF8] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] mr-1">N</span>
                        Switch 2
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        📱 iPhone 16
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        💻 RTX 5090
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center">
                        🎧 空间音频
                    </span>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="px-3 -mt-2 space-y-3 relative z-10">

                {/* 1. Digital Station (Small Shop Equivalent) */}
                <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-1">
                            <span className="text-indigo-600 font-black italic text-lg">数码补给站</span>
                            <span className="bg-indigo-100 text-indigo-600 text-[9px] px-1 rounded">学生特惠</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                            教育优惠认证通道 <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {[
                            { id: 'd1', val: '100', cond: '满2000元可用' },
                            { id: 'd2', val: '50', cond: '配件通用券' },
                        ].map((c) => (
                            <div key={c.id} onClick={() => handleClaimCoupon(c.id)} className="flex-1 bg-indigo-50 rounded-lg p-2 flex justify-between items-center border border-indigo-100 relative overflow-hidden active:scale-95 transition-transform">
                                <div>
                                    <p className="text-indigo-600 font-bold text-lg">¥{c.val}</p>
                                    <p className="text-indigo-400 text-[9px]">{c.cond}</p>
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-indigo-600 text-[10px] font-bold mb-1">数码券</p>
                                    <button
                                        onClick={() => handleClaimCoupon(c.id)}
                                        disabled={claimedCoupons[c.id] || claiming === c.id}
                                        className={`text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transition-all ${claimedCoupons[c.id] ? 'bg-indigo-300' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 active:scale-90'}`}
                                    >
                                        {claiming === c.id ? <Loader2 size={10} className="animate-spin" /> : (claimedCoupons[c.id] ? '已领取' : '立即领取')}
                                    </button>
                                </div>
                                {/* Watermark */}
                                {claimedCoupons[c.id] && <div className="absolute -right-3 -bottom-3 text-indigo-200 opacity-50 rotate-[-20deg] border-2 border-indigo-200 rounded-full p-2 text-xs font-black">已领取</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Category Grid */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-5 gap-y-4">
                        {[
                            { name: '手机数码', icon: <Smartphone className="text-blue-500" />, color: 'bg-blue-50' },
                            { name: '电脑办公', icon: <Laptop className="text-purple-500" />, color: 'bg-purple-50' },
                            { name: '摄影摄像', icon: <Camera className="text-rose-500" />, color: 'bg-rose-50' },
                            { name: '影音娱乐', icon: <Headphones className="text-amber-500" />, color: 'bg-amber-50' },
                            { name: '智能穿戴', icon: <Watch className="text-emerald-500" />, color: 'bg-emerald-50' },
                            { name: '智能家居', icon: <Speaker className="text-cyan-500" />, color: 'bg-cyan-50' },
                            { name: '游戏电竞', icon: <Gamepad className="text-violet-500" />, color: 'bg-violet-50' },
                            { name: '家用电器', icon: <Tv className="text-orange-500" />, color: 'bg-orange-50' },
                            { name: '数码配件', icon: <Battery className="text-slate-500" />, color: 'bg-slate-50' },
                            { name: '更多频道', icon: <MoreHorizontal className="text-gray-500" />, color: 'bg-gray-50' },
                        ].map((item, i) => (
                            <div key={i} onClick={() => handleCategoryClick(item)} className="flex flex-col items-center space-y-2 active:opacity-60 transition-opacity cursor-pointer">
                                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <span className="text-[11px] text-slate-700 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Billions Subsidy (Blue/Cyan Banner) */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-3 shadow-sm text-white sticky top-[80px] z-30">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-[#FFD700] text-blue-700 text-xs font-black px-1.5 rounded">10%</span>
                        <h3 className="font-bold text-lg italic">百亿补贴 x 官方正品</h3>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {/* Big Card - Interactive */}
                        <div className="bg-white rounded-lg p-2 min-w-[100px] flex flex-col items-center text-center relative overflow-hidden shrink-0 active:scale-95 transition-transform" onClick={() => handleProductClick({ t: '大额补贴券', price: '0', tags: ['百亿补贴'] })}>
                            <div className="absolute top-0 left-0 bg-[#FFD700] text-[#B8860B] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                省 ¥500
                            </div>
                            <div className="mt-4 mb-1">
                                <p className="text-blue-600 font-bold text-xs">大额券</p>
                                <p className="bg-red-500 text-white text-[10px] px-2 rounded-full mt-0.5">满4999元</p>
                            </div>
                        </div>
                        {/* Product Cards */}
                        {[
                            { t: 'iPhone 15', img: '/assets/store/hero_mobile.png', price: '4999', back: '500' },
                            { t: 'MacBook', img: null, icon: <Laptop size={32} className="text-gray-300" />, price: '8999', back: '800' },
                            { t: 'Switch', img: null, icon: <Gamepad size={32} className="text-gray-300" />, price: '1899', back: '200' },
                        ].map((prod, i) => (
                            <div key={i} className="bg-white rounded-lg p-2 min-w-[90px] flex flex-col items-center active:scale-95 transition-transform" onClick={() => handleProductClick(prod)}>
                                {prod.img ? (
                                    <img src={prod.img} className="w-14 h-14 object-contain mb-1" alt={prod.t} />
                                ) : (
                                    <div className="w-14 h-14 flex items-center justify-center">{prod.icon}</div>
                                )}
                                <span className="text-red-500 bg-red-50 text-[9px] px-1 rounded">补{prod.back}元</span>
                                <span className="text-slate-800 font-bold mt-1 text-sm">¥{prod.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Coupons Strip */}
                <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-1 shrink-0 mr-2 border-r border-slate-100 pr-2">
                        <span className="text-red-600 font-bold">神券中心</span>
                        <span className="text-xs text-slate-400">抢大额券</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="flex flex-1 space-x-2 overflow-x-auto no-scrollbar">
                        {[
                            { val: '50', cond: '满999可用' },
                            { val: '100', cond: '满1999可用' },
                            { val: '200', cond: '满3999可用' }
                        ].map((c, i) => (
                            <div key={i} onClick={() => handleClaimCoupon(`coupon-${i}`)} className="bg-[#FFF4F4] text-red-600 px-3 py-1 rounded flex flex-col items-center min-w-[70px] border border-red-100 active:scale-95 transition-transform">
                                <div className="font-bold text-sm">¥<span className="text-lg">{c.val}</span></div>
                                <div className="text-[9px] whitespace-nowrap">{claimedCoupons[`coupon-${i}`] ? '已领取' : c.cond}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Dual Feed Cards */}
                <div className="flex space-x-3">
                    {/* Left: Trade In */}
                    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white rounded-xl p-3 border border-blue-50 relative overflow-hidden active:scale-98 transition-transform" onClick={() => navigate('/user/store/trade-in')}>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">以旧换新</span>
                                <span className="text-blue-800 text-xs font-bold">高价回收</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <Smartphone className="w-12 h-12 text-blue-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">旧机变现</p>
                                    <p className="text-sm font-bold text-slate-800">最高补¥1000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: New Arrivals */}
                    <div className="flex-1 bg-gradient-to-b from-purple-50 to-white rounded-xl p-3 border border-purple-50 relative overflow-hidden active:scale-98 transition-transform" onClick={() => handleProductClick({ t: '智能手表新款', price: '1299' })}>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="text-purple-800 text-sm font-bold italic">新品首发</span>
                                <span className="bg-purple-500 text-white text-[9px] px-1 rounded">0元试用</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <Watch className="w-12 h-12 text-purple-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">黑科技</p>
                                    <p className="text-sm font-bold text-slate-800">智能穿戴</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Custom Bottom Nav (Mock) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-center z-50 text-[10px] text-slate-500 pb-safe">
                <div className="flex flex-col items-center text-blue-600" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-0.5 shadow-lg shadow-blue-200">
                        <AlignLeft size={20} />
                    </div>
                    <span>逛数码</span>
                </div>
                <div className="flex flex-col items-center" onClick={() => navigate('/user/store/activity/coupon')}>
                    <Gift size={22} className="mb-1 text-slate-700" />
                    <span>福利社</span>
                </div>
                <div className="flex flex-col items-center" onClick={() => navigate('/user/store/trade-in')}>
                    <CreditCard size={22} className="mb-1 text-slate-700" />
                    <span>以旧换新</span>
                </div>
                <div className="flex flex-col items-center" onClick={() => navigate('/user/orders')}>
                    <ShoppingCart size={22} className="mb-1 text-slate-700" />
                    <span>购物车</span>
                </div>
                <div className="flex flex-col items-center" onClick={() => navigate('/user/profile')}>
                    <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex items-center justify-center mb-1 font-bold text-xs">¥</div>
                    <span>我的</span>
                </div>
            </div>
        </div>
    );
};

export default DigitalZone;
