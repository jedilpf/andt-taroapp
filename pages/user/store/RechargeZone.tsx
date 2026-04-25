import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    ChevronLeft, MoreHorizontal, User, Smartphone,
    Wifi, Globe, Gift, ChevronRight, Zap, CreditCard,
    Ticket, Crown, History, Loader2, CheckCircle2, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

const RechargeZone = () => {
    const navigate = useNavigate();
    const { currentUser, createOrder, earnPoints } = useApp();
    const [activeTab, setActiveTab] = useState<'phone' | 'data' | 'broadband'>('phone');
    const [amount, setAmount] = useState<number | null>(null);

    // Payment Flow State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [payState, setPayState] = useState<'none' | 'processing' | 'success'>('none');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Mock Data
    const phoneData = [
        { val: 50, tag: '中国移动提供', desc: '50元话费' },
        { val: 100, tag: '售价100元', desc: '100元话费' },
        { val: 200, tag: '售价200元', desc: '200元话费' },
        { val: 300, tag: '售价300元', desc: '300元话费' },
        { val: 10, tag: '限时专享', desc: '10元话费券', custom: true, price: 0.1 },
        { val: 0, tag: '移动免费领取', text: '至高百元话费', desc: '抽奖活动' }
    ];

    const dataPackageData = [
        { val: 20, tag: '7天有效', desc: '10GB 通用流量', price: 9.9 },
        { val: 50, tag: '月包', desc: '30GB 通用流量', price: 29.9 },
        { val: 100, tag: '季度包', desc: '100GB 通用流量', price: 88 },
        { val: 15, tag: '日包', desc: '5GB 极速流量', price: 5 },
        { val: 30, tag: '视频定向', desc: '30GB 视频流量', price: 15 },
        { val: 60, tag: '游戏加速', desc: '游戏专属流量包', price: 19.9 }
    ];

    const broadbandData = [
        { val: 200, tag: '一年期', desc: '200M 宽带包年', price: 360 },
        { val: 500, tag: '一年期', desc: '500M 宽带包年', price: 600 },
        { val: 1000, tag: '一年期', desc: '1000M 极速宽带', price: 999 },
        { val: 100, tag: '合约', desc: '100M 免费提速', price: 0 },
        { val: 0, tag: '预约', desc: '新装宽带预约', price: 0 },
        { val: 0, tag: '报修', desc: '宽带故障报修', price: 0 }
    ];

    const getCurrentData = () => {
        if (activeTab === 'phone') return phoneData;
        if (activeTab === 'data') return dataPackageData;
        return broadbandData;
    };

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        if (item.val === 0 && item.text?.includes('免费领取')) {
            // Mock External Link behavior
            return;
        }
        setAmount(item.val);
        setIsPaymentModalOpen(true);
    };

    const handlePay = () => {
        setIsPaymentModalOpen(false);
        setPayState('processing');

        setTimeout(() => {
            if (currentUser && selectedItem) {
                const finalPrice = selectedItem.price !== undefined ? selectedItem.price : selectedItem.val;
                createOrder({
                    type: 'Bill',
                    title: `充值中心 - ${selectedItem.desc}`,
                    description: `为号码 187 6116 5911 充值`,
                    priceEstimate: { min: finalPrice, max: finalPrice, final: finalPrice },
                    location: currentUser.location,
                    status: OrderStatus.PAID,
                    scheduledTime: '即时到账',
                    items: [{ name: selectedItem.desc, qty: 1, price: finalPrice }],
                    pointsReward: Math.floor(finalPrice)
                });
                earnPoints(Math.floor(finalPrice));
            }
            setPayState('success');
            setTimeout(() => {
                setPayState('none');
                setSelectedItem(null);
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] pb-20">
            {/* Header Background */}
            <div className="bg-gradient-to-b from-blue-500 to-blue-400 h-48 relative rounded-b-[2rem]">

                {/* Custom Navbar */}
                <div className="pt-safe px-4 pb-2 flex items-center justify-between text-white relative z-10">
                    <button onClick={() => navigate(-1)} className="p-1 active:scale-90 transition-transform">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="font-bold text-lg flex items-center space-x-4">
                        <span className="relative">
                            手机充值
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>
                        </span>
                        <span className="text-blue-100 font-normal">会员充值</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs bg-red-500 rounded px-1 scale-90 origin-right">送话费</span>
                        <History size={20} />
                        <MoreHorizontal size={20} />
                    </div>
                </div>

                {/* Phone Card */}
                <div className="mx-4 mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white relative overflow-hidden border border-white/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="bg-blue-600/50 text-[10px] px-1.5 rounded">我的号码</span>
                            </div>
                            <div className="text-2xl font-black tracking-wider group flex items-center">
                                187 6116 5911
                                <span className="text-sm font-normal ml-2 opacity-80">江苏 移动</span>
                            </div>
                        </div>
                        <User className="opacity-80" />
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                {/* Sub Banner */}
                <div className="mx-4 mt-3 flex justify-between items-center text-[#8B4513] text-sm bg-gradient-to-r from-[#FFD700] to-[#FFE4B5] px-3 py-2 rounded-t-xl relative -mb-2 z-0">
                    <div className="flex items-center space-x-1 font-bold">
                        <Crown size={14} fill="currentColor" />
                        <span>充会员享购物补贴</span>
                    </div>
                    <div className="flex items-center text-xs">
                        至高优惠146元 <ChevronRight size={12} />
                    </div>
                </div>
            </div>

            {/* White Card Content */}
            <div className="mx-3 -mt-2 bg-white rounded-xl shadow-sm relative z-10 p-4 pb-6 transition-all min-h-[300px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 mb-4">
                    {[
                        { id: 'phone', label: '充话费' },
                        { id: 'data', label: '充流量' },
                        { id: 'broadband', label: '办宽带' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 pb-3 text-center text-base font-bold transition-colors relative ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Jingdou Checkbox */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                        <span className="text-xs text-slate-500">使用京豆抵扣充值，最高可抵0.12元</span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center">更多 <ChevronRight size={10} /></span>
                </div>

                {/* Dynamic Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in">
                    {getCurrentData().map((item, i) => (
                        <div
                            key={i}
                            onClick={() => handleItemClick(item)}
                            className={`
                                relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 cursor-pointer
                                ${amount === item.val ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-100 text-slate-800'}
                            `}
                        >
                            {item.custom ? (
                                <div className="text-center">
                                    <div className="font-black text-lg text-slate-900">- ¥ {item.val}</div>
                                    <div className="text-[10px] text-slate-400">{item.tag}</div>
                                    <div className="absolute -bottom-2 -right-2 transform rotate-12 bg-red-500 text-white text-[9px] px-1 rounded shadow-sm">Hot</div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    {activeTab === 'phone' ? (
                                        item.val === 0 ? (
                                            <>
                                                <div className="font-bold text-sm mb-1">{item.text}</div>
                                                <div className="text-[10px] text-slate-400">{item.tag}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="font-black text-xl mb-1">{item.val}元</div>
                                                <div className={`text-[10px] ${amount === item.val ? 'text-blue-400' : 'text-slate-400'}`}>{item.tag}</div>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <div className="font-black text-sm mb-1 line-clamp-1">{item.desc}</div>
                                            <div className="text-red-500 font-bold text-xs">¥{item.price}</div>
                                            <div className="text-[9px] text-slate-400 mt-0.5">{item.tag}</div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Special Badge */}
                            {item.val === 50 && activeTab === 'phone' && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] px-1 rounded-bl-lg rounded-tr-lg">
                                    热销
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Links */}
                <div className="flex items-center text-xs text-slate-400 space-x-3 mb-4">
                    <span>订单</span>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <span>帮助</span>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <span className="flex items-center text-red-500 font-bold"><Zap size={12} fill="currentColor" className="mr-1" />自动充值</span>
                </div>
            </div>

            {/* Banner Scroll */}
            <div className="mx-3 mt-3 bg-[#FFF5EE] rounded-xl p-3 flex justify-center items-center text-[#FF4500] font-bold text-sm shadow-sm space-x-2 active:scale-95 transition-transform">
                <Ticket size={16} /> <span>天天抽盲盒</span> <ChevronRight size={14} />
            </div>

            {/* Bottom Cards */}
            <div className="mx-3 mt-3 flex space-x-3 overflow-x-auto no-scrollbar pb- safe">
                <div className="flex-1 min-w-[130px] bg-white rounded-xl p-3">
                    <h4 className="font-bold text-slate-900 text-sm">10GB通用流量</h4>
                    <p className="text-[10px] text-slate-400 mb-2">5G致享服务</p>
                    <span className="bg-red-50 text-red-500 text-[10px] px-1 rounded">20元/月</span>
                </div>
                <div className="flex-1 min-w-[130px] bg-white rounded-xl p-3">
                    <h4 className="font-bold text-slate-900 text-sm">宽带免费预约</h4>
                    <p className="text-[10px] text-slate-400 mb-2">月租低至0元</p>
                    <Wifi size={24} className="text-blue-500 opacity-50 ml-auto" />
                </div>
                <div className="flex-1 min-w-[130px] bg-white rounded-xl p-3">
                    <h4 className="font-bold text-slate-900 text-sm">15GB 视频随心看</h4>
                    <p className="text-[10px] text-slate-400 mb-2">送视频会员N选1</p>
                    <span className="bg-red-50 text-red-500 text-[10px] px-1 rounded">19.9元/月</span>
                </div>
            </div>


            {/* Bottom Nav Area (Mock) */}
            <div className="fixed bottom-0 w-full bg-white border-t p-2 flex justify-around text-[10px] text-slate-500 pb-safe z-50">
                <div className="flex flex-col items-center text-orange-500 font-bold">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mb-1"><Zap size={14} fill="currentColor" /></div>
                    充值中心
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mb-1"><Gift size={16} /></div>
                    赚话费
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && selectedItem && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsPaymentModalOpen(false)}></div>
                    <div className="w-full bg-white rounded-t-[2rem] p-6 pb-safe animate-slide-up relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">确认付款</h3>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="flex items-center justify-center mb-8">
                            <span className="text-2xl font-bold mr-1">¥</span>
                            <span className="text-5xl font-black">{selectedItem.price !== undefined ? selectedItem.price : selectedItem.val}</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                <span className="text-slate-500">充值号码</span>
                                <span className="text-slate-900 font-bold text-lg">187 6116 5911</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                <span className="text-slate-500">充值内容</span>
                                <span className="text-slate-900 font-bold">{selectedItem.desc}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">支付方式</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 bg-[#07C160] rounded-full flex items-center justify-center text-white text-[12px]">微</div>
                                    <span className="text-slate-900 font-bold">微信支付</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            className="w-full py-4 bg-[#07C160] text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
                        >
                            立即支付
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Processing/Success State */}
            {payState !== 'none' && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl flex flex-col items-center animate-scale-in shadow-2xl min-w-[200px]">
                        {payState === 'processing' ? (
                            <>
                                <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                                <h4 className="text-lg font-bold text-slate-800">支付处理中...</h4>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500 animate-bounce">
                                    <CheckCircle2 size={32} strokeWidth={3} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">充值成功</h4>
                                <p className="text-slate-400 text-sm mt-1">预计10分钟内到账</p>
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RechargeZone;
