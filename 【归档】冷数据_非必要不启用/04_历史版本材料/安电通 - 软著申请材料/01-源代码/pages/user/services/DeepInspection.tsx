
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Settings, Zap, ThermometerSun, SearchCheck, Loader2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

export const DeepInspectionPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [loading, setLoading] = useState(false);

    const handleBooking = () => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
             createOrder({
                type: 'Inspection',
                title: '全屋深度电路体检',
                description: '服务包含：总配电箱检测、全屋开关插座排查、大功率电器负载测试、线路绝缘性检测。',
                priceEstimate: { min: 199, max: 299 },
                scheduledTime: '待协商',
                location: currentUser.location,
                status: OrderStatus.PENDING
            });
            setLoading(false);
            navigate('/user/orders');
        }, 1500);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">深度体检</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                     <div className="relative z-10">
                         <h2 className="text-3xl font-bold mb-2">全屋电路体检</h2>
                         <p className="opacity-90 text-sm mb-6 max-w-[70%]">消除看不见的隐患，为家人的安全保驾护航。建议每年一次。</p>
                         <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                             <span className="text-2xl font-bold">¥199</span>
                             <span className="text-xs opacity-80 ml-1">/次 起</span>
                         </div>
                     </div>
                     <ShieldCheck size={160} className="absolute -bottom-10 -right-10 opacity-20 rotate-12"/>
                </div>

                {/* Service Details */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">服务内容</h3>
                    <div className="space-y-4">
                        {[
                            { icon: Settings, title: "配电箱深度检测", desc: "检查漏保动作电流、接线端子是否松动发热" },
                            { icon: Zap, title: "开关插座排查", desc: "检测全屋插座接地状态、极性是否正确" },
                            { icon: ThermometerSun, title: "线路负载与发热", desc: "使用热成像仪检测线路是否存在过载发热" },
                            { icon: SearchCheck, title: "绝缘电阻测试", desc: "检测老旧线路绝缘层老化程度，防止漏电" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <item.icon size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 pb-8">
                    <button 
                        onClick={handleBooking} 
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2"/> : '立即预约体检'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">此服务由平台认证的金牌电工提供，包含专业检测报告</p>
                </div>
            </div>
        </div>
    );
};
