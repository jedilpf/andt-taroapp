
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Wrench, ArrowLeft, CheckCircle, Loader2, MapPin, Volume2, User, Flashlight, AlertTriangle, X, Mic, ChevronRight, ShieldCheck, Info, Headphones, Clock, HeartHandshake, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const CareVersion = () => {
    const navigate = useNavigate();
    const { currentUser, createOrder } = useApp();
    
    // Steps: home (main menu), confirm (ask user), success (result), info (service scope)
    const [step, setStep] = useState<'home' | 'confirm' | 'success' | 'info'>('home');
    const [loading, setLoading] = useState(false);
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [orderType, setOrderType] = useState<'Repair' | 'Checkup'>('Repair');

    // --- Actions ---

    const handleQuickRepair = () => {
        setOrderType('Repair');
        setStep('confirm');
    };

    const handleInspection = () => {
        setOrderType('Checkup');
        setStep('confirm');
    };

    const confirmOrder = () => {
        setLoading(true);
        setTimeout(() => {
            if (currentUser) {
                createOrder({
                    type: orderType,
                    title: orderType === 'Repair' ? '关怀版-一键报修' : '关怀版-免费检测',
                    description: orderType === 'Repair' 
                        ? '用户使用长辈关怀模式发起的一键报修，请优先联系。' 
                        : '用户使用长辈关怀模式预约的免费线路检测（公益活动）。',
                    priceEstimate: { min: orderType === 'Repair' ? 30 : 0, max: orderType === 'Repair' ? 80 : 0 },
                    location: currentUser.location,
                    status: OrderStatus.PENDING,
                    scheduledTime: '尽快上门'
                });
            }
            setLoading(false);
            setStep('success');
        }, 1500);
    };

    const handleCall = () => {
        window.location.href = 'tel:13800000000';
    };

    const handleCallFamily = () => {
        // Mock call
        alert("正在呼叫紧急联系人 (子女)...");
    };

    const toggleFlashlight = () => {
        setFlashlightOn(prev => !prev);
    };

    const showServiceInfo = () => {
        setStep('info');
    };

    const contactSupport = () => {
        // Open the global support modal via event
        window.dispatchEvent(new Event('open-support'));
    };

    // --- Render Helpers ---

    return (
        <div className="h-full w-full bg-[#F5F7FA] flex flex-col relative overflow-hidden font-sans">
            
            {/* Flashlight Overlay */}
            {flashlightOn && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center animate-fade-in">
                    <button 
                        onClick={() => setFlashlightOn(false)}
                        className="w-64 h-64 rounded-full bg-slate-100 border-8 border-slate-200 flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform"
                    >
                        <Flashlight size={80} className="text-slate-800 mb-4 fill-slate-800"/>
                        <span className="text-4xl font-black text-slate-800">关灯</span>
                    </button>
                    <p className="mt-12 text-2xl text-slate-500 font-bold">手电筒已开启</p>
                </div>
            )}

            {/* Header - High Contrast & Large */}
            <div className="p-5 bg-white shadow-sm flex items-center justify-between shrink-0 z-20 border-b border-slate-200 safe-area-top">
                <button 
                    onClick={() => {
                        if (step === 'home') navigate('/user/home');
                        else setStep('home');
                    }} 
                    className="flex items-center justify-center bg-slate-100 px-6 py-3 rounded-full active:bg-slate-200 transition-colors border-2 border-slate-300 active:scale-95"
                >
                    <ArrowLeft size={32} className="text-slate-800 mr-2"/>
                    <span className="text-2xl font-bold text-slate-800">{step === 'home' ? '退出' : '返回'}</span>
                </button>
                <div className="flex items-center space-x-2 bg-emerald-100 px-5 py-2 rounded-full border border-emerald-200">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xl font-black text-emerald-800">关怀模式</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 relative z-10 flex flex-col pb-safe no-scrollbar">
                
                {/* 1. HOME SCREEN */}
                {step === 'home' && (
                    <div className="flex-1 flex flex-col space-y-6 animate-fade-in">
                        
                        {/* Location Banner */}
                        <div className="bg-white p-6 rounded-[2rem] flex items-center space-x-5 shadow-md border-l-8 border-blue-500 mb-2">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                                <MapPin size={40} className="fill-blue-100"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xl text-slate-500 font-bold mb-1">当前位置</p>
                                <p className="text-3xl font-black text-slate-800 leading-snug truncate">
                                    {currentUser?.location?.address || "定位中..."}
                                </p>
                            </div>
                        </div>

                        {/* Large Action Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            
                            {/* Emergency Repair */}
                            <button 
                                onClick={handleQuickRepair}
                                className="w-full bg-white rounded-[2.5rem] border-4 border-red-50 shadow-xl active:scale-[0.98] transition-transform flex items-center p-8 relative overflow-hidden group h-40"
                            >
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-red-50 rounded-full opacity-50 translate-x-10 translate-y-10"></div>
                                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner shrink-0 mr-6 border-2 border-red-200">
                                    <Wrench size={48}/>
                                </div>
                                <div className="text-left flex-1 relative z-10">
                                    <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">我要修电</h2>
                                    <p className="text-xl text-red-600 font-bold">家里没电按这里</p>
                                </div>
                                <ChevronRight size={40} className="text-slate-300"/>
                            </button>

                            {/* Call Master */}
                            <button 
                                onClick={handleCall}
                                className="w-full bg-white rounded-[2.5rem] border-4 border-emerald-50 shadow-xl active:scale-[0.98] transition-transform flex items-center p-8 relative overflow-hidden group h-40"
                            >
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-emerald-50 rounded-full opacity-50 translate-x-10 translate-y-10"></div>
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner shrink-0 mr-6 border-2 border-emerald-200">
                                    <Phone size={48}/>
                                </div>
                                <div className="text-left flex-1 relative z-10">
                                    <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">电话叫人</h2>
                                    <p className="text-xl text-emerald-600 font-bold">直接给师傅打电话</p>
                                </div>
                                <ChevronRight size={40} className="text-slate-300"/>
                            </button>

                            {/* Free Inspection */}
                            <button 
                                onClick={handleInspection}
                                className="w-full bg-white rounded-[2.5rem] border-4 border-blue-50 shadow-xl active:scale-[0.98] transition-transform flex items-center p-8 relative overflow-hidden group h-40"
                            >
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-50 rounded-full opacity-50 translate-x-10 translate-y-10"></div>
                                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner shrink-0 mr-6 border-2 border-blue-200">
                                    <ShieldCheck size={48}/>
                                </div>
                                <div className="text-left flex-1 relative z-10">
                                    <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">免费检测</h2>
                                    <p className="text-xl text-blue-600 font-bold">查查线路安不安全</p>
                                </div>
                                <ChevronRight size={40} className="text-slate-300"/>
                            </button>
                        </div>

                        {/* Secondary Functions Grid */}
                        <div className="grid grid-cols-2 gap-5 mt-4">
                            {/* Call Family */}
                            <button 
                                onClick={handleCallFamily}
                                className="bg-white p-6 rounded-[2rem] border-2 border-indigo-100 shadow-md active:scale-95 transition-transform flex flex-col items-center text-center h-48 justify-center"
                            >
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                                    <User size={40} className="fill-indigo-600"/>
                                </div>
                                <span className="text-2xl font-black text-slate-800">呼叫子女</span>
                                <span className="text-lg text-slate-400 font-bold mt-1">紧急联系</span>
                            </button>

                            {/* Flashlight */}
                            <button 
                                onClick={toggleFlashlight}
                                className="bg-white p-6 rounded-[2rem] border-2 border-amber-100 shadow-md active:scale-95 transition-transform flex flex-col items-center text-center h-48 justify-center"
                            >
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                    <Flashlight size={40} className="fill-amber-600"/>
                                </div>
                                <span className="text-2xl font-black text-slate-800">手电筒</span>
                                <span className="text-lg text-slate-400 font-bold mt-1">太黑看不见</span>
                            </button>

                            {/* Service Info */}
                            <button 
                                onClick={showServiceInfo}
                                className="bg-white p-6 rounded-[2rem] border-2 border-teal-100 shadow-md active:scale-95 transition-transform flex flex-col items-center text-center h-48 justify-center"
                            >
                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
                                    <Info size={40} className="fill-teal-600"/>
                                </div>
                                <span className="text-2xl font-black text-slate-800">服务说明</span>
                                <span className="text-lg text-slate-400 font-bold mt-1">范围与收费</span>
                            </button>

                            {/* Online Support */}
                            <button 
                                onClick={contactSupport}
                                className="bg-white p-6 rounded-[2rem] border-2 border-purple-100 shadow-md active:scale-95 transition-transform flex flex-col items-center text-center h-48 justify-center"
                            >
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                    <Headphones size={40} className="fill-purple-600"/>
                                </div>
                                <span className="text-2xl font-black text-slate-800">人工客服</span>
                                <span className="text-lg text-slate-400 font-bold mt-1">有问题问我</span>
                            </button>
                        </div>

                        {/* Hint Footer */}
                        <div className="mt-6 mb-10 bg-slate-200/50 rounded-2xl p-5 flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-200">
                            <Volume2 size={28} className="mr-3 text-slate-400"/> 
                            大字号 · 语音播报 · 简单易用
                        </div>
                    </div>
                )}

                {/* 2. SERVICE INFO SCREEN */}
                {step === 'info' && (
                    <div className="flex-1 flex flex-col space-y-6 animate-slide-up">
                        <h2 className="text-3xl font-black text-slate-800 mb-2 px-2">服务说明</h2>
                        
                        {/* Scope */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-slate-100">
                            <div className="flex items-center mb-5">
                                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-5">
                                    <MapPin size={32} className="fill-teal-600"/>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800">服务范围</h3>
                                    <p className="text-xl text-slate-500 font-bold mt-1">覆盖全市社区</p>
                                </div>
                            </div>
                            <p className="text-2xl text-slate-600 font-medium leading-relaxed pl-4 border-l-8 border-teal-200">
                                市区老房、郊区新居、街道里弄。只要您有需要，师傅都会上门。
                            </p>
                        </div>

                        {/* Hours */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-slate-100">
                            <div className="flex items-center mb-5">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-5">
                                    <Clock size={32} className="fill-blue-600"/>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800">服务时间</h3>
                                    <p className="text-xl text-slate-500 font-bold mt-1">24小时待命</p>
                                </div>
                            </div>
                            <p className="text-2xl text-slate-600 font-medium leading-relaxed pl-4 border-l-8 border-blue-200">
                                无论是白天还是深夜，遇到跳闸停电，随叫随到。
                            </p>
                        </div>

                        {/* Discount */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-slate-100">
                            <div className="flex items-center mb-5">
                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-5">
                                    <HeartHandshake size={32} className="fill-orange-600"/>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800">长辈优惠</h3>
                                    <p className="text-xl text-slate-500 font-bold mt-1">专属免费检测</p>
                                </div>
                            </div>
                            <p className="text-2xl text-slate-600 font-medium leading-relaxed pl-4 border-l-8 border-orange-200">
                                60岁以上长辈，免收上门费。每季度可享受一次免费全屋线路安全检测。
                            </p>
                        </div>

                        <button 
                            onClick={() => setStep('home')}
                            className="w-full py-8 bg-slate-800 text-white rounded-[2rem] text-4xl font-black shadow-xl active:scale-95 transition-transform mt-auto"
                        >
                            我知道了
                        </button>
                    </div>
                )}

                {/* 3. CONFIRMATION SCREEN */}
                {step === 'confirm' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center h-full animate-slide-up relative px-4">
                        <div className={`w-56 h-56 rounded-full flex items-center justify-center mb-10 animate-pulse border-8 ${orderType === 'Repair' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                            {orderType === 'Repair' 
                                ? <AlertTriangle size={100} className="text-red-500 fill-red-500"/>
                                : <ShieldCheck size={100} className="text-blue-500 fill-blue-500"/>
                            }
                        </div>
                        
                        <h2 className="text-6xl font-black text-slate-900 mb-6">{orderType === 'Repair' ? '确认呼叫？' : '确认检测？'}</h2>
                        
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-slate-100 mb-12 w-full">
                            <p className="text-3xl text-slate-600 font-bold leading-relaxed mb-4">
                                {orderType === 'Repair' ? '师傅将上门检修' : '预约免费上门检测'}
                            </p>
                            <div className="flex items-center justify-center bg-slate-50 py-4 rounded-2xl">
                                <MapPin size={28} className="text-slate-400 mr-2"/>
                                <span className="text-2xl text-slate-800 font-bold">{currentUser?.location?.address}</span>
                            </div>
                            {orderType === 'Checkup' && (
                                <p className="text-xl text-green-600 font-black mt-4 bg-green-50 py-2 rounded-xl">
                                    本次服务完全免费
                                </p>
                            )}
                        </div>
                        
                        <div className="w-full space-y-6">
                            <button 
                                onClick={confirmOrder}
                                disabled={loading}
                                className={`w-full py-8 text-white rounded-[2.5rem] text-4xl font-black shadow-xl active:scale-95 transition-transform flex items-center justify-center ${orderType === 'Repair' ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}
                            >
                                {loading ? <Loader2 className="animate-spin mr-4" size={48}/> : (orderType === 'Repair' ? '是，确认呼叫' : '是，确认预约')}
                            </button>
                            
                            <button 
                                onClick={() => setStep('home')}
                                className="w-full py-8 bg-white text-slate-500 rounded-[2.5rem] text-3xl font-bold active:scale-95 transition-transform border-4 border-slate-200"
                            >
                                点错了，返回
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. SUCCESS SCREEN */}
                {step === 'success' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in h-full px-4">
                        <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center mb-12 border-8 border-emerald-100 shadow-inner animate-bounce">
                            <CheckCircle size={140} className="text-emerald-500 fill-emerald-500 border-4 border-white rounded-full"/>
                        </div>
                        <h2 className="text-6xl font-black text-slate-800 mb-8 tracking-tight">
                            {orderType === 'Repair' ? '呼叫成功' : '预约成功'}
                        </h2>
                        
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-emerald-100 mb-16 w-full relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                            <div className="flex items-center justify-center mb-8">
                                <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    <User size={80} className="text-slate-300 translate-y-2"/>
                                </div>
                            </div>
                            <p className="text-4xl text-slate-800 font-bold leading-relaxed mb-4">
                                {orderType === 'Repair' ? '王师傅正在赶来' : '已为您安排师傅'}
                            </p>
                            <p className="text-2xl text-slate-400 font-medium">
                                请保持电话畅通
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setStep('home')}
                            className="w-full py-8 bg-emerald-600 text-white rounded-[2.5rem] text-4xl font-black shadow-xl shadow-emerald-200 active:scale-95 transition-transform"
                        >
                            知道了
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
