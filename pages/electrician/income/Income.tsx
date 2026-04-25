
import React, { useState } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Gift, Star, ChevronRight, Calendar, Filter, Download, CreditCard, Building2 } from 'lucide-react';

type IncomeType = 'service' | 'bonus' | 'reward';
type RecordType = 'income' | 'withdraw';

interface IncomeRecord {
  id: string;
  type: IncomeType;
  title: string;
  amount: number;
  date: string;
  time: string;
  orderId?: string;
}

interface WithdrawRecord {
  id: string;
  amount: number;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'rejected';
  arrivalDate: string;
}

export const Income = () => {
    const [activeTab, setActiveTab] = useState<'summary' | 'records' | 'withdraw'>('summary');
    const [recordFilter, setRecordFilter] = useState<'all' | IncomeType>('all');
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'custom'>('week');
    const [withdrawing, setWithdrawing] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState<'wechat' | 'bank'>('wechat');

    const incomeData = {
      totalEarnings: 15880.50,
      withdrawable: 3250.00,
      pendingSettlement: 680.00,
      todayIncome: 280.00,
      weekIncome: 1850.00,
      monthIncome: 6850.00,
    };

    const incomeBreakdown = {
      service: 14200.00,
      platformBonus: 1200.00,
      goodReviewReward: 480.50,
    };

    const mockIncomeRecords: IncomeRecord[] = [
      { id: 'r1', type: 'service', title: '电路急修服务', amount: 120.00, date: '今天', time: '14:30', orderId: 'ANDT-2026-0420-1001' },
      { id: 'r2', type: 'bonus', title: '平台活动奖励', amount: 50.00, date: '今天', time: '10:00', orderId: '' },
      { id: 'r3', type: 'reward', title: '好评奖励', amount: 10.00, date: '昨天', time: '18:20', orderId: 'ANDT-2026-0419-0892' },
      { id: 'r4', type: 'service', title: '开关安装服务', amount: 85.00, date: '昨天', time: '11:15', orderId: 'ANDT-2026-0419-0888' },
      { id: 'r5', type: 'service', title: '电路检测服务', amount: 150.00, date: '04-18', time: '16:45', orderId: 'ANDT-2026-0418-0856' },
      { id: 'r6', type: 'bonus', title: '新手任务奖励', amount: 100.00, date: '04-17', time: '09:00', orderId: '' },
      { id: 'r7', type: 'service', title: '插座更换服务', amount: 60.00, date: '04-16', time: '15:30', orderId: 'ANDT-2026-0416-0823' },
    ];

    const mockWithdrawRecords: WithdrawRecord[] = [
      { id: 'w1', amount: 500.00, date: '04-19', time: '09:30', status: 'completed', arrivalDate: '04-20' },
      { id: 'w2', amount: 300.00, date: '04-15', time: '14:20', status: 'completed', arrivalDate: '04-16' },
      { id: 'w3', amount: 800.00, date: '04-10', time: '10:00', status: 'completed', arrivalDate: '04-11' },
    ];

    const weeklyData = [
      { day: '一', amount: 280, active: false },
      { day: '二', amount: 350, active: false },
      { day: '三', amount: 220, active: false },
      { day: '四', amount: 420, active: false },
      { day: '五', amount: 580, active: false },
      { day: '六', amount: 320, active: false },
      { day: '日', amount: 180, active: true },
    ];

    const maxAmount = Math.max(...weeklyData.map(d => d.amount));

    const handleWithdraw = () => {
      if (!withdrawAmount || parseFloat(withdrawAmount) < 10) {
        alert('最低提现金额为10元');
        return;
      }
      if (parseFloat(withdrawAmount) > incomeData.withdrawable) {
        alert('可提现余额不足');
        return;
      }
      setWithdrawing(true);
      setTimeout(() => {
        setWithdrawing(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        alert(`提现申请已提交！\n金额：¥${withdrawAmount}\n到账方式：${withdrawMethod === 'wechat' ? '微信' : '银行卡'}\n预计到账：明日24点前`);
      }, 1500);
    };

    const getRecordIcon = (type: IncomeType) => {
      switch(type) {
        case 'service': return <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><ArrowUpRight size={18}/></div>;
        case 'bonus': return <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Gift size={18}/></div>;
        case 'reward': return <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Star size={18}/></div>;
      }
    };

    const getRecordLabel = (type: IncomeType) => {
      switch(type) {
        case 'service': return '服务收入';
        case 'bonus': return '平台奖励';
        case 'reward': return '好评奖励';
      }
    };

    const getStatusLabel = (status: WithdrawRecord['status']) => {
      switch(status) {
        case 'pending': return { label: '处理中', color: 'text-orange-600 bg-orange-50' };
        case 'completed': return { label: '已到账', color: 'text-green-600 bg-green-50' };
        case 'rejected': return { label: '已拒绝', color: 'text-red-600 bg-red-50' };
      }
    };

    const filteredRecords = recordFilter === 'all'
      ? mockIncomeRecords
      : mockIncomeRecords.filter(r => r.type === recordFilter);

    const ChartBar = ({ amount, label, active }: {amount: number, label: string, active?: boolean}) => {
      const height = (amount / maxAmount) * 100;
      return (
        <div className="flex flex-col items-center group">
            <div className="relative h-24 w-3 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-t-full transition-all duration-500 ${active ? 'bg-blue-600' : 'bg-blue-300'}`}
                  style={{ height: `${height}%` }}
                ></div>
            </div>
            <span className={`text-[10px] mt-2 ${active ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{label}</span>
        </div>
      );
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24">
             <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white px-6 pt-10 pb-20 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
                 <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
                 <div className="absolute -left-10 bottom-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>

                 <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="opacity-80 mb-1 text-sm font-medium flex items-center"><Wallet size={14} className="mr-1"/> 可提现 (元)</p>
                        <h1 className="text-4xl font-bold tracking-tight">¥{incomeData.withdrawable.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</h1>
                        <p className="text-xs opacity-60 mt-1">累计收入 ¥{incomeData.totalEarnings.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold active:bg-white/30 transition-colors"
                    >
                        提现
                    </button>
                 </div>
             </div>

             <div className="-mt-12 mx-4 bg-white rounded-2xl shadow-lg p-5 z-10 relative border border-gray-50">
                <div className="flex justify-around text-center mb-5">
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">今日收入</p>
                        <p className="font-bold text-lg text-green-600">+{incomeData.todayIncome}</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">本周收入</p>
                        <p className="font-bold text-lg text-gray-800">{incomeData.weekIncome}</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">待结算</p>
                        <p className="font-bold text-lg text-orange-500">{incomeData.pendingSettlement}</p>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-gray-500">近7日收入趋势</h3>
                        <div className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <TrendingUp size={10} className="mr-1"/> +12%
                        </div>
                    </div>
                    <div className="flex justify-between items-end h-32 px-2">
                        {weeklyData.map(d => (
                          <ChartBar key={d.day} amount={d.amount} label={d.day} active={d.active} />
                        ))}
                    </div>
                </div>
             </div>

             <div className="mt-4 mx-4">
               <div className="flex bg-gray-100 rounded-xl p-1">
                 {[
                   { key: 'summary', label: '收入概览' },
                   { key: 'records', label: '收入明细' },
                   { key: 'withdraw', label: '提现记录' },
                 ].map(tab => (
                   <button
                     key={tab.key}
                     onClick={() => setActiveTab(tab.key as any)}
                     className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                       activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                     }`}
                   >
                     {tab.label}
                   </button>
                 ))}
               </div>
             </div>

             {activeTab === 'summary' && (
               <div className="p-4 space-y-4">
                 <div className="bg-white rounded-2xl p-4 border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                     <ArrowUpRight size={16} className="mr-2 text-blue-600"/>收入构成
                   </h3>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                       <div className="flex items-center">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                           <ArrowUpRight size={14}/>
                         </div>
                         <span className="text-sm font-medium text-gray-700">服务收入</span>
                       </div>
                       <span className="font-bold text-blue-600">¥{incomeBreakdown.service.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                       <div className="flex items-center">
                         <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                           <Gift size={14}/>
                         </div>
                         <span className="text-sm font-medium text-gray-700">平台奖励</span>
                       </div>
                       <span className="font-bold text-purple-600">¥{incomeBreakdown.platformBonus.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                       <div className="flex items-center">
                         <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-2">
                           <Star size={14}/>
                         </div>
                         <span className="text-sm font-medium text-gray-700">好评奖励</span>
                       </div>
                       <span className="font-bold text-amber-600">¥{incomeBreakdown.goodReviewReward.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white rounded-2xl p-4 border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                     <Clock size={16} className="mr-2 text-gray-400"/>提现说明
                   </h3>
                   <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                     <p>• 提现采用 <span className="text-blue-600 font-bold">T+1</span> 到账模式，当日申请提现将于次日24点前到账</p>
                     <p>• 最低提现金额为 <span className="text-red-500 font-bold">10元</span></p>
                     <p>• 支持提现至绑定银行卡或微信账户</p>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'records' && (
               <div className="p-4 space-y-3">
                 <div className="flex gap-2 overflow-x-auto pb-2">
                   {[
                     { key: 'all', label: '全部' },
                     { key: 'service', label: '服务收入' },
                     { key: 'bonus', label: '平台奖励' },
                     { key: 'reward', label: '好评奖励' },
                   ].map(filter => (
                     <button
                       key={filter.key}
                       onClick={() => setRecordFilter(filter.key as any)}
                       className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                         recordFilter === filter.key
                           ? 'bg-blue-600 text-white'
                           : 'bg-white text-gray-500 border border-gray-200'
                       }`}
                     >
                       {filter.label}
                     </button>
                   ))}
                   <div className="ml-auto flex gap-1">
                     <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500">
                       <Calendar size={14}/>
                     </button>
                     <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500">
                       <Download size={14}/>
                     </button>
                   </div>
                 </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   {filteredRecords.map((record, idx) => (
                     <div key={record.id} className={`flex justify-between items-center p-4 ${idx !== filteredRecords.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                       <div className="flex items-center">
                         {getRecordIcon(record.type)}
                         <div className="ml-3">
                           <p className="font-bold text-gray-800 text-sm">{record.title}</p>
                           <p className="text-xs text-gray-400">{record.date} {record.time} {record.orderId && `• ${record.orderId}`}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="font-bold text-green-600">+{record.amount.toFixed(2)}</span>
                         <p className="text-[10px] text-gray-400">{getRecordLabel(record.type)}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'withdraw' && (
               <div className="p-4 space-y-3">
                 <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-100">
                   <div className="flex justify-between items-center">
                     <div>
                       <p className="text-xs text-gray-500 mb-1">可提现金额</p>
                       <p className="text-2xl font-bold text-green-600">¥{incomeData.withdrawable.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
                     </div>
                     <button
                       onClick={() => setShowWithdrawModal(true)}
                       className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
                     >
                       申请提现
                     </button>
                   </div>
                 </div>

                 <div className="bg-white rounded-2xl p-4 border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-3">提现记录</h3>
                   {mockWithdrawRecords.length === 0 ? (
                     <div className="text-center py-8 text-gray-400">
                       <ArrowDownRight size={32} className="mx-auto mb-2 opacity-50"/>
                       <p className="text-sm">暂无提现记录</p>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       {mockWithdrawRecords.map((record, idx) => {
                         const status = getStatusLabel(record.status);
                         return (
                           <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                             <div>
                               <p className="font-bold text-gray-800">-{record.amount.toFixed(2)}</p>
                               <p className="text-xs text-gray-400">{record.date} {record.time}</p>
                             </div>
                             <div className="text-right">
                               <span className={`text-xs px-2 py-1 rounded-full font-bold ${status.color}`}>{status.label}</span>
                               {record.status === 'completed' && (
                                 <p className="text-[10px] text-gray-400 mt-1">已到账 {record.arrivalDate}</p>
                               )}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>
               </div>
             )}

             {showWithdrawModal && (
               <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowWithdrawModal(false)}>
                 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                 <div
                   className="relative bg-white w-full max-w-md rounded-t-3xl p-6"
                   onClick={e => e.stopPropagation()}
                 >
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-gray-800">申请提现</h2>
                     <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                       <ArrowDownRight size={20} className="text-gray-500"/>
                     </button>
                   </div>

                   <div className="mb-4">
                     <p className="text-xs text-gray-400 mb-2">可提现金额</p>
                     <p className="text-2xl font-bold text-green-600">¥{incomeData.withdrawable.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
                   </div>

                   <div className="mb-4">
                     <p className="text-xs text-gray-400 mb-2">提现金额</p>
                     <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-gray-200">
                       <span className="text-xl font-bold text-gray-500 mr-2">¥</span>
                       <input
                         type="number"
                         value={withdrawAmount}
                         onChange={(e) => setWithdrawAmount(e.target.value)}
                         placeholder="最低10元"
                         className="flex-1 bg-transparent outline-none text-xl font-bold"
                       />
                     </div>
                   </div>

                   <div className="mb-6">
                     <p className="text-xs text-gray-400 mb-2">到账方式</p>
                     <div className="flex gap-2">
                       <button
                         onClick={() => setWithdrawMethod('wechat')}
                         className={`flex-1 p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                           withdrawMethod === 'wechat'
                             ? 'border-green-500 bg-green-50 text-green-600'
                             : 'border-gray-200 text-gray-500'
                         }`}
                       >
                         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.022-.406-.022z"/></svg>
                         微信
                       </button>
                       <button
                         onClick={() => setWithdrawMethod('bank')}
                         className={`flex-1 p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                           withdrawMethod === 'bank'
                             ? 'border-green-500 bg-green-50 text-green-600'
                             : 'border-gray-200 text-gray-500'
                         }`}
                       >
                         <Building2 size={18}/>
                         银行卡
                       </button>
                     </div>
                   </div>

                   <div className="bg-amber-50 rounded-xl p-3 mb-6">
                     <p className="text-xs text-amber-700">提现将于次日24点前到账，最低提现金额10元</p>
                   </div>

                   <button
                     onClick={handleWithdraw}
                     disabled={withdrawing || !withdrawAmount}
                     className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 active:scale-[0.98] transition-all"
                   >
                     {withdrawing ? '处理中...' : '确认提现'}
                   </button>
                 </div>
               </div>
             )}
        </div>
    )
}
