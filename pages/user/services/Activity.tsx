
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, X, Clock, MapPin, ChevronRight, Loader2, Heart, Users, Calendar, Award, Star, Trophy, CheckCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, Location } from '../../../types';
import { TimeSelector, AddressSelector } from '../../../components/user/UserShared';

// --- Mock Data ---
const ACTIVITIES = [
    {
        id: 1,
        title: "冬季用电安全入户排查",
        desc: "协助专业电工为独居老人进行线路体检，消除火灾隐患。",
        date: "本周六 09:00-12:00",
        location: "天钥桥路小区及周边",
        points: 50,
        recruited: 12,
        total: 20,
        tags: ["安全", "助老"],
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=400&h=200&fit=crop"
    },
    {
        id: 2,
        title: "社区长者智能手机培训",
        desc: "教老人使用微信、健康码及安电通APP一键报修功能。",
        date: "下周二 14:00-16:00",
        location: "徐家汇街道活动中心",
        points: 30,
        recruited: 5,
        total: 8,
        tags: ["教学", "轻松"],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
    },
    {
        id: 3,
        title: "楼道清理与照明检修",
        desc: "清理楼道杂物，配合物业检修公共区域照明灯具。",
        date: "11月30日 09:30",
        location: "社区公共区域",
        points: 40,
        recruited: 15,
        total: 15,
        tags: ["体力", "环境"],
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=200&fit=crop"
    }
];

