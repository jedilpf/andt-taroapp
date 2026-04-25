
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Zap, Lock, Video, ChevronRight, CheckCircle, Smartphone, Lightbulb, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

export const SmartHomePage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

    const categories = [
        { id: 'lighting', name: '智能照明', icon: Lightbulb, color: 'text-amber-500 bg-amber-50', desc: '语音/手机控灯' },
        { id: 'security', name: '安防监控', icon: Shield, color: 'text-emerald-500 bg-emerald-50', desc: '门锁/摄像头' },
        { id: 'network', name: '网络覆盖', icon: Wifi, color: 'text-blue-500 bg-blue-50', desc: '全屋WiFi无死角' },
        { id: 'control', name: '全屋智控', icon: Smartphone, color: 'text-purple-500 bg-purple-50', desc: '一键情景模式' },
    ];

    const packages = [
        { id: 1, title: '智能门锁安装', price: 199, desc: '支持指纹/密码/人脸识别，含旧锁拆除', icon: Lock },
        { id: 2, title: '全屋智能开关改造', price: 50, unit: '/点位', desc: '无需改线，直接替换传统开关', icon: Zap },
        { id: 3, title: '家庭安防监控', price: 150, desc: '高清夜视，手机远程查看，异常报警', icon: Video },
    ];

    const handleBooking = (pkgTitle: string, price: number) => {
        if (!currentUser) return;
        createOrder({
            type: 'Install',
            title: `智慧家居服务 - ${pkgTitle}`,
            description: `预约项目：${pkgTitle}。\n请师傅上门勘测并提供安装服务。`,
            priceEstimate: { min: price, max: price + 100 },
            location: currentUser.location,
            status: OrderStatus.PENDING,
            scheduledTime: '待沟通'
        });
        // Navigate to orders
        navigate('/user/orders');
    };

    const handleFreeConsult = () => {
        if (!currentUser) return;
        createOrder({
            type: 'Checkup',
            title: '全屋智能方案设计',
            description: '预约免费上门勘测，定制全屋智能家居改造方案。',
            priceEstimate: { min: 0, max: 0 },
            location: currentUser.location,
            status: OrderStatus.PENDING,
            scheduledTime: '尽快'
        });
        // Navigate to orders
        navigate('/user/orders');
    };

    // Fix: Use navigate(-1) to correctly go back in history instead of pushing a new route
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 pb-safe">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center space-x-3">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform">
                    <ArrowLeft size={24} className="text-gray-800"/>
                </button>
                <h1 className="text-lg font-bold text-gray-900">智慧家居</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Hero Banner */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/10">
                            <SparklesIcon className="w-3 h-3 mr-1 text-yellow-300"/> 未来生活体验
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">定制您的理想家</h2>
                        <p className="text-indigo-100 text-sm mb-6 max-w-[80%]">专业师傅上门，传统家电秒变智能。让生活更便捷、更安全。</p>
                        
                        <button 
                            onClick={handleFreeConsult}
                            className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center"
                        >
                            预约免费方案设计 <ChevronRight size={14} className="ml-1"/>
                        </button>
                    </div>
                    
                    {/* Decor */}
                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
                    <Wifi size={120} className="absolute -right-6 -bottom-8 text-white opacity-10 rotate-[-15deg] group-hover:scale-110 transition-transform duration-700"/>
                    <div className="absolute top-10 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-4 text-base">服务场景</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(cat => (
                            <div key={cat.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-3 active:scale-[0.98] transition-transform cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                                    <cat.icon size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Packages */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-4 text-base">热门改造套餐</h3>
                    <div className="space-y-3">
                        {packages.map(pkg => (
                            <div 
                                key={pkg.id} 
                                onClick={() => handleBooking(pkg.title, pkg.price)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                        <pkg.icon size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{pkg.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{pkg.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right pl-2">
                                    <div className="text-red-500 font-bold text-lg">
                                        <span className="text-xs">¥</span>{pkg.price}{pkg.unit && <span className="text-xs text-gray-400 font-normal">{pkg.unit}</span>}
                                    </div>
                                    <button className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded mt-1">预约</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Banner */}
                <div className="bg-indigo-50/50 rounded-xl p-4 flex justify-around text-center">
                    <div>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto mb-1 text-green-500 shadow-sm"><CheckCircle size={16}/></div>
                        <span className="text-[10px] text-gray-500">专业持证电工</span>
                    </div>
                    <div>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto mb-1 text-green-500 shadow-sm"><CheckCircle size={16}/></div>
                        <span className="text-[10px] text-gray-500">透明标准定价</span>
                    </div>
                    <div>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto mb-1 text-green-500 shadow-sm"><CheckCircle size={16}/></div>
                        <span className="text-[10px] text-gray-500">售后质保无忧</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon Component
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 7.2L20 9.6L14.4 12L12 17.2L9.6 12L4 9.6L9.6 7.2L12 2Z"/>
    </svg>
);
