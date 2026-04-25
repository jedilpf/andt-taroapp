
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ShieldCheck, ChevronRight, Zap, Gift, Smartphone, Box, Package, CheckCircle } from 'lucide-react';

export const UserTradeIn = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'intro' | 'eval' | 'success'>('intro');
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    const devices = [
        { name: '老旧面板', icon: Box, baseSubsidy: '5.00' },
        { name: '废弃断路器', icon: Zap, baseSubsidy: '10.00' },
        { name: '旧灯具', icon: Box, baseSubsidy: '15.00' },
        { name: '老旧家电', icon: Smartphone, baseSubsidy: '50.00' },
    ];

    return (
        <div className="h-full bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-slate-100 active:scale-90 transition-transform"><ArrowLeft size={22}/></button>
                <h1 className="text-lg font-black text-slate-800">以旧换新</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {step === 'intro' && (
                    <div className="p-5 space-y-6 animate-fade-in">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black leading-tight">变废为宝<br/>安全换新</h2>
                                <p className="mt-2 text-sm text-blue-100 font-medium">官方回收老旧耗材，发放换新专项补贴</p>
                            </div>
                            <RotateCcw size={140} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                            <h3 className="font-black text-slate-800 mb-6">选择回收品类</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {devices.map(d => (
                                    <button 
                                        key={d.name}
                                        onClick={() => { setSelectedDevice(d.name); setStep('eval'); }}
                                        className="p-6 rounded-[2rem] bg-slate-50 flex flex-col items-center border-2 border-transparent hover:border-blue-500 transition-all active:scale-95"
                                    >
                                        <d.icon size={32} className="text-blue-600 mb-2"/>
                                        <span className="text-sm font-black text-slate-700">{d.name}</span>
                                        <span className="text-[10px] text-blue-600 mt-1">最高补 ¥{d.baseSubsidy}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'eval' && (
                    <div className="p-5 space-y-6 animate-fade-in">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-blue-50 text-center">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Package size={40} /></div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">正在估价 {selectedDevice}</h3>
                            <p className="text-sm text-slate-400 font-medium">请确保设备已切断电源或拆除</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                            <h4 className="font-black text-blue-800 text-sm flex items-center mb-4"><ShieldCheck size={18} className="mr-2"/> 评估确认项</h4>
                            <div className="space-y-4">
                                {['外观无重大损毁', '核心电路架构完整', '支持社区线下驿站交寄'].map(item => (
                                    <div key={item} className="flex items-center text-xs font-black text-blue-700">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3"><CheckCircle size={14}/></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setStep('success')} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all">立即申领补贴券</button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-5 flex flex-col items-center justify-center pt-20 animate-scale-in text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner"><Gift size={48} /></div>
                        <h2 className="text-3xl font-black text-slate-800">申领成功！</h2>
                        <p className="text-lg text-slate-400 font-bold mt-2">¥15.00 换新补贴已放入卡包</p>
                        <div className="mt-10 w-full space-y-4">
                            <button onClick={() => navigate('/user/store')} className="w-full py-4 bg-[#FFD101] text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-yellow-100 active:scale-95 transition-all">前往商城抵扣</button>
                            <button onClick={() => setStep('intro')} className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-lg active:bg-slate-50 transition-all">返回</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
