
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, CheckCircle, MapPin, Shield, Lock, Gift } from 'lucide-react';

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
                            <span className="text-xs font-bold bg-white/30 px-2 py-1 rounded backdrop-blur-sm">有效期至 2027.11.26</span>
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
