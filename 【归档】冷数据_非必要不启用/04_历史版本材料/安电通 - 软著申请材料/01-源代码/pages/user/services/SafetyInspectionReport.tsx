
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Settings, Zap, SearchCheck, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

export const SafetyInspectionReport = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();

    // Enhanced Professional Mock Data
    const reportData = {
        totalScore: 78, // 家庭综合评分
        grade: 'B', // 评级
        hazardCount: 3,
        safetyLevel: '存在隐患', // 安全等级：极好、良好、存在隐患、危险
        inspector: "王师傅",
        inspectionTime: "2026-01-08 14:30",
        device: "FLUKE 1664FC",
        categories: [
            {
                name: "配电箱专项检测",
                items: [
                    { id: 101, title: '漏电保护动作电流', value: '45mA', standard: '≤30mA', status: 'FAIL', score: 0, desc: '动作值过高，无法有效保护人体触电', icon: Settings, color: 'text-red-600 bg-red-50' },
                    { id: 102, title: '漏电保护动作时间', value: '200ms', standard: '≤0.1s', status: 'FAIL', score: 0, desc: '跳闸延迟，存在安全风险', icon: Clock, color: 'text-red-600 bg-red-50' },
                    { id: 103, title: '接线端子紧固度', value: '松动', standard: '紧固', status: 'FAIL', score: 0, desc: '多处虚接，存在打火隐患', icon: SearchCheck, color: 'text-yellow-600 bg-yellow-50' },
                ]
            },
            {
                name: "线路绝缘与负载检测",
                items: [
                    { id: 201, title: 'L-N 绝缘电阻', value: '550MΩ', standard: '≥0.5MΩ', status: 'PASS', score: 100, desc: '线路绝缘性能良好', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 202, title: '大功率回路负载', value: '18A', standard: '<20A', status: 'PASS', score: 90, desc: '负载正常，温升在允许范围内', icon: Zap, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 203, title: '线路老化程度', value: '轻微', standard: '无老化', status: 'WARN', score: 80, desc: '外皮轻微硬化，建议定期观察', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
                ]
            },
            {
                name: "终端设施检测",
                items: [
                    { id: 301, title: '插座极性检测', value: '正确', standard: '左零右火', status: 'PASS', score: 100, desc: '全屋插座极性接线正确', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 302, title: '厨卫插座接地', value: '0.8Ω', standard: '≤4Ω', status: 'PASS', score: 100, desc: '接地电阻符合国家标准', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
                ]
            }
        ]
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 80) return 'text-blue-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="h-full bg-[#f8fafc] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">公益检测报告</h1>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                    单号：{orderId?.slice(-6) || '240812'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
                {/* Total Score Card */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-50 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">家庭安全评分</p>
                        <div className="relative mb-4">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke={reportData.totalScore > 80 ? '#10b981' : reportData.totalScore > 60 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * reportData.totalScore) / 100}
                                    className="transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black ${getScoreColor(reportData.totalScore)}`}>{reportData.totalScore}</span>
                                <span className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full ${reportData.totalScore > 60 ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'}`}>
                                    {reportData.safetyLevel}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mt-2">
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">检测师</p>
                                <p className="text-sm font-black text-slate-700">{reportData.inspector}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">检测设备</p>
                                <p className="text-sm font-black text-slate-700">{reportData.device}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Data List */}
                <div className="space-y-6">
                    {reportData.categories.map((cat, idx) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="font-black text-slate-800 text-sm px-2 flex items-center">
                                <span className="w-1 h-4 bg-slate-900 mr-2 rounded-full"></span>
                                {cat.name}
                            </h3>
                            {cat.items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 relative overflow-hidden group">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">标准: {item.standard}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-base font-black ${item.status === 'PASS' ? 'text-emerald-500' :
                                                item.status === 'WARN' ? 'text-amber-500' : 'text-red-500'
                                                }`}>
                                                {item.value}
                                            </div>
                                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded ml-auto w-fit mt-1 ${item.status === 'PASS' ? 'bg-emerald-100 text-emerald-600' :
                                                item.status === 'WARN' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {item.status === 'PASS' ? '合格' : '不合格'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-2.5 mt-2">
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed flex items-start">
                                            <span className="text-slate-400 mr-1.5 shrink-0">评语:</span>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
                <button
                    onClick={() => navigate('/user/service-chat')} // In reality might link to booking rectification
                    className="w-full py-4 bg-[#0F172A] text-white rounded-[1.5rem] font-black text-lg shadow-2xl active:scale-95 transition-transform"
                >
                    由师傅现场协助整改
                </button>
            </div>
        </div>
    );
};
