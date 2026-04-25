
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Zap, Shield, Wrench, Heart, BookOpen, Wifi, Headphones, Coffee, Sparkles, Star, ChevronRight, ShieldCheck, ShoppingBag, Ticket, Gift, Volume2, Users, X, Calendar, MapPin, Map, Store, Siren, Cpu, Landmark, MessageSquareText } from 'lucide-react';
import { UserHeader } from '../../components/user/UserShared';

// --- Bulletin Modal Component ---
const BulletinModal = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 animate-slide-up pointer-events-auto relative z-10 pb-safe max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-20 pb-2 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <Volume2 size={20} className="mr-2 text-orange-500" /> 社区公告
                    </h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 mb-3 leading-tight">关于开展冬季用电安全免费排查活动的通知</h2>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">置顶</span>
                            <span>2023-11-24 发布</span>
                            <span>街道办</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                        <p>尊敬的居民朋友们：</p>
                        <p>
                            随着冬季气温降低，家庭取暖设备使用频率增加，用电负荷增大。为了消除老旧线路火灾隐患，保障大家的生命财产安全，<span className="font-bold text-gray-800">安电通</span> 联合 <span className="font-bold text-gray-800">徐家汇街道办</span> 将于近期开展公益检测活动。
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                            <div className="flex items-start">
                                <Calendar size={16} className="mr-2 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold text-gray-800 block text-xs mb-0.5">活动时间</span>
                                    <span className="text-gray-600">本周六 (11月25日) 09:00 - 17:00</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold text-gray-800 block text-xs mb-0.5">活动范围</span>
                                    <span className="text-gray-600">徐汇区天钥桥路小区及周边社区</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 mb-2">检测内容：</h4>
                            <ul className="list-disc list-inside space-y-1 pl-1 bg-orange-50/50 p-3 rounded-lg text-orange-800">
                                <li>入户总配电箱安检（漏保测试）</li>
                                <li>全屋开关插座排查、极性是否正确</li>
                                <li>大功率电器负载测试、线路绝缘性检测。</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => { onClose(); navigate('/user/activity'); }}
                            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform flex items-center justify-center"
                        >
                            立即报名参加 <ChevronRight size={16} className="ml-1" />
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">本次活动全程免费，不收取任何费用</p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [showBulletin, setShowBulletin] = useState(false);

    // 公益导航
    const welfareServices = [
        { id: 'inspection', label: '公益安检', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100', route: '/user/inspection', tag: '免费' },
        { id: 'academy', label: '安全课堂', icon: BookOpen, color: 'text-blue-600 bg-blue-100', route: '/user/academy', tag: '涨知识' },
        { id: 'activity', label: '社区志愿', icon: Heart, color: 'text-rose-600 bg-rose-100', route: '/user/activity', tag: '招募中' },
        { id: 'coupons', label: '惠民福利', icon: Gift, color: 'text-orange-600 bg-orange-100', route: '/user/coupons', tag: '领券' },
    ];

    // 便民服务大厅
    const convenienceServices = [
        { id: 'repair', label: '应急维修', icon: Zap, color: 'text-slate-600 bg-slate-50', route: '/user/repair' },
        { id: 'install', label: '便民安装', icon: Wrench, color: 'text-slate-600 bg-slate-50', route: '/user/install', badge: '惠民' },
        { id: 'smart', label: '智慧家居', icon: Wifi, color: 'text-slate-600 bg-slate-50', route: '/user/smart-home' },
        { id: 'local', label: '周边服务', icon: Coffee, color: 'text-slate-600 bg-slate-50', route: '/user/local' },
        { id: 'support', label: '居民热线', icon: Headphones, color: 'text-slate-600 bg-slate-50', action: () => window.dispatchEvent(new Event('open-support')) },
        { id: 'station', label: '便民驿站', icon: MapPin, color: 'text-slate-600 bg-slate-50', route: '/user/convenience-station' },
        { id: 'tasks', label: '我的需求', icon: MessageSquareText, color: 'text-orange-600 bg-orange-50', route: '/user/tasks', badge: '新功能' },
        { id: 'ai', label: 'AI 顾问', icon: Sparkles, color: 'text-slate-600 bg-slate-50', action: () => window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { model: 'gemini' } })) },
    ];

    const FEATURED_ELECTRICIANS = [
        { id: 1, name: "王师傅", years: "20年", rating: 5.0, tags: ["党员", "志愿服务100+h", "电路急修"], distance: "0.5km", image: "/assets/avatars/p1.png", badgeText: "党员", badgeColor: "bg-red-500" },
        { id: 2, name: "张师傅", years: "12年", rating: 4.9, tags: ["金牌电工", "持证上岗", "灯具安装"], distance: "0.8km", image: "/assets/avatars/p2.png", badgeText: "金牌", badgeColor: "bg-blue-500" },
        { id: 3, name: "李师傅", years: "8年", rating: 4.8, tags: ["退伍军人", "实名认证", "老房翻新"], distance: "1.2km", image: "/assets/avatars/p3.png", badgeText: "优选", badgeColor: "bg-green-500" }
    ];

    return (
        <div className="pb-24 bg-[#F5F7FA] min-h-[100dvh] relative">
            <UserHeader />

            <div className="px-4 -mt-6 relative z-10 space-y-4">

                {/* 社区公告栏 */}
                <div
                    onClick={() => setShowBulletin(true)}
                    className="bg-white rounded-full p-3 flex items-center shadow-sm border border-orange-100 cursor-pointer active:scale-[0.99] transition-transform"
                >
                    <div className="bg-orange-100 text-orange-600 p-1.5 rounded-full mr-3 animate-pulse">
                        <Volume2 size={16} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-gray-600 truncate font-medium">
                            <span className="text-orange-500 font-bold mr-1">社区公告:</span>
                            本周六徐汇区天钥桥路小区开展免费线路老化排查活动...
                        </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 ml-2" />
                </div>

                {/* 公益宣传位 */}
                <div onClick={() => navigate('/user/inspection')} className="relative rounded-3xl overflow-hidden shadow-xl shadow-orange-500/10 group cursor-pointer bg-orange-500">
                    <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-red-600/80 to-transparent"></div>
                    <div className="relative p-5 flex items-center justify-between text-white">
                        <div className="flex-1 z-10">
                            <h3 className="text-xl font-black tracking-wide text-white drop-shadow-lg mb-1">免费一键上门检测</h3>
                            <div className="flex items-center mb-4 space-x-2">
                                <span className="bg-yellow-300 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-yellow-100 shadow-sm">官方全额补贴</span>
                                <p className="text-orange-50 text-xs font-bold opacity-100 tracking-wide">消除隐患 · 守护家人</p>
                            </div>
                            <span className="bg-white text-red-600 px-4 py-2 rounded-full text-xs font-black shadow-lg inline-flex items-center space-x-1">
                                <span>立即免费预约</span><ChevronRight size={14} className="stroke-[3px]" />
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-b from-white/20 to-white/5 rounded-full flex flex-col items-center justify-center border-2 border-white/60 backdrop-blur-md">
                                <span className="text-3xl font-black text-white">98</span>
                                <span className="text-[9px] font-bold text-orange-100">安全指数</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 公益导航区 */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-gray-800 text-lg flex items-center">
                            <Heart size={20} className="text-rose-500 mr-2 fill-rose-500" /> 公益福利区
                        </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {welfareServices.map((service) => (
                            <button key={service.id} onClick={() => navigate(service.route)} className="flex flex-col items-center group relative">
                                {service.tag && <span className="absolute -top-2 right-0 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full border border-white shadow-sm z-10">{service.tag}</span>}
                                <div className={`w-14 h-14 rounded-[20px] ${service.color} flex items-center justify-center mb-2 shadow-sm group-active:scale-95 transition-transform`}>
                                    <service.icon size={26} strokeWidth={2} />
                                </div>
                                <span className="text-xs font-bold text-gray-700">{service.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 便民服务大厅 */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                    <h3 className="font-bold text-gray-800 text-sm mb-4 pl-1 border-l-4 border-blue-500">便民服务大厅</h3>
                    <div className="grid grid-cols-4 gap-y-6">
                        {convenienceServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => service.action ? service.action() : navigate(service.route)}
                                className="flex flex-col items-center group relative"
                            >
                                {service.badge && (
                                    <span className="absolute -top-1 right-2 bg-blue-600 text-white text-[8px] px-1.5 rounded-full z-10 font-black border border-white">
                                        {service.badge}
                                    </span>
                                )}
                                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center mb-2 group-active:bg-slate-100 transition-colors shadow-sm border border-slate-100/50">
                                    <service.icon size={24} strokeWidth={1.5} />
                                </div>
                                <span className="text-xs text-slate-600 font-medium">{service.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 社区志愿者榜单 */}
                <div className="pb-4">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center">
                            <Users size={16} className="mr-1.5 text-orange-500" /> 社区明星师傅
                        </h3>
                        <button onClick={() => navigate('/user/map')} className="text-[10px] font-bold text-white bg-slate-900 px-3 py-1.5 rounded-full flex items-center active:scale-95">前往地图 <ChevronRight size={12} /></button>
                    </div>
                    <div className="space-y-3">
                        {FEATURED_ELECTRICIANS.map((elec) => (
                            <div key={elec.id} onClick={() => navigate('/user/map')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-3 active:bg-gray-50">
                                <div className="relative shrink-0">
                                    {/* 修正：使用本地图片路径 */}
                                    <img src={elec.image} onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + elec.name; }} className="w-12 h-12 rounded-full bg-gray-100 object-cover border border-gray-200" />
                                    <div className={`absolute -bottom-1 -right-1 ${elec.badgeColor} text-white text-[8px] font-black px-1.5 rounded-full border border-white`}>{elec.badgeText}</div>
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800 text-sm">{elec.name} <span className="text-[10px] text-gray-400 font-normal">从业{elec.years}</span></h4>
                                        <span className="text-orange-500 text-xs font-bold flex items-center"><Star size={10} className="fill-current mr-0.5" /> {elec.rating}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {elec.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[9px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end justify-between h-full pt-1">
                                    <span className="text-[10px] text-gray-400 mb-2">{elec.distance}</span>
                                    <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">咨询</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showBulletin && <BulletinModal onClose={() => setShowBulletin(false)} />}
        </div>
    );
};

export default Home;
