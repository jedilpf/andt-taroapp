
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, TrendingUp, User, Target, ChevronRight, Bell, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';

export const ElecProfile = () => {
    const { currentUser, switchRole, messages } = useApp();
    const navigate = useNavigate();

    // Unread messages
    const unreadCount = messages.filter(m => !m.read).length;

    const MenuItem = ({ icon: Icon, color, label, onClick, subText }: any) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={18} className={color.replace('bg-', 'text-')}/>
                </div>
                <span className="text-sm font-bold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center text-gray-400">
                {subText && <span className="text-xs mr-2">{subText}</span>}
                <ChevronRight size={16} className="group-hover:text-gray-600"/>
            </div>
        </button>
    );

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24">
            <div className="bg-gradient-to-br from-blue-800 to-gray-900 text-white px-6 pt-12 pb-20 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                {/* Icons - Top Right */}
                <div className="absolute top-6 right-6 z-20 flex space-x-3">
                     <button 
                        onClick={() => navigate('/electrician/messages')}
                        className="p-2.5 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10 active:scale-95 relative"
                    >
                        <Bell size={20} className="text-white opacity-90"/>
                        {unreadCount > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900 animate-pulse"></div>}
                     </button>
                     <button onClick={() => navigate('/electrician/settings')} className="p-2.5 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10 active:scale-95">
                        <Settings size={20} className="text-white opacity-90"/>
                     </button>
                </div>

                <div className="flex items-center space-x-5 relative z-10 mt-4">
                    <div className="relative">
                        <img src={currentUser?.avatar} className="w-20 h-20 rounded-full border-4 border-white/20 bg-gray-800 object-cover" alt="Avatar"/>
                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                        <div className="flex items-center mt-1 space-x-2">
                             <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs rounded font-medium flex items-center">
                                 <Award size={10} className="mr-1"/> 金牌电工
                             </span>
                             <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded font-medium">工龄 5年</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-8 relative z-10 px-2 text-center">
                    <div className="flex-1">
                        <p className="text-2xl font-bold">4.9</p>
                        <p className="text-xs text-gray-400 mt-0.5">服务评分</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-2xl font-bold">582</p>
                        <p className="text-xs text-gray-400 mt-0.5">完成单量</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-2xl font-bold">100%</p>
                        <p className="text-xs text-gray-400 mt-0.5">好评率</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-10 relative z-10 space-y-4">
                {/* Real-name Verification Status Card */}
                <div onClick={() => navigate('/electrician/identity-verify')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentUser?.identityStatus === 'VERIFIED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {currentUser?.identityStatus === 'VERIFIED' ? <ShieldCheck size={20}/> : <UserCheck size={20}/>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">实名身份认证</p>
                            <p className="text-[10px] text-gray-400">保障合规接单及款项提取</p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${currentUser?.identityStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {currentUser?.identityStatus === 'VERIFIED' ? '已通过' : '去认证'}
                    </span>
                </div>

                {/* Menu Group 1 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <MenuItem 
                        icon={Award} 
                        color="text-blue-600 bg-blue-600" 
                        label="技能与证书" 
                        subText="已认证"
                        onClick={() => navigate('/electrician/skills')}
                    />
                    <MenuItem 
                        icon={Target} 
                        color="text-green-600 bg-green-600" 
                        label="服务区域设置" 
                        subText="5km"
                        onClick={() => navigate('/electrician/area')}
                    />
                     <MenuItem 
                        icon={TrendingUp} 
                        color="text-orange-600 bg-orange-600" 
                        label="接单数据统计" 
                        onClick={() => {}}
                    />
                </div>

                {/* Menu Group 2 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <MenuItem 
                        icon={User} 
                        color="text-purple-600 bg-purple-600" 
                        label="切换到业主版" 
                        onClick={() => {switchRole(UserRole.USER); navigate('/user/home');}}
                    />
                     <MenuItem 
                        icon={Settings} 
                        color="text-gray-600 bg-gray-600" 
                        label="更多设置" 
                        onClick={() => navigate('/electrician/settings')}
                    />
                </div>
            </div>
        </div>
    );
};
