
import React, { useState } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

export const Income = () => {
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => {
            setWithdrawing(false);
            alert("提现申请已提交！");
        }, 1500);
    };

    // Simple CSS Bar Chart
    const ChartBar = ({ height, label, active }: {height: string, label: string, active?: boolean}) => (
        <div className="flex flex-col items-center group">
            <div className="relative h-24 w-3 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className={`w-full rounded-t-full transition-all duration-500 ${active ? 'bg-blue-600' : 'bg-blue-300'}`} style={{ height }}></div>
            </div>
            <span className={`text-[10px] mt-2 ${active ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24">
             <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white px-6 pt-10 pb-24 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
                 <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
                 <div className="absolute -left-10 bottom-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="opacity-80 mb-1 text-sm font-medium flex items-center"><Wallet size={14} className="mr-1"/> 账户余额 (元)</p>
                        <h1 className="text-5xl font-bold tracking-tight">1,250.00</h1>
                    </div>
                    <button 
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold active:bg-white/30 transition-colors disabled:opacity-50"
                    >
                        {withdrawing ? '处理中...' : '提现'}
                    </button>
                 </div>
            </div>

            <div className="-mt-12 mx-4 bg-white rounded-2xl shadow-lg p-6 z-10 relative border border-gray-50">
                <div className="flex justify-around text-center mb-6">
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">今日收入</p>
                        <p className="font-bold text-xl text-green-600">+120</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">本周收入</p>
                        <p className="font-bold text-xl text-gray-800">450</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">待结算</p>
                        <p className="font-bold text-xl text-orange-500">80</p>
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
                        <ChartBar height="30%" label="一" />
                        <ChartBar height="45%" label="二" />
                        <ChartBar height="25%" label="三" />
                        <ChartBar height="60%" label="四" />
                        <ChartBar height="80%" label="五" />
                        <ChartBar height="40%" label="六" />
                        <ChartBar height="90%" label="日" active />
                    </div>
                </div>
            </div>

            <div className="p-5 mt-2">
                <h3 className="font-bold text-gray-800 mb-3 text-lg">流水明细</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 font-bold">收</div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">上门维修服务</p>
                                    <p className="text-xs text-gray-400">今日 10:00 • 订单完成</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-800 text-lg">+80.00</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
