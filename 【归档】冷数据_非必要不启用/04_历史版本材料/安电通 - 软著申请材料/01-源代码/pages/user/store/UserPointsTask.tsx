
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, CheckCircle, Star, Gift, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const UserPointsTask = () => {
    const navigate = useNavigate();
    const { currentUser, earnPoints } = useApp();
    const [signed, setSigned] = useState(false);

    const handleCheckIn = () => {
        if (signed) return;
        setSigned(true);
        earnPoints(10);
        alert('签到成功，获得 10 积分！');
    };

    const tasks = [
        { title: '完成首单报修', points: 1000, status: '去完成', icon: Star, color: 'text-amber-500 bg-amber-50' },
        { title: '参与社区公益排查', points: 500, status: '去报名', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
        { title: '分享商城给邻居', points: 50, status: '去分享', icon: Gift, color: 'text-rose-500 bg-rose-50' },
        { title: '学习安全知识3分钟', points: 20, status: '去学习', icon: Clock, color: 'text-blue-500 bg-blue-50' },
    ];

    return (
        <div className="h-full bg-[#F5F5F5] flex flex-col">
            <div className="bg-gradient-to-br from-amber-400 to-orange-600 pb-16 pt-10 px-6 rounded-b-[3rem] relative overflow-hidden shadow-xl text-white">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-white/10 mb-6 active:scale-95"><ArrowLeft size={24}/></button>
                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <p className="text-white/70 text-xs font-black mb-1 uppercase tracking-widest">Available Points</p>
                        <h2 className="text-6xl font-black tracking-tighter flex items-baseline">
                            {currentUser?.points || 0} <span className="text-xl ml-2 opacity-60">pts</span>
                        </h2>
                    </div>
                    <button 
                        onClick={handleCheckIn}
                        disabled={signed}
                        className={`px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all ${signed ? 'bg-white/20 text-white/50' : 'bg-white text-orange-600 active:scale-95'}`}
                    >
                        {signed ? '今日已签' : '立即签到'}
                    </button>
                </div>
                <Coins size={180} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-6 pb-10">
                {/* 任务列表 */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-orange-50">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                        <Sparkles size={20} className="text-amber-500 mr-2" /> 任务赚积分
                    </h3>
                    <div className="space-y-4">
                        {tasks.map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.color}`}><task.icon size={24}/></div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{task.title}</p>
                                        <p className="text-xs font-bold text-amber-600">+{task.points} 积分</p>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-800 text-[10px] font-black rounded-full shadow-sm active:scale-95">{task.status}</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 积分兑换入口 */}
                <div 
                    onClick={() => navigate('/user/points-mall')}
                    className="bg-[#0F172A] p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <h4 className="text-xl font-black text-[#FFD101]">积分抵费专区</h4>
                        <p className="text-xs opacity-60 mt-1">积分抵扣物业费、水电费</p>
                    </div>
                    <ChevronRight size={24} className="text-[#FFD101] relative z-10" />
                    <Coins size={80} className="absolute -right-4 -bottom-4 opacity-5" />
                </div>
            </div>
        </div>
    );
};
