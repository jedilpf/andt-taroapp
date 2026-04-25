
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, ChevronRight, Info, PlusCircle, ShoppingBag, Wrench, Zap, Gift } from 'lucide-react';

export const UserCouponWallet = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState('valid');

    // 找回截图中的虚拟券资产
    const mockCoupons = [
        { id: '1', amount: 15, title: '全场报修直减券', type: 'service', expiry: '2024-12-31', status: 'valid', desc: '全场电路报修服务通用', color: 'from-orange-500 to-red-600' },
        { id: '2', amount: 15, title: '灯具安装专项补贴', type: 'service', expiry: '2024-12-25', status: 'valid', desc: '仅限灯具/开关安装目使用', color: 'from-blue-500 to-indigo-600' },
        { id: '3', amount: 12, title: '耗材满减券', type: 'store', expiry: '2024-12-20', status: 'valid', desc: '便民驿站实物购买满99可用', color: 'from-red-500 to-pink-600' },
        { id: '4', amount: 10, title: '新居检测体验券', type: 'service', expiry: '2024-12-15', status: 'valid', desc: '全屋安全大排查专项使用', color: 'from-emerald-500 to-teal-600' },
    ];

    return (
        <div className="h-full w-full bg-[#F5F5F5] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 pt-10 pb-4 shadow-sm z-10 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-all">
                        <ArrowLeft size={24} strokeWidth={2.5}/>
                    </button>
                    <h1 className="text-lg font-black text-gray-900">红包卡券</h1>
                    <button className="text-xs text-gray-400 font-bold">规则</button>
                </div>
                <div className="flex space-x-10 px-4">
                    {['可使用', '已使用', '已过期'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveStatus(tab === '可使用' ? 'valid' : 'other')}
                            className={`pb-2 text-sm font-black relative transition-all ${
                                (activeStatus === 'valid' && tab === '可使用') || (activeStatus !== 'valid' && tab !== '可使用') 
                                ? 'text-red-500' : 'text-gray-400'
                            }`}
                        >
                            {tab}
                            {activeStatus === 'valid' && tab === '可使用' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar">
                {activeStatus === 'valid' ? mockCoupons.map(coupon => (
                    <div key={coupon.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex relative active:scale-[0.98] transition-all">
                        {/* 金额区 */}
                        <div className={`w-28 shrink-0 flex flex-col items-center justify-center text-white p-4 relative bg-gradient-to-br ${coupon.color}`}>
                            <div className="flex items-baseline font-black">
                                <span className="text-sm mr-0.5">¥</span>
                                <span className="text-4xl tracking-tighter">{coupon.amount}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase mt-1 opacity-80">{coupon.type === 'service' ? 'Service' : 'Mall'}</span>
                            <div className="absolute top-0 -right-2 w-4 h-4 bg-[#F5F5F5] rounded-full"></div>
                            <div className="absolute bottom-0 -right-2 w-4 h-4 bg-[#F5F5F5] rounded-full"></div>
                        </div>

                        {/* 信息区 */}
                        <div className="flex-1 p-4 flex flex-col justify-between border-l border-dashed border-gray-100">
                            <div>
                                <h3 className="font-black text-gray-900 text-sm leading-tight mb-1">{coupon.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">有效期至 {coupon.expiry}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-[9px] text-gray-400 font-bold truncate max-w-[120px]">{coupon.desc}</span>
                                <button className="px-4 py-1.5 bg-red-500 text-white rounded-full text-[10px] font-black shadow-md">立即使用</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center pt-20 opacity-30">
                        <Ticket size={64} className="text-gray-300"/>
                        <p className="mt-4 font-black text-gray-400">暂无记录</p>
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-20">
                <button 
                    onClick={() => navigate('/user/welfare')}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center group"
                >
                    <Gift size={22} className="mr-3 animate-bounce" />
                    去领更多福利
                </button>
            </div>
        </div>
    );
};
