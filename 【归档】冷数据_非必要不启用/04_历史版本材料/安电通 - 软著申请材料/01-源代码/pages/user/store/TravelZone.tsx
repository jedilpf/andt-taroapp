
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Navigation, Clock,
    Car, Zap, User, Star, Phone, ShieldCheck,
    Loader2, Locate
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

const TravelZone = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [step, setStep] = useState<'input' | 'searching' | 'found' | 'arrived'>('input');
    const [destination, setDestination] = useState('');
    const [carType, setCarType] = useState('economic');

    // Simulated Driver Data
    const driver = {
        name: '王师傅',
        rating: 4.9,
        car: '沪A·D12345 (白色·比亚迪秦)',
        distance: '0.8km',
        time: '3分钟'
    };

    const handleCallCar = () => {
        if (!destination) return;
        setStep('searching');
        setTimeout(() => {
            setStep('found');

            // Generate Order
            createOrder({
                type: 'Travel',
                title: '社区出行订单',
                description: `目的地: ${destination} \n车型: ${carType === 'economic' ? '惠民拼车' : '优享专车'}`,
                priceEstimate: { min: 12, max: 15, final: 12 },
                location: currentUser?.location,
                status: OrderStatus.IN_PROGRESS,
                scheduledTime: '司机已接单',
                electricianName: driver.name // Reuse field for driver name
            });

        }, 2500);
    };

    const handleArrived = () => {
        setStep('arrived');
        setTimeout(() => {
            navigate('/user/orders');
        }, 2000);
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Map Background Simulation */}
            <div className="absolute inset-0 z-0 bg-[#E5E7EB] pointer-events-none">
                {/* Simulated Roads */}
                <div className="absolute top-0 left-1/2 w-8 h-full bg-white/50 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-full h-8 bg-white/50 transform -translate-y-1/2"></div>
                <div className="absolute top-1/3 left-0 w-full h-4 bg-white/50 rotate-45"></div>

                {/* You are here */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pulse">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                </div>

                {/* Simulated Points */}
                <div className="absolute top-1/4 left-1/4">
                    <MapPin className="text-red-500 transform -translate-x-1/2 -translate-y-full" fill="currentColor" />
                </div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 pt-safe px-4 pb-4 bg-gradient-to-b from-black/10 to-transparent">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <ChevronLeft size={24} className="text-slate-800" />
                </button>
            </div>

            {/* Bottom Panel */}
            <div className="mt-auto bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 animate-slide-up">

                {/* State: Input Destination */}
                {step === 'input' && (
                    <div className="p-6 pb-safe space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-bold text-slate-800 text-sm">当前位置：天钥桥路333号</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="输入您的目的地"
                                className="flex-1 bg-slate-50 h-12 rounded-xl px-4 font-bold text-lg outline-none focus:ring-2 ring-blue-500/20 transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCarType('economic')}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${carType === 'economic' ? 'border-green-500 bg-green-50' : 'border-slate-50 bg-slate-50'}`}
                            >
                                <div className="flex items-center">
                                    <Zap size={20} className={carType === 'economic' ? 'text-green-600' : 'text-slate-400'} />
                                    <span className="ml-2 font-black text-sm text-slate-700">惠民拼车</span>
                                </div>
                                <span className="font-bold text-slate-900">¥12</span>
                            </button>
                            <button
                                onClick={() => setCarType('comfort')}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${carType === 'comfort' ? 'border-blue-500 bg-blue-50' : 'border-slate-50 bg-slate-50'}`}
                            >
                                <div className="flex items-center">
                                    <Car size={20} className={carType === 'comfort' ? 'text-blue-600' : 'text-slate-400'} />
                                    <span className="ml-2 font-black text-sm text-slate-700">优享专车</span>
                                </div>
                                <span className="font-bold text-slate-900">¥18</span>
                            </button>
                        </div>

                        <button
                            onClick={handleCallCar}
                            disabled={!destination}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform disabled:opacity-50"
                        >
                            立即呼叫
                        </button>
                    </div>
                )}

                {/* State: Searching */}
                {step === 'searching' && (
                    <div className="p-8 pb-safe flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
                            <Loader2 size={40} className="text-blue-500 animate-spin" />
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">正在为您寻找附近的车辆</h3>
                        <p className="text-slate-400 font-bold text-sm">已通知 3 位附近的爱心司机...</p>
                        <button onClick={() => setStep('input')} className="mt-8 text-slate-400 text-sm">取消呼叫</button>
                    </div>
                )}

                {/* State: Found Driver */}
                {step === 'found' && (
                    <div className="p-6 pb-safe">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl text-slate-800">司机正在赶来</h3>
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">预计3分钟</span>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden">
                                <User size={56} className="text-slate-300 translate-y-2" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg text-slate-800">{driver.name} <span className="text-xs font-normal bg-yellow-100 text-yellow-700 px-1 rounded ml-1">★ {driver.rating}</span></h4>
                                <p className="text-sm text-slate-500 font-bold mt-1">{driver.car}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Phone size={20} /></button>
                                <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><ShieldCheck size={20} /></button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></div>
                                <div>
                                    <p className="text-xs text-slate-400">起点</p>
                                    <p className="font-bold text-slate-800">天钥桥路333号</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 shrink-0"></div>
                                <div>
                                    <p className="text-xs text-slate-400">终点</p>
                                    <p className="font-bold text-slate-800">{destination}</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleArrived} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-200 active:scale-95 transition-transform">
                            模拟：司机已到达
                        </button>
                    </div>
                )}

                {/* State: Arrived */}
                {step === 'arrived' && (
                    <div className="p-8 pb-safe flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Navigation size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">已到达目的地</h3>
                        <p className="text-slate-400 font-bold text-sm">感谢使用社区公益出行服务</p>
                        <p className="mt-2 text-2xl font-black text-slate-900">¥12.00</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelZone;
