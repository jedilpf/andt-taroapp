
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added missing ShieldCheck to the lucide-react imports
import { ArrowLeft, Zap, MapPin, Clock, AlertTriangle, ChevronRight, Siren, Flame, Power, Activity, CheckCircle2, PhoneCall, Headphones, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, Location } from '../../../types';
import { AddressSelector } from '../../../components/user/UserShared';

export const RepairPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    
    const [selectedSymptom, setSelectedSymptom] = useState<string>('');
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(
        currentUser?.location || { lat: 31.1940, lng: 121.4360, address: '正在定位中...' }
    );

    const symptoms = [
        { id: 'fire', label: '插座冒火/冒烟', icon: Flame, color: 'text-red-600', bg: 'bg-red-50', urgent: true },
        { id: 'power', label: '全屋没电', icon: Power, color: 'text-slate-700', bg: 'bg-slate-100', urgent: true },
        { id: 'trip', label: '频繁跳闸', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', urgent: false },
        { id: 'shock', label: '外壳漏电', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', urgent: true },
    ];

    const handleCallDirectly = () => {
        window.location.href = 'tel:400-888-9527';
    };

    const handleSubmit = () => {
        if (!currentUser || !selectedSymptom) return;
        createOrder({
            type: 'Repair',
            title: `应急抢修 - ${selectedSymptom}`,
            description: `【紧急】故障：${selectedSymptom}。请师傅尽快上门排查，确保用电安全。`,
            priceEstimate: { min: 30, max: 80 }, // 内部价格逻辑，不显著显示
            location: selectedLocation,
            status: OrderStatus.PENDING,
            scheduledTime: '立即出发'
        });
        navigate('/user/orders');
    };

    return (
        <div className="h-full w-full bg-slate-900 flex flex-col relative overflow-hidden">
            <div className="relative z-20 p-4 pt-safe flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft size={20}/></button>
                <div className="bg-red-600 px-4 py-1.5 rounded-full flex items-center border border-red-500 animate-pulse">
                    <Siren size={14} className="text-white mr-2"/>
                    <span className="text-white text-xs font-black tracking-widest">EMERGENCY</span>
                </div>
                <button onClick={handleCallDirectly} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce"><PhoneCall size={20}/></button>
            </div>

            <div className="px-6 mt-4 mb-8 z-10">
                <h1 className="text-3xl font-black text-white mb-2">应急报修</h1>
                <p className="text-slate-400 text-sm font-medium">社区极速响应 · 安全故障先行排查</p>
            </div>

            <div className="bg-white rounded-t-[3rem] relative z-20 flex-1 flex flex-col overflow-hidden shadow-2xl">
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    <div onClick={() => setShowAddressSelector(true)} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center overflow-hidden">
                            <MapPin size={20} className="text-blue-600 mr-3 shrink-0"/>
                            <span className="font-bold text-slate-800 truncate">{selectedLocation.address}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300"/>
                    </div>

                    <div>
                        <h3 className="text-slate-900 font-black text-lg mb-4 flex items-center">故障类型</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {symptoms.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedSymptom(item.label)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${selectedSymptom === item.label ? 'border-red-500 bg-red-50' : 'border-slate-50 bg-slate-50'}`}
                                >
                                    <item.icon size={28} className={`${item.color} mb-2`} />
                                    <span className="font-bold text-xs text-slate-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <h4 className="text-blue-800 font-black text-sm flex items-center mb-1"><ShieldCheck size={16} className="mr-2"/> 服务保障</h4>
                        <p className="text-xs text-blue-600 leading-relaxed font-medium">响应时间内师傅未出发赔付优惠券。所有维修均有 90 天质保。收费标准请查看《社区公示价目表》。</p>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                    <button 
                        onClick={handleSubmit}
                        disabled={!selectedSymptom}
                        className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center ${selectedSymptom ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-slate-100 text-slate-300'}`}
                    >
                        {selectedSymptom ? '预约师傅上门' : '请先选择故障类型'}
                    </button>
                </div>
            </div>

            {showAddressSelector && <AddressSelector onClose={() => setShowAddressSelector(false)} onSelect={(loc) => { setSelectedLocation(loc); setShowAddressSelector(false); }} />}
        </div>
    );
};
