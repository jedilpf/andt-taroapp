
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Info, ChevronRight, CheckCircle2, Gift, Wrench, Lightbulb, Clock, PenTool, Minus, Plus, Tag } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

export const InstallPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [selectedService, setSelectedService] = useState<string>('灯具安装');
    
    const services = [
        { id: 'light', name: '灯具安装', desc: '含打孔固定、线路连接、功能调试', subsidy: '社区补贴 50%' },
        { id: 'switch', name: '开关插座', desc: '老旧面板替换，排除火灾风险', subsidy: '多买多减' },
        { id: 'bath', name: '卫浴接线', desc: '浴霸、暖风机专业防水布线', subsidy: '安全保障' },
        { id: 'smart', name: '智能面板', desc: '无需改线，快速升级全屋智控', subsidy: '方案设计' },
    ];

    const handleBooking = () => {
        if (!currentUser) return;
        createOrder({
            type: 'Install',
            title: `便民安装 - ${selectedService}`,
            description: `【服务项目】: ${selectedService}\n请师傅上门进行现场测量并提供安装服务。`,
            priceEstimate: { min: 20, max: 60 },
            location: currentUser.location,
            status: OrderStatus.PENDING,
            scheduledTime: '尽快'
        });
        navigate('/user/orders');
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-[#F8FAFC]">
            <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-black text-gray-800">便民惠民安装</h1>
                </div>
                <div className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold border border-green-100">
                    <ShieldCheck size={12} className="mr-1"/> 平台质保 90 天
                </div>
            </div>

            <div className="p-4 space-y-6 pb-32">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 font-bold">COMMUNITY SERVICE</span>
                        <h2 className="text-3xl font-black mt-3 mb-2">明码标价 · 惠民补贴</h2>
                        <p className="opacity-80 text-xs font-medium">拒绝乱收费，由社区集采物资与服务，价格更公道</p>
                    </div>
                    <Wrench size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12" />
                </div>

                <div>
                    <h3 className="font-black text-slate-800 text-base mb-4 flex items-center">
                        <Tag size={18} className="mr-2 text-blue-600"/> 选安装服务
                    </h3>
                    <div className="space-y-3">
                        {services.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedService(s.name)}
                                className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all border-2 ${selectedService === s.name ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-white bg-white hover:border-slate-100'}`}
                            >
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex items-center mb-1">
                                        <span className={`font-black text-base ${selectedService === s.name ? 'text-blue-700' : 'text-slate-800'}`}>{s.name}</span>
                                        <span className="ml-2 bg-red-100 text-red-600 text-[8px] px-1.5 py-0.5 rounded-md font-black">{s.subsidy}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium truncate">{s.desc}</p>
                                </div>
                                <div className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedService === s.name ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-white'}`}>
                                    {selectedService === s.name && <CheckCircle2 size={16} className="text-white"/>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-orange-50 p-5 rounded-[2rem] border border-orange-100 flex items-start space-x-3">
                    <Info size={20} className="text-orange-500 mt-0.5 shrink-0"/>
                    <div className="text-xs text-orange-700 leading-relaxed font-bold">
                        温馨提示：预约后师傅将主动联系。若需代购材料，请在电话中告知。平台认证师傅严格执行官方公示价格，不乱收额外费用。
                    </div>
                </div>
            </div>
                
            <div className="fixed bottom-0 left-0 w-full bg-white p-6 pb-safe border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
                <button 
                    onClick={handleBooking}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-transform"
                >
                    确认预约师傅上门
                </button>
            </div>
        </div>
    )
}
