
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, CheckCircle, MapPin, Plus, Trash2, Edit2, Copy, Share2, Shield, Lock, Smartphone, ChevronRight, Gift, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// --- Shared Header ---
const PageHeader = ({ title, rightAction }: { title: string, rightAction?: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <button onClick={() => navigate(-1)} className="active:opacity-50"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            </div>
            {rightAction}
        </div>
    );
};

// --- Coupons Page ---
export const UserCoupons = () => {
    const coupons = [
        { id: 1, amount: 50, type: '新人专享', desc: '无门槛，仅限首单', expiry: '2024-12-31', status: 'valid' },
        { id: 2, amount: 20, type: '通用券', desc: '满100元可用', expiry: '2024-06-30', status: 'valid' },
        { id: 3, amount: 10, type: '安装券', desc: '仅限灯具安装', expiry: '2024-05-01', status: 'expiring' },
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <PageHeader title="我的优惠券" rightAction={<button className="text-sm text-gray-600">使用说明</button>} />
            <div className="p-4 space-y-3">
                {coupons.map(c => (
                    <div key={c.id} className="bg-white rounded-xl flex overflow-hidden shadow-sm border border-gray-100 relative group active:scale-[0.99] transition-transform">
                        <div className={`w-24 flex flex-col items-center justify-center text-white p-2 relative overflow-hidden ${c.status === 'valid' ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-orange-400'}`}>
                             {/* Decorative circles for coupon style */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                            <span className="text-xs opacity-80 font-medium">¥</span>
                            <span className="text-3xl font-bold leading-none mb-1">{c.amount}</span>
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">{c.type}</span>
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between relative border-l border-dashed border-gray-200">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">{c.desc}</h3>
                                <p className="text-xs text-gray-400 mt-1">有效期至：{c.expiry}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">全平台通用</span>
                                <button className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${c.status === 'valid' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                    立即使用
                                </button>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -top-2 -left-1.5 w-3 h-3 bg-gray-50 rounded-full shadow-inner"></div>
                            <div className="absolute -bottom-2 -left-1.5 w-3 h-3 bg-gray-50 rounded-full shadow-inner"></div>
                        </div>
                    </div>
                ))}
                <button className="w-full py-3.5 bg-white text-gray-500 text-sm font-medium rounded-xl border border-dashed border-gray-300 mt-4 active:bg-gray-50 transition-colors">
                    + 兑换优惠码
                </button>
            </div>
        </div>
    );
};

// --- Benefits Page ---
export const UserBenefits = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-900 pb-safe">
            <PageHeader title="权益中心" rightAction={<span className="text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded-full">Lv.3</span>} />
            <div className="p-4">
                <div className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 rounded-2xl p-6 h-48 relative overflow-hidden text-amber-900 mb-8 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.4)]">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">GOLD VIP</h2>
                                <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">Premium Member</p>
                            </div>
                            <Ticket size={32} className="opacity-60 rotate-12"/>
                        </div>
                        <div className="mt-14 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] opacity-70 font-bold mb-0.5">MEMBER ID</p>
                                <p className="font-mono font-bold text-lg tracking-widest">9527 8888</p>
                            </div>
                            <span className="text-xs font-bold bg-white/30 px-2 py-1 rounded backdrop-blur-sm">有效期至 2025.10</span>
                        </div>
                    </div>
                    {/* Abstract Pattern */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white mix-blend-overlay opacity-30 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -top-10 w-32 h-32 bg-yellow-100 mix-blend-overlay opacity-30 rounded-full blur-2xl"></div>
                </div>

                <h3 className="text-white font-bold mb-4 text-lg flex items-center"><Gift size={18} className="mr-2 text-yellow-400"/> 会员特权</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { title: '优先派单', desc: '高峰期订单优先响应', icon: CheckCircle, color: 'text-yellow-400' },
                        { title: '免上门费', desc: '每月享受2次免费上门', icon: MapPin, color: 'text-blue-400' },
                        { title: '专属客服', desc: '24小时VIP专线接入', icon: Shield, color: 'text-green-400' },
                        { title: '延保服务', desc: '维修质保期延长至1年', icon: Lock, color: 'text-purple-400' }
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-colors">
                            <div className={`w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center mb-3 ${item.color}`}>
                                <item.icon size={20}/>
                            </div>
                            <h4 className="text-gray-100 font-bold text-sm">{item.title}</h4>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Addresses Page ---
export const UserAddresses = () => {
    const { updateUserLocation } = useApp();
    const navigate = useNavigate();
    const history = { goBack: () => navigate(-1) }; // shim for convenience
    
    // Mock Data
    const addresses = [
        { id: 1, tag: '家', address: '上海市 · 黄浦区南京东路 123 号', detail: '6号楼 1203室', name: '李女士', phone: '138****8000', default: true },
        { id: 2, tag: '公司', address: '上海市 · 静安区静安寺 88 号', detail: 'A座 前台', name: '李经理', phone: '138****8000', default: false }
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-24">
            <PageHeader title="地址簿" />
            <div className="p-4 space-y-3">
                {addresses.map(addr => (
                    <div key={addr.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group active:scale-[0.99] transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                                <div className={`px-2 py-0.5 rounded text-xs font-bold ${addr.tag === '家' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {addr.tag}
                                </div>
                                {addr.default && <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] rounded border border-red-100">默认</span>}
                            </div>
                            <div className="flex space-x-1">
                                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"><Edit2 size={16}/></button>
                                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <div className="mb-3">
                             <p className="text-gray-800 font-bold text-base leading-snug">{addr.address}</p>
                             <p className="text-gray-500 text-sm mt-0.5">{addr.detail}</p>
                        </div>
                        <div className="text-sm text-gray-600 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-700">{addr.name}</span>
                                <span className="font-mono">{addr.phone}</span>
                            </div>
                            <button 
                                onClick={() => {
                                    updateUserLocation({lat: 0, lng: 0, address: addr.address});
                                    history.goBack();
                                }} 
                                className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded hover:bg-green-100"
                            >
                                设为当前
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-white border-t safe-area-bottom z-20">
                <button className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex justify-center items-center active:scale-95 transition-transform hover:bg-green-700">
                    <Plus size={20} className="mr-2"/> 新增地址
                </button>
            </div>
        </div>
    );
};

// --- Referral Page ---
export const UserReferral = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = React.useState(false);
    const code = "AN8888";

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-red-500 pb-safe">
             {/* Header Transparent */}
            <div className="p-4 sticky top-0 z-20">
                <div className="flex items-center space-x-3 text-white">
                    <button onClick={() => navigate(-1)} className="bg-black/20 p-2 rounded-full backdrop-blur-md active:bg-black/30"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-bold drop-shadow-md">推荐有奖</h1>
                </div>
            </div>
            
            <div className="px-4 pb-10 relative z-10">
                <div className="text-center text-white mb-8 mt-2">
                    <div className="inline-block bg-red-700/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-red-100 mb-2 border border-red-400/30">邀请好友得现金</div>
                    <h2 className="text-4xl font-black mb-2 text-yellow-300 drop-shadow-[0_2px_0_rgba(185,28,28,1)] leading-tight">
                        好友首单立减<br/><span className="text-6xl">20</span>元
                    </h2>
                    <p className="text-white/90 font-medium mt-2">您可获得30元现金奖励，多邀多得</p>
                </div>

                <div className="bg-white rounded-3xl p-1 shadow-2xl mx-2 mb-8">
                    <div className="bg-gradient-to-b from-white to-orange-50 rounded-[1.3rem] p-6 text-center border border-dashed border-orange-200">
                        <p className="text-gray-500 text-sm mb-4 font-bold uppercase tracking-wider">您的专属邀请码</p>
                        <div onClick={handleCopy} className="text-4xl font-black text-gray-800 tracking-widest mb-6 bg-white py-5 rounded-2xl border-2 border-gray-100 shadow-inner cursor-pointer active:scale-95 transition-transform select-all">
                            {code}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleCopy}
                                className={`py-3.5 rounded-xl font-bold flex items-center justify-center active:scale-95 transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                            >
                            {copied ? <CheckCircle size={18} className="mr-2"/> : <Copy size={18} className="mr-2"/>} 
                            {copied ? '已复制' : '复制口令'}
                            </button>
                            <button className="py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-red-500/40 active:scale-95 transition-transform hover:brightness-110">
                                <Share2 size={18} className="mr-2"/> 立即分享
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-red-900/20 backdrop-blur-md rounded-2xl p-5 text-white border border-white/10">
                    <h3 className="font-bold mb-4 text-center flex items-center justify-center text-red-100">
                        <span className="w-8 h-px bg-red-300/50 mr-3"></span>
                        我的战绩
                        <span className="w-8 h-px bg-red-300/50 ml-3"></span>
                    </h3>
                    <div className="flex justify-around text-center divide-x divide-red-300/20">
                        <div className="flex-1">
                            <p className="text-3xl font-black text-yellow-300 mb-1">0</p>
                            <p className="text-xs text-red-100 opacity-80">成功邀请(人)</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-3xl font-black text-yellow-300 mb-1">0.00</p>
                            <p className="text-xs text-red-100 opacity-80">累计收益(元)</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
};

// --- Security Page ---
export const UserSecurity = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <PageHeader title="账户与安全" />
            <div className="p-4 space-y-4">
                 <div className="flex items-center justify-center py-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                         <Shield size={40} className="text-green-600"/>
                    </div>
                 </div>
                 <p className="text-center text-gray-500 text-sm mb-4">您的账户安全评分：<span className="text-green-600 font-bold">95分</span></p>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button className="w-full p-4 border-b border-gray-50 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-3">
                                <Lock size={18}/>
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">登录密码</span>
                                <span className="text-[10px] text-gray-400">建议定期修改密码</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">
                            已设置 <ChevronRight size={14} className="ml-1"/>
                        </div>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <Smartphone size={18}/>
                            </div>
                             <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">手机号绑定</span>
                                <span className="text-[10px] text-gray-400">若手机号停用请及时更换</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            138****8000 <ChevronRight size={14} className="ml-1"/>
                        </div>
                    </button>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button className="w-full p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mr-3">
                                <CheckCircle size={18}/>
                            </div>
                             <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">实名认证</span>
                                <span className="text-[10px] text-gray-400">保障账户归属权</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mr-1">已认证</span> <ChevronRight size={14}/>
                        </div>
                    </button>
                </div>
                
                <div className="pt-4">
                    <button className="w-full py-4 bg-white text-gray-400 text-xs rounded-xl border border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                         <AlertCircle size={14}/> 注销账号
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Settings Page ---
export const UserSettings = () => {
    const navigate = useNavigate();
    const { logout } = useApp();
    const [notify, setNotify] = useState(true);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <PageHeader title="设置" />
            <div className="p-4 space-y-4">
                {/* Account */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                     <button onClick={() => navigate('/user/security')} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <span className="text-sm font-bold text-gray-700">账户与安全</span>
                        <ChevronRight size={16} className="text-gray-300"/>
                    </button>
                    <button onClick={() => navigate('/user/addresses')} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-bold text-gray-700">地址管理</span>
                        <ChevronRight size={16} className="text-gray-300"/>
                    </button>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">消息通知</span>
                        <div 
                            onClick={() => setNotify(!notify)}
                            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notify ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notify ? 'left-5' : 'left-1'}`}></div>
                        </div>
                    </div>
                     <button onClick={() => alert("缓存已清除")} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <span className="text-sm font-bold text-gray-700">清除缓存</span>
                        <span className="text-xs text-gray-400">32.6MB</span>
                    </button>
                     <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-bold text-gray-700">关于安电通</span>
                        <span className="text-xs text-gray-400">v1.0.0</span>
                    </button>
                </div>

                {/* Logout */}
                <button 
                    onClick={() => {logout(); navigate('/');}}
                    className="w-full py-3.5 bg-white text-red-500 text-sm font-bold rounded-xl border border-gray-200 shadow-sm active:bg-gray-50 mt-4"
                >
                    退出登录
                </button>
            </div>
        </div>
    );
};
