import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Search, ShoppingCart,
    Pill, Heart, Stethoscope, Thermometer,
    MoreHorizontal, ChevronRight, Zap, Gift,
    CreditCard, AlignLeft, ShieldCheck,
    Timer, Sparkles, Truck, Activity, Syringe,
    Tablets, Cross, FileHeart, UserCheck, Loader2, Check
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';
import SupermarketProductDetail from './SupermarketProductDetail';
import MedicineCategoryPage from './MedicineCategoryPage';

const MedicineZone = () => {
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

    const handleClaimCoupon = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
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

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory({ name: categoryName });
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
                    type: 'Medicine',
                    title: selectedProduct.t || selectedProduct.title || '医药产品',
                    description: `购买了 ${selectedProduct.t || selectedProduct.title}`,
                    priceEstimate: { min: parseFloat(selectedProduct.price || selectedProduct.p || '0'), max: parseFloat(selectedProduct.price || selectedProduct.p || '0'), final: parseFloat(selectedProduct.price || selectedProduct.p || '0') },
                    location: currentUser?.location || { lat: 39.9, lng: 116.4, address: '未知地址' },
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
                <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <Check size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">支付成功</h2>
                <p className="text-sm text-slate-400 font-bold mb-10">医药订单属于优先配送，骑手正在火速赶往药店。</p>
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
        return <MedicineCategoryPage category={selectedCategory} onBack={handleBack} onProductSelect={handleProductClick} />;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24 relative animate-fade-in text-slate-800">
            {/* --- Header Area (Medical Cyan Gradient) --- */}
            <div className="bg-gradient-to-b from-cyan-600 to-[#F5F7FA] pb-4 sticky top-0 z-40">
                <div className="pt-safe px-3 pb-2 flex items-center justify-between text-white">
                    <button onClick={() => navigate(-1)} className="p-1 active:opacity-60">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-lg font-bold tracking-wide">社区药房</div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-black/20 px-2 py-0.5 rounded-full text-[10px] space-x-1 backdrop-blur-sm">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>医保支付</span>
                        </div>
                        <MoreHorizontal className="w-6 h-6" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 mt-1">
                    <div className="bg-white rounded-full h-9 flex items-center px-4 shadow-sm border border-cyan-100 active:scale-95 transition-transform" onClick={() => handleCategoryClick('搜索')}>
                        <Search className="w-4 h-4 text-cyan-500 mr-2" />
                        <span className="text-slate-400 text-sm">999感冒灵</span>
                        <div className="ml-auto bg-cyan-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            搜索
                        </div>
                    </div>
                </div>

                {/* Horizontal Tags Scroll */}
                <div className="flex items-center space-x-2 px-3 mt-3 overflow-x-auto no-scrollbar text-xs text-white pb-2">
                    <span
                        className="bg-[#0E7490] text-[#A5F3FC] px-2 py-1 rounded flex items-center shrink-0 font-bold border border-cyan-400/30 shadow-lg active:scale-95 transition-transform"
                        onClick={() => handleCategoryClick('夜间急送')}
                    >
                        <span className="bg-[#A5F3FC] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] mr-1">24h</span>
                        夜间急送
                    </span>
                    <span
                        className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center active:bg-white/30 transition-colors"
                        onClick={() => handleCategoryClick('在线问诊')}
                    >
                        👨‍⚕️ 在线问诊
                    </span>
                    <span
                        className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center active:bg-white/30 transition-colors"
                        onClick={() => handleCategoryClick('用药咨询')}
                    >
                        💊 用药咨询
                    </span>
                    <span
                        className="bg-white/20 backdrop-blur px-3 py-1 rounded-full shrink-0 flex items-center active:bg-white/30 transition-colors"
                        onClick={() => handleCategoryClick('流感专区')}
                    >
                        🦠 流感专区
                    </span>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="px-3 -mt-2 space-y-3 relative z-10">

                {/* 1. Quick Meds Station */}
                <div className="bg-white rounded-xl p-3 shadow-sm active:scale-[0.99] transition-transform" onClick={() => handleCategoryClick('附近药店')}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-1">
                            <span className="text-cyan-600 font-black italic text-lg">急速药箱</span>
                            <span className="bg-cyan-100 text-cyan-600 text-[9px] px-1 rounded">最快28分达</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                            附近药店 <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {[
                            { id: 'm1', val: '6', cond: '药品通用券' },
                            { id: 'm2', val: '12', cond: '满99可用' },
                        ].map((c) => (
                            <div key={c.id}
                                className="flex-1 bg-cyan-50 rounded-lg p-2 flex justify-between items-center border border-cyan-100 relative overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div>
                                    <p className="text-cyan-600 font-bold text-lg">¥{c.val}</p>
                                    <p className="text-cyan-500 text-[9px]">{c.cond}</p>
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-cyan-600 text-[10px] font-bold mb-1">健康金</p>
                                    <button
                                        onClick={(e) => handleClaimCoupon(c.id, e)}
                                        disabled={claimedCoupons[c.id] || claiming === c.id}
                                        className={`text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transition-all ${claimedCoupons[c.id] ? 'bg-cyan-300' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 active:scale-90'}`}
                                    >
                                        {claiming === c.id ? <Loader2 size={10} className="animate-spin" /> : (claimedCoupons[c.id] ? '已领取' : '立即领取')}
                                    </button>
                                </div>
                                {/* Watermark */}
                                {claimedCoupons[c.id] && <div className="absolute -right-3 -bottom-3 text-cyan-200 opacity-50 rotate-[-20deg] border-2 border-cyan-200 rounded-full p-2 text-xs font-black">已领取</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Category Grid */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-5 gap-y-4">
                        {[
                            { name: '感冒发烧', icon: <Thermometer className="text-red-500" />, color: 'bg-red-50' },
                            { name: '皮肤用药', icon: <Activity className="text-orange-500" />, color: 'bg-orange-50' },
                            { name: '肠胃消化', icon: <Pill className="text-amber-500" />, color: 'bg-amber-50' },
                            { name: '儿童用药', icon: <Heart className="text-pink-500" />, color: 'bg-pink-50' },
                            { name: '慢病管理', icon: <FileHeart className="text-blue-500" />, color: 'bg-blue-50' },
                            { name: '滋补保健', icon: <Sparkles className="text-purple-500" />, color: 'bg-purple-50' },
                            { name: '医疗器械', icon: <Stethoscope className="text-slate-500" />, color: 'bg-slate-50' },
                            { name: '成人用品', icon: <Gift className="text-rose-500" />, color: 'bg-rose-50' },
                            { name: '家庭常备', icon: <Cross className="text-red-600" />, color: 'bg-red-50' },
                            { name: '全部分类', icon: <MoreHorizontal className="text-cyan-500" />, color: 'bg-cyan-50' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center space-y-2 active:opacity-60 transition-opacity cursor-pointer"
                                onClick={() => handleCategoryClick(item.name)}
                            >
                                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <span className="text-[11px] text-slate-700 font-medium whitespace-nowrap">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Health Subsidy (Cyan Gradient) */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-500 rounded-xl p-3 shadow-sm text-white sticky top-[80px] z-30">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-[#FFD700] text-cyan-900 text-xs font-black px-1.5 rounded">补</span>
                        <h3 className="font-bold text-lg italic">健康百亿补 x 正品保障</h3>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {/* Big Card - Ibuprofen */}
                        <div
                            className="bg-white rounded-lg p-2 min-w-[100px] flex flex-col items-center text-center relative overflow-hidden shrink-0 active:scale-95 transition-transform"
                            onClick={() => handleProductClick({ t: '布洛芬缓释胶囊', price: '19.9', tag: '爆款' })}
                        >
                            <div className="absolute top-0 left-0 bg-[#FFD700] text-[#B8860B] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                爆款
                            </div>
                            <div className="mt-4 mb-1">
                                <p className="text-cyan-600 font-bold text-xs">布洛芬</p>
                                <p className="bg-red-500 text-white text-[10px] px-2 rounded-full mt-0.5">缓释胶囊</p>
                            </div>
                        </div>
                        {/* Product Cards */}
                        {[
                            { t: '维生素C咀嚼片', img: null, icon: <Tablets size={32} className="text-orange-500" />, price: '19.9', back: '5' },
                            { t: '益生菌冻干粉', img: null, icon: <Activity size={32} className="text-blue-500" />, price: '88.0', back: '10' },
                            { t: '智能电子血压计', img: null, icon: <Activity size={32} className="text-gray-400" />, price: '129', back: '20' },
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
                        <span className="text-red-600 font-bold">健康金</span>
                        <span className="text-xs text-slate-400">购药抵扣</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="flex flex-1 space-x-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'c1', val: '2', cond: '无门槛' },
                            { id: 'c2', val: '5', cond: '满59可用' },
                            { id: 'c3', val: '8', cond: '满89可用' }
                        ].map((c, i) => (
                            <div
                                key={i}
                                className={`px-3 py-1 rounded flex flex-col items-center min-w-[70px] border active:scale-95 transition-all ${claimedCoupons[c.id] ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-[#FFF4F4] text-red-600 border-red-100'}`}
                                onClick={() => handleClaimCoupon(c.id)}
                            >
                                <div className="font-bold text-sm">¥<span className="text-lg">{c.val}</span></div>
                                <div className="text-[9px] whitespace-nowrap">{claimedCoupons[c.id] ? '已领' : c.cond}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Dual Feed Cards */}
                <div className="flex space-x-3">
                    {/* Left: Quick Meds */}
                    <div
                        className="flex-1 bg-gradient-to-b from-cyan-50 to-white rounded-xl p-3 border border-cyan-50 relative overflow-hidden active:scale-98 transition-transform"
                        onClick={() => handleCategoryClick('小病快买')}
                    >
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="bg-cyan-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">小病快买</span>
                                <span className="text-cyan-800 text-xs font-bold">对症找药</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <Pill className="w-12 h-12 text-cyan-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">感冒/咳嗽</p>
                                    <p className="text-sm font-bold text-slate-800">一键加购</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Online Doctor */}
                    <div
                        className="flex-1 bg-gradient-to-b from-blue-50 to-white rounded-xl p-3 border border-blue-50 relative overflow-hidden active:scale-98 transition-transform"
                        onClick={() => handleCategoryClick('问名医')}
                    >
                        <div className="relative z-10">
                            <div className="flex items-center space-x-1 mb-2">
                                <span className="text-blue-800 text-sm font-bold italic">问名医</span>
                                <span className="bg-blue-500 text-white text-[9px] px-1 rounded">极速接诊</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <UserCheck className="w-12 h-12 text-blue-200" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">三甲专家</p>
                                    <p className="text-sm font-bold text-slate-800">¥9.9起</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Custom Bottom Nav (Mock) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-center z-50 text-[10px] text-slate-500 pb-safe">
                <div className="flex flex-col items-center text-cyan-600">
                    <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white mb-0.5 shadow-lg shadow-cyan-200">
                        <AlignLeft size={20} />
                    </div>
                    <span>买好药</span>
                </div>
                <div className="flex flex-col items-center active:opacity-60" onClick={() => handleCategoryClick('找医生')}>
                    <Activity size={22} className="mb-1 text-slate-700" />
                    <span>找医生</span>
                </div>
                <div className="flex flex-col items-center active:opacity-60" onClick={() => handleCategoryClick('查医保')}>
                    <FileHeart size={22} className="mb-1 text-slate-700" />
                    <span>查医保</span>
                </div>
                <div className="flex flex-col items-center active:opacity-60" onClick={() => handleCategoryClick('药箱')}>
                    <ShoppingCart size={22} className="mb-1 text-slate-700" />
                    <span>药箱</span>
                </div>
                <div className="flex flex-col items-center active:opacity-60" onClick={() => handleCategoryClick('我的')}>
                    <div className="w-6 h-6 border-2 border-slate-700 rounded-full flex items-center justify-center mb-1 font-bold text-xs">¥</div>
                    <span>我的</span>
                </div>
            </div>
        </div>
    );
};

export default MedicineZone;
