
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Settings, Crown, ClipboardList, Ticket, MapPin, Zap, LogOut, 
    ChevronRight, Headphones, Star, Clock, MessageSquare, History, 
    Coins, Wallet, ShieldCheck, Heart, UserCheck, 
    Smartphone, Gift, Bell, HelpCircle, Sparkles,
    Medal, GraduationCap, Stethoscope, ShieldPlus, HeartHandshake,
    ShieldAlert
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserRole, SpecialIdentity } from '../../../types';

export const UserProfilePage = () => {
    const { currentUser, logout, switchRole, messages } = useApp();
    const navigate = useNavigate();

    const stats = {
        points: currentUser?.points || 0
    };

    // Unread count
    const unreadCount = messages.filter(m => !m.read).length;

    // 获取身份勋章和样式
    const getIdentityConfig = (id?: SpecialIdentity) => {
        switch(id) {
            case SpecialIdentity.TEACHER: return { icon: GraduationCap, text: '优秀教师', color: 'text-blue-400 bg-blue-50/10' };
            case SpecialIdentity.DOCTOR: return { icon: Stethoscope, text: '白衣天使', color: 'text-emerald-400 bg-emerald-50/10' };
            case SpecialIdentity.VETERAN: return { icon: Medal, text: '退伍军人', color: 'text-orange-400 bg-orange-50/10' };
            case SpecialIdentity.MARTYR_CHILD: return { icon: ShieldPlus, text: '烈士子女', color: 'text-rose-400 bg-rose-50/10' };
            default: return null;
        }
    };

    const identity = getIdentityConfig(currentUser?.specialIdentity);

    return (
        <div className="min-h-full bg-[#F8FAFC] pb-24 overflow-y-auto no-scrollbar relative">
            
            {/* 1. 顶部个人信息区 */}
            <div className="bg-[#1E293B] pt-10 pb-16 px-6 relative rounded-b-[3rem] shadow-2xl overflow-hidden transition-all">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-400 via-slate-900 to-black pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="absolute right-0 top-0 flex items-center space-x-3">
                        <button 
                            onClick={() => navigate('/user/messages')}
                            className="p-2 bg-white/5 rounded-full backdrop-blur-md active:scale-90 transition-transform relative"
                        >
                            <Bell size={20} className="text-slate-400"/>
                            {unreadCount > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900 animate-pulse"></div>}
                        </button>
                        <button onClick={() => navigate('/user/settings')} className="p-2 bg-white/5 rounded-full backdrop-blur-md active:scale-90 transition-transform">
                            <Settings size={20} className="text-slate-400"/>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 pt-2">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden shadow-xl bg-slate-800">
                                <img src={currentUser?.avatar} className="w-full h-full object-cover" alt="avatar"/>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#FFD101] rounded-full p-0.5 border-2 border-[#1E293B]">
                                <Crown size={8} className="text-slate-900 fill-slate-900" />
                            </div>
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-black text-white truncate">{currentUser?.name}</h2>
                                {identity && (
                                    <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-md ${identity.color} border border-white/10`}>
                                        <identity.icon size={10} strokeWidth={3} />
                                        <span className="text-[9px] font-black">{identity.text}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <div onClick={() => navigate('/user/member-center')} className="bg-[#BFA54F]/20 border border-[#BFA54F]/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center shrink-0 cursor-pointer">
                                    <span className="text-[9px] text-[#BFA54F] font-black tracking-tight uppercase">黄金会员 Lv.3</span>
                                </div>
                                <div onClick={() => navigate('/user/points-mall')} className="bg-blue-500/10 border border-blue-500/30 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center shrink-0 cursor-pointer">
                                    <Coins size={10} className="text-blue-400 mr-1" />
                                    <span className="text-[9px] text-blue-300 font-black">{stats.points} 积分</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 核心会员卡片 */}
            <div className="px-4 -mt-8 relative z-20 mb-6">
                <div className="bg-[#1C1E22] rounded-[2rem] p-5 shadow-2xl border border-white/5 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <Crown size={18} className="text-[#FFD101] fill-[#FFD101]" />
                                <span className="text-base font-black text-[#FFD101] italic tracking-tighter uppercase">黑钻至尊会员</span>
                            </div>
                            <button 
                                onClick={() => navigate('/user/member-center')}
                                className="bg-[#FFD101] text-slate-900 text-[10px] font-black px-3 py-1 rounded-full flex items-center active:scale-95"
                            >
                                会员中心 <ChevronRight size={10} strokeWidth={3} className="ml-0.5" />
                            </button>
                        </div>
                        
                        <div className="mb-4 px-1">
                            <div className="flex justify-between items-end mb-1.5">
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">成长进度</p>
                                <p className="text-[9px] text-[#FFD101] font-black">14508 / 30000</p>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFD101] w-[48%] shadow-[0_0_10px_#FFD101]"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { label: '惊喜多选1', sub: '今日免单 >', icon: Zap },
                                { label: '每日领券', sub: '最高188元 >', icon: Ticket },
                                { label: '黑金神券', sub: '低至2.99元 >', icon: Coins },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-2.5 flex flex-col items-center text-center border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FFD101] mb-1.5">
                                        <item.icon size={14} />
                                    </div>
                                    <p className="text-[9px] font-black text-white mb-0.5">{item.label}</p>
                                    <p className="text-[8px] text-white/30 font-bold">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 统计导航区 */}
            <div className="px-6 mb-6 flex justify-between">
                {[
                    { label: '收藏', icon: Star, color: 'text-amber-500 bg-amber-50', path: '/user/favorites' },
                    { label: '浏览记录', icon: History, color: 'text-orange-500 bg-orange-50', path: '/user/browsing-history' },
                    { label: '红包卡券', icon: Ticket, color: 'text-blue-500 bg-blue-50', path: '/user/coupons', badge: '2' },
                    { label: '积分', icon: Coins, color: 'text-yellow-600 bg-yellow-50', path: '/user/points-mall' },
                ].map((item, i) => (
                    <button key={i} onClick={() => navigate(item.path)} className="flex flex-col items-center space-y-1.5 group">
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-sm border-2 border-white relative active:scale-90 transition-all`}>
                            <item.icon size={22} />
                            {item.badge && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">{item.badge}</span>
                            )}
                        </div>
                        <span className="text-[11px] font-black text-slate-600">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* 4. 优待身份与实名认证板块 (红框位置) */}
            <div className="px-4 mb-5 space-y-3">
                {/* 优待身份认证入口 (新增) */}
                <div onClick={() => navigate('/user/special-verify')} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer group">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${currentUser?.specialIdentity && currentUser?.specialIdentity !== SpecialIdentity.NONE ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
                             {identity ? <identity.icon size={24} /> : <HeartHandshake size={24} />}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800">公益优待认证</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {identity ? `已认证${identity.text}特权` : '教师/医生/老兵/烈属专享'}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center text-[10px] font-black px-3 py-1.5 rounded-full border ${identity ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                        {identity ? '查看权益' : '去认证'} 
                        <ChevronRight size={10} className="ml-0.5 group-active:translate-x-0.5 transition-transform" />
                    </div>
                </div>

                {/* 实名认证入口 */}
                <div onClick={() => navigate('/user/identity-verify')} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer group">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${currentUser?.identityStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            {currentUser?.identityStatus === 'VERIFIED' ? <ShieldCheck size={24} /> : <UserCheck size={24} />}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800">实名认证</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {currentUser?.identityStatus === 'VERIFIED' ? '已完成公安联网核验' : '完成认证保障资金安全'}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center text-[10px] font-black px-3 py-1.5 rounded-full border ${currentUser?.identityStatus === 'VERIFIED' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>
                        {currentUser?.identityStatus === 'VERIFIED' ? '已认证' : (currentUser?.identityStatus === 'PENDING' ? '审核中' : '去认证')} 
                        <ChevronRight size={10} className="ml-0.5" />
                    </div>
                </div>
            </div>

            {/* 5. 我的订单区域 */}
            <div className="px-4 mb-5">
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-base font-black text-slate-800 flex items-center">
                            <div className="w-1 h-4 bg-slate-800 rounded-full mr-2"></div>
                            我的订单
                        </h3>
                        <button onClick={() => navigate('/user/orders')} className="text-[10px] font-bold text-slate-400 flex items-center">
                            全部订单 <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: '待付款', icon: Wallet, path: '/user/orders' },
                            { label: '待收货', icon: Clock, path: '/user/orders', badge: '1' },
                            { label: '待评价', icon: MessageSquare, path: '/user/orders' },
                            { label: '退款/售后', icon: ShieldCheck, path: '/user/after-sales' },
                        ].map((item, i) => (
                            <button key={i} onClick={() => navigate(item.path)} className="flex flex-col items-center space-y-1 group active:opacity-60">
                                <div className="relative">
                                    <item.icon size={22} className="text-slate-600" strokeWidth={1.5} />
                                    {item.badge && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#FFD101] text-slate-900 text-[8px] font-black rounded-full flex items-center justify-center border border-white">{item.badge}</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. 更多功能列表 */}
            <div className="px-4 space-y-3 pb-10">
                <div className="bg-white rounded-[1.8rem] p-1 shadow-sm border border-slate-100 overflow-hidden">
                    <div onClick={() => navigate('/user/addresses')} className="flex items-center justify-between p-3.5 active:bg-slate-50 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                                <MapPin size={18} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">地址管理</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-active:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="mx-4 h-px bg-slate-50"></div>
                    <div onClick={() => {switchRole(UserRole.ELECTRICIAN); navigate('/electrician/hall');}} className="flex items-center justify-between p-3.5 active:bg-slate-50 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-sm">
                                <Zap size={18} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">切换到电工版</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold mr-1">认证赚积分</span>
                        <ChevronRight size={16} className="text-slate-300" />
                    </div>
                </div>

                <div className="bg-white rounded-[1.8rem] p-1 shadow-sm border border-slate-100 overflow-hidden">
                    <div onClick={() => {logout(); navigate('/');}} className="flex items-center justify-between p-3.5 active:bg-red-50 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
                                <LogOut size={18} />
                            </div>
                            <span className="text-sm font-bold text-rose-500">退出登录</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center py-8 opacity-20 flex flex-col items-center space-y-1.5">
                <Zap size={14} className="text-slate-500 fill-slate-500" />
                <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Andiantong Digital Life</p>
            </div>
        </div>
    );
};

export default UserProfilePage;
