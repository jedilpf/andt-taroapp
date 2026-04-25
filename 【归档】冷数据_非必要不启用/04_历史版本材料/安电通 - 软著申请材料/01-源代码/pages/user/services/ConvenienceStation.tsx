
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, Navigation, Clock, ChevronRight, ArrowLeft, Building2, Stethoscope, Dog, ShoppingBasket, Truck, Landmark, Smartphone, MoreHorizontal, Star, Map, X, Navigation2, Flag, LocateFixed, Zap } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../context/AppContext';

// --- Types ---
interface Station {
    id: number;
    name: string;
    category: string;
    address: string;
    distance: string;
    hours: string;
    phone: string;
    status: 'open' | 'closed';
    rating: number;
    image: string;
    tags: string[];
}

// --- 模拟导航组件 ---
const NavigationSimulation = ({ station, onClose }: { station: Station, onClose: () => void }) => {
    const [progress, setProgress] = useState(0);

    // 模拟行驶进度
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 0.5 : 0));
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[5000] bg-slate-100 flex flex-col animate-fade-in overflow-hidden">
            {/* 模拟地图背景层 */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                {/* 装饰性路网模拟 */}
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}></div>
                
                {/* 动态导航路线 - SVG 绘制 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path 
                        d="M 200 700 Q 250 500, 100 400 T 300 150" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                    />
                    <path 
                        d="M 200 700 Q 250 500, 100 400 T 300 150" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        strokeDasharray="20 10"
                        className="animate-[dash_2s_linear_infinite]"
                    />
                    {/* 终点标记 */}
                    <circle cx="300" cy="150" r="10" fill="#ef4444" className="animate-pulse" />
                </svg>

                {/* 实时定位指针 */}
                <div 
                    className="absolute z-10 transition-all duration-500 ease-linear"
                    style={{ 
                        left: '50%', 
                        top: `${70 - progress * 0.5}%`,
                        transform: `translate(-50%, -50%) rotate(${progress * 5}deg)`
                    }}
                >
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
                        <div className="bg-blue-600 p-2 rounded-full shadow-2xl border-2 border-white text-white">
                            <Navigation2 size={24} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 顶部导航指令栏 */}
            <div className="relative z-20 p-4 pt-safe">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-6 text-white shadow-2xl flex items-center border border-white/10">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mr-5 shadow-lg shadow-blue-500/30">
                        <Navigation size={32} strokeWidth={3} className="-rotate-45" />
                    </div>
                    <div className="flex-1">
                        <p className="text-2xl font-black tracking-tight">前方 200 米左转</p>
                        <p className="text-sm text-white/50 font-bold mt-1">进入 天钥桥路</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 rounded-full active:scale-90 transition-transform">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* 侧边功能栏 */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-4">
                <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-90"><LocateFixed size={24}/></button>
                <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 active:scale-90"><Map size={24}/></button>
            </div>

            {/* 底部路线信息卡 */}
            <div className="mt-auto relative z-20 p-4 pb-safe animate-slide-up">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                            <Flag size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-800 line-clamp-1">{station.name}</h4>
                            <div className="flex items-center space-x-3 text-xs font-bold mt-1">
                                <span className="text-blue-600">步行 4 分钟</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-400">350 米</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-transform"
                    >
                        退出导航
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes dash {
                    to { stroke-dashoffset: -30; }
                }
            `}</style>
        </div>,
        document.body
    );
};

// --- Main Page ---
const CATEGORIES = [
    { id: 'all', label: '全部', icon: MoreHorizontal },
    { id: 'express', label: '快递驿站', icon: Truck },
    { id: 'medical', label: '医院门诊', icon: Stethoscope },
    { id: 'pet', label: '宠物医院', icon: Dog },
    { id: 'shop', label: '生活商超', icon: ShoppingBasket },
    { id: 'service', label: '营业厅', icon: Building2 },
    { id: 'gov', label: '政务大厅', icon: Landmark }
];

const STATIONS: Station[] = [
    { id: 1, name: '菜鸟驿站 (天钥桥路店)', category: 'express', address: '徐汇区天钥桥路333号102室', distance: '150m', hours: '08:00-21:00', phone: '13812345678', status: 'open', rating: 4.8, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80', tags: ['代收快递', '上门寄件'] },
    { id: 2, name: '徐家汇街道社区卫生中心', category: 'medical', address: '徐汇区汇嘉大厦旁', distance: '450m', hours: '08:00-17:00', phone: '021-64380000', status: 'open', rating: 4.5, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80', tags: ['社区全科', '医保定点'] },
    { id: 3, name: '爱宠一生动物医院', category: 'pet', address: '徐汇区零陵路800号', distance: '800m', hours: '09:00-20:00', phone: '021-64381111', status: 'open', rating: 4.9, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80', tags: ['宠物诊疗', '疫苗接种'] },
    { id: 4, name: '全家 FamilyMart (万科店)', category: 'shop', address: '天钥桥路333号正门口', distance: '50m', hours: '24小时营业', phone: '021-12345678', status: 'open', rating: 4.7, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80', tags: ['24H', '便民缴费'] },
    { id: 5, name: '中国移动营业厅 (徐家汇店)', category: 'service', address: '虹桥路1号港汇恒隆广场旁', distance: '1.2km', hours: '09:00-18:00', phone: '10086', status: 'open', rating: 4.6, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80', tags: ['宽带办理', '套餐更改'] },
    { id: 6, name: '国家电网便民服务站', category: 'gov', address: '徐汇路555号', distance: '1.5km', hours: '08:30-16:30', phone: '95598', status: 'open', rating: 4.4, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80', tags: ['购电', '故障报修'] },
];

export const ConvenienceStationPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [navStation, setNavStation] = useState<Station | null>(null);

    const filteredStations = useMemo(() => {
        return STATIONS.filter(s => 
            (activeTab === 'all' || s.category === activeTab) &&
            (s.name.includes(searchQuery) || s.tags.some(t => t.includes(searchQuery)))
        );
    }, [activeTab, searchQuery]);

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    return (
        <div className="h-full bg-[#F5F7FA] flex flex-col relative overflow-hidden pb-safe">
            {/* Header */}
            <div className="bg-white px-4 pt-4 pb-2 shrink-0 z-20 shadow-sm border-b border-slate-50">
                <div className="flex items-center mb-4 space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">便民驿站</h1>
                </div>

                <div className="bg-slate-100 rounded-2xl flex items-center px-4 py-2.5 mb-4">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="搜索快递站、医院、超市..." 
                        className="bg-transparent text-sm outline-none flex-1 text-slate-800 font-bold"
                    />
                </div>

                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveTab(cat.id)}
                            className={`whitespace-nowrap flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                activeTab === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                                : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                            <cat.icon size={12} className="mr-1.5"/>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10">
                <div className="bg-blue-50 px-4 py-3 rounded-2xl flex items-center justify-between mb-2">
                    <div className="flex items-center text-blue-700 text-xs font-bold">
                        <MapPin size={14} className="mr-1.5"/> 当前所在：天钥桥社区
                    </div>
                    <button className="text-[10px] text-blue-600 font-black">切换小区 &gt;</button>
                </div>

                {filteredStations.length > 0 ? (
                    filteredStations.map(station => (
                        <div key={station.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-[0.99] transition-all">
                            <div className="flex p-4 items-start space-x-4">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                                    <img src={station.image} className="w-full h-full object-cover" alt={station.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-black text-slate-800 truncate leading-tight pr-2">{station.name}</h3>
                                        <div className="flex items-center text-orange-500 font-bold text-xs shrink-0">
                                            <Star size={12} className="fill-current mr-0.5"/> {station.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-1 text-[10px] text-slate-400 font-medium">
                                        <MapPin size={10} className="mr-1"/> {station.distance} · {station.address}
                                    </div>
                                    <div className="flex items-center mt-1.5 text-[10px] font-bold">
                                        <span className={`px-1.5 py-0.5 rounded-md mr-2 ${station.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                            {station.status === 'open' ? '营业中' : '休息中'}
                                        </span>
                                        <span className="text-slate-500 flex items-center"><Clock size={10} className="mr-1"/> {station.hours}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {station.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-4 pb-4 flex space-x-2">
                                <button onClick={() => handleCall(station.phone)} className="flex-1 h-10 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-100 active:bg-slate-100 transition-colors">
                                    <Phone size={14} className="mr-1.5"/> 拨打电话
                                </button>
                                <button onClick={() => setNavStation(station)} className="flex-1 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors">
                                    <Navigation size={14} className="mr-1.5"/> 立即导航
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <Map size={64} className="text-slate-300" strokeWidth={1} />
                        <p className="mt-4 font-black text-slate-500">附近暂无此类驿站</p>
                    </div>
                )}
            </div>

            {/* 导航模拟浮层 */}
            {navStation && <NavigationSimulation station={navStation} onClose={() => setNavStation(null)} />}
        </div>
    );
};
