
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, ChevronRight, Plus, CreditCard, History, ArrowUpRight, ArrowDownLeft, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const UserIncome = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const [activeTab, setActiveTab] = useState('全部');

    const rechargePlans = [
        { amount: 50, extra: 0 },
        { amount: 100, extra: 5, tag: '热销' },
        { amount: 200, extra: 15, tag: '超值' },
        { amount: 500, extra: 50, tag: '尊享' },
    ];

    const mockTransactions = [
        { id: 1, title: '商城消费 - 施耐德断路器', amount: -42.5, time: '今天 14:20', type: 'expense', icon: ArrowUpRight },
        { id: 2, title: '微信充值', amount: 100, time: '昨天 09:15', type: 'income', icon: ArrowDownLeft },
        { id: 3, title: '积分兑换余额', amount: 50, time: '2024-11-24', type: 'income', icon: History },
        { id: 4, title: '商城消费 - 智利车厘子', amount: -39.9, time: '2024-11-23', type: 'expense', icon: ArrowUpRight },
    ];

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 pt-4 pb-4 shrink-0 z-20 shadow-sm border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">我的钱包</h1>
                </div>
                <button className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">常见问题</button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 pb-24">
                {/* 1. 总览卡片 */}
                <div className="bg-[#1E293B] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Available Balance</p>
                        <div className="flex items-baseline mb-8">
                            <span className="text-2xl font-black mr-2 text-slate-400">¥</span>
                            <h2 className="text-6xl font-black tracking-tighter">{currentUser?.balance.toFixed(2)}</h2>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-fit">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-slate-300">资金受太平洋保险承保安全保障</span>
                        </div>
                    </div>
                    <Wallet size={150} className="absolute -right-8 -bottom-8 opacity-5 rotate-12" />
                </div>

                {/* 2. 充值专区 */}
                <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-4">余额充值</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {rechargePlans.map((plan, i) => (
                            <button key={i} className="bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-blue-500 transition-all active:scale-[0.98] shadow-sm relative group">
                                {plan.tag && <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md">{plan.tag}</span>}
                                <div className="text-left">
                                    <p className="text-2xl font-black text-slate-800">¥{plan.amount}</p>
                                    <p className="text-[10px] text-blue-600 font-bold mt-1">{plan.extra > 0 ? `赠送 ¥${plan.extra}` : '即冲即用'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-sm active:bg-slate-50 transition-colors flex items-center justify-center">
                        <Plus size={16} className="mr-1"/> 自定义金额
                    </button>
                </div>

                {/* 3. 交易明细 */}
                <div>
                    <div className="flex items-center justify-between px-1 mb-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">交易记录</h3>
                        <div className="flex space-x-4">
                            {['全部', '充值', '消费'].map(t => (
                                <button key={t} onClick={() => setActiveTab(t)} className={`text-[11px] font-black ${activeTab === t ? 'text-blue-600' : 'text-slate-300'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 divide-y divide-slate-50">
                        {mockTransactions.map(trans => (
                            <div key={trans.id} className="p-5 flex items-center justify-between active:bg-slate-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trans.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <trans.icon size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-black text-slate-800 truncate">{trans.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{trans.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-base font-black ${trans.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        {trans.type === 'income' ? '+' : ''}{trans.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100 flex items-start space-x-3 opacity-60">
                    <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
                        余额仅限在安电通平台内消费使用（包含报修支付、商城购物、服务抵扣）。余额不支持转账，如需提现请联系平台客服处理。
                    </p>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 pb-safe z-30">
                <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center">
                    <CreditCard size={20} className="mr-2"/> 立即充值
                </button>
            </div>
        </div>
    );
};