const EventBookingModal = ({ activity, onClose }: { activity: any, onClose: () => void }) => {
    const { currentUser, createOrder } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
             createOrder({
                type: 'Checkup', // Using Checkup type for volunteer activities
                title: `志愿活动：${activity.title}`,
                description: `报名参加公益活动。\n活动时间：${activity.date}\n集合地点：${activity.location}`,
                priceEstimate: { min: 0, max: 0, final: 0 },
                scheduledTime: activity.date,
                location: currentUser.location, // Using user's location as base
                status: OrderStatus.ACCEPTED // Auto accepted
            });
            setLoading(false);
            onClose();
            navigate('/user/orders');
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9990] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-[2rem] p-6 animate-slide-up pb-10 max-h-[85vh] overflow-y-auto pointer-events-auto relative z-10 mx-auto shadow-2xl">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{activity.title}</h3>
                        <div className="flex items-center text-rose-500 font-bold text-sm">
                            <Award size={16} className="mr-1"/> 奖励 {activity.points} 爱心积分
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500"/>
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex items-start space-x-3">
                            <Calendar size={18} className="text-gray-400 mt-0.5 shrink-0"/>
                            <div>
                                <span className="block text-xs text-gray-400 font-bold mb-0.5">活动时间</span>
                                <span className="text-sm font-bold text-gray-800">{activity.date}</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0"/>
                            <div>
                                <span className="block text-xs text-gray-400 font-bold mb-0.5">集合地点</span>
                                <span className="text-sm font-bold text-gray-800">{activity.location}</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Users size={18} className="text-gray-400 mt-0.5 shrink-0"/>
                            <div>
                                <span className="block text-xs text-gray-400 font-bold mb-0.5">招募进度</span>
                                <div className="flex items-center">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                                        <div className="h-full bg-rose-500" style={{width: `${(activity.recruited/activity.total)*100}%`}}></div>
                                    </div>
                                    <span className="text-xs font-bold text-rose-600">{activity.recruited}/{activity.total} 人</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info Confirmation */}
                    <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
                                我
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">确认报名信息</p>
                                <p className="text-xs text-gray-500">我们将为您购买志愿服务保险</p>
                            </div>
                        </div>
                        <CheckCircle size={20} className="text-rose-500"/>
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-500/30 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70 disabled:shadow-none"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2"/> : '确认加入'}
                    </button>
                    <p className="text-center text-xs text-gray-400">报名即代表同意《志愿服务协议》</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const ActivityPage = () => {
    const navigate = useNavigate();
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe flex flex-col">
             {/* Header Area */}
             <div className="bg-gradient-to-b from-rose-50 to-gray-50 pb-4">
                <div className="p-4 flex items-center space-x-3 sticky top-0 z-10">
                    {/* Fix: navigate(-1) ensures correct back behavior */}
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/50 active:scale-95 transition-transform"><ArrowLeft size={24} className="text-gray-800"/></button>
                    <h1 className="text-lg font-black text-gray-800">社区志愿</h1>
                </div>

                {/* Hero Stats */}
                <div className="px-4 mb-6">
                    <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-[2rem] p-6 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                                        <Heart size={16} className="fill-white text-white"/>
                                    </div>
                                    <span className="text-sm font-bold opacity-90">我的爱心档案</span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Level 2 <span className="text-lg font-medium opacity-80">社区卫士</span></h2>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black">12.5</p>
                                <p className="text-xs opacity-80 font-medium">服务时长 (小时)</p>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between">
                            <div className="flex items-center space-x-2">
                                <Star size={14} className="text-yellow-300 fill-yellow-300"/>
                                <span className="text-xs font-bold">积分: 350</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Trophy size={14} className="text-yellow-300 fill-yellow-300"/>
                                <span className="text-xs font-bold">排名: 社区前 10%</span>
                            </div>
                        </div>

                        {/* Decor */}
                        <Heart size={120} className="absolute -right-6 -top-6 text-white opacity-10 rotate-12"/>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-400 opacity-20 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 flex items-center space-x-6 border-b border-gray-200/50 mx-4">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`pb-3 text-sm font-bold relative transition-colors ${activeTab === 'all' ? 'text-rose-600' : 'text-gray-400'}`}
                    >
                        招募中
                        {activeTab === 'all' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-rose-600 rounded-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('mine')}
                        className={`pb-3 text-sm font-bold relative transition-colors ${activeTab === 'mine' ? 'text-rose-600' : 'text-gray-400'}`}
                    >
                        我的报名
                        {activeTab === 'mine' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-rose-600 rounded-full"></div>}
                    </button>
                </div>
             </div>

             {/* List */}
             <div className="flex-1 p-4 pt-2 space-y-4">
                 {ACTIVITIES.map(activity => (
                     <div 
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity)}
                        className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-[0.99] transition-all cursor-pointer group"
                     >
                         <div className="flex space-x-4">
                             {/* Image */}
                             <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0 overflow-hidden relative">
                                 <img src={activity.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Act"/>
                                 <div className="absolute top-1 left-1 bg-black/30 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                     +{activity.points} 积分
                                 </div>
                             </div>
                             
                             {/* Info */}
                             <div className="flex-1 py-0.5 flex flex-col justify-between">
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">{activity.title}</h3>
                                     </div>
                                     <div className="flex flex-wrap gap-1 mb-2">
                                         {activity.tags.map(tag => (
                                             <span key={tag} className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{tag}</span>
                                         ))}
                                     </div>
                                 </div>
                                 
                                 <div className="flex justify-between items-end">
                                     <div className="text-xs text-gray-400 space-y-0.5">
                                         <p className="flex items-center"><Calendar size={10} className="mr-1"/> {activity.date}</p>
                                         <p className="flex items-center"><MapPin size={10} className="mr-1"/> {activity.location}</p>
                                     </div>
                                     <button className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${activity.recruited >= activity.total ? 'bg-gray-100 text-gray-400' : 'bg-rose-500 text-white'}`}>
                                         {activity.recruited >= activity.total ? '已满员' : '去报名'}
                                     </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>

             {/* Floating Action Button for Propose */}
             <div className="fixed bottom-6 right-4 z-20">
                 <button className="bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl shadow-gray-900/30 font-bold text-sm flex items-center active:scale-95 transition-transform">
                     <Users size={18} className="mr-2"/> 发起活动
                 </button>
             </div>

             {selectedActivity && <EventBookingModal activity={selectedActivity} onClose={() => setSelectedActivity(null)}/>}
        </div>
    )
}
