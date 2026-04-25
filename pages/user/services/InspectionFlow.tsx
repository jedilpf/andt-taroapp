
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, AlertTriangle, CheckCircle, ChevronRight, Loader2, ThermometerSun, SearchCheck, Settings, CreditCard, Clock, MapPin, User, Star, Coins, Sparkles, X, Info, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, Location } from '../../../types';
import { AddressSelector, TimeSelector } from '../../../components/user/UserShared';

type FlowStep = 'booking' | 'finding' | 'accepted' | 'arrived' | 'scan' | 'result' | 'proposal' | 'done';

export const InspectionFlow = () => {
    const navigate = useNavigate();
    const { currentUser, createOrder, spendPoints, updateOrder } = useApp();

    const [step, setStep] = useState<FlowStep>('booking');
    const [processing, setProcessing] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string>('');

    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 31.1940, lng: 121.4360, address: '正在定位中...' });
    const [scheduledTime, setScheduledTime] = useState('尽快上门');
    const [usePoints, setUsePoints] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const handleBack = () => {
        if (step === 'booking' || step === 'done') {
            navigate(-1);
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleCreateInitialOrder = () => {
        setProcessing(true);
        const newOrderId = Date.now().toString().slice(-8);
        setCurrentOrderId(newOrderId);

        setTimeout(() => {
            if (currentUser) {
                createOrder({
                    id: newOrderId,
                    type: 'Checkup',
                    title: '一键公益安全检测',
                    description: '预约项目：全屋电路安全公益检测（官方全额补贴单）。请携带专业设备上门。',
                    priceEstimate: { min: 0, max: 0, final: 0 },
                    location: selectedLocation,
                    scheduledTime: scheduledTime,
                    status: OrderStatus.PENDING,
                    pointsReward: 50
                });
            }
            setProcessing(false);
            setStep('finding');
        }, 800);
    };

    useEffect(() => {
        if (step === 'finding') {
            const timer = setTimeout(() => setStep('accepted'), 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'accepted') {
            if (currentOrderId && currentUser) updateOrder(currentOrderId, { status: OrderStatus.ACCEPTED });
            const timer = setTimeout(() => setStep('arrived'), 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'arrived') {
            if (currentOrderId && currentUser) updateOrder(currentOrderId, { status: OrderStatus.ARRIVED });
        }
    }, [step, currentOrderId]);

    const [scanProgress, setScanProgress] = useState(0);
    const [scanText, setScanText] = useState('正在检测漏电保护开关...');

    useEffect(() => {
        if (step === 'scan') {
            if (currentOrderId && currentUser) updateOrder(currentOrderId, { status: OrderStatus.IN_PROGRESS });
            const timer = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setStep('result');
                        return 100;
                    }
                    if (prev === 30) setScanText('正在排查插座极性及接地...');
                    if (prev === 60) setScanText('正在评估线路负载及发热...');
                    if (prev === 85) setScanText('生成安全评估报告...');
                    return prev + 1;
                });
            }, 30);
            return () => clearInterval(timer);
        }
        if (step === 'result') {
            if (currentOrderId && currentUser) updateOrder(currentOrderId, { status: OrderStatus.COMPLETED });
        }
    }, [step, currentOrderId]);

    const [selectedMaterials, setSelectedMaterials] = useState<number[]>([1, 2]);
    const materials = [
        { id: 1, name: '公牛漏电保护器 (40A)', price: 85, desc: '解决旧漏保动作迟缓问题' },
        { id: 2, name: '阻燃型五孔插座 (3个)', price: 45, desc: '替换由于老化变形的插座' },
        { id: 3, name: '配电箱绝缘端子排', price: 15, desc: '加固松动接头，防止打火' },
    ];

    const materialTotal = materials
        .filter(m => selectedMaterials.includes(m.id))
        .reduce((sum, m) => sum + m.price, 0);

    const maxRedeemablePoints = Math.min(currentUser?.points || 0, Math.floor((materialTotal - 0.01) * 100));
    const pointsDiscount = usePoints ? (maxRedeemablePoints / 100) : 0;
    const finalTotal = Math.max(0.01, Math.round((materialTotal - pointsDiscount) * 100) / 100);

    const handleFinalPayment = () => {
        setProcessing(true);
        setTimeout(() => {
            if (currentUser) {
                const items = materials.filter(m => selectedMaterials.includes(m.id)).map(m => m.name).join(', ');
                if (usePoints) spendPoints(maxRedeemablePoints);

                createOrder({
                    type: 'Install',
                    title: '公益检测后续整改',
                    description: `现场隐患已排除。整改项：${items}`,
                    priceEstimate: { min: finalTotal, max: finalTotal, final: finalTotal },
                    location: selectedLocation,
                    scheduledTime: '已现场处理',
                    status: OrderStatus.PAID,
                    pointsReward: 50 + Math.floor(materialTotal)
                });
            }
            setProcessing(false);
            setStep('done');
        }, 1200);
    };

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24} /></button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">
                        {step === 'booking' ? '预约检测' : '公益检测'}
                    </h1>
                </div>
                {step === 'proposal' && (
                    <div className="bg-amber-50 px-3 py-1 rounded-full flex items-center border border-amber-100">
                        <Coins size={14} className="text-amber-500 mr-1" />
                        <span className="text-xs font-black text-amber-700">{currentUser?.points || 0}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {step === 'booking' && (
                    <div className="p-5 space-y-6 animate-fade-in">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">Welfare Project</span>
                                <h2 className="text-3xl font-black mt-3 mb-2 tracking-tight">一键申请上门</h2>
                                <p className="text-emerald-50 text-sm font-medium opacity-90 leading-relaxed">响应国家号召，为社区居民提供免费家庭用电隐患排查服务。检测费、上门费全免。</p>
                            </div>
                            <ShieldCheck size={120} className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12" />
                        </div>

                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-5">
                            <h3 className="font-black text-slate-800 flex items-center">确认预约信息</h3>

                            <div onClick={() => setShowAddressPicker(true)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all cursor-pointer group">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm mr-3 shrink-0"><MapPin size={20} /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Detection Address</p>
                                        <p className="text-sm font-black text-slate-700 truncate">{selectedLocation.address}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
                            </div>

                            <div onClick={() => setShowTimePicker(true)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all cursor-pointer group">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm mr-3 shrink-0"><Clock size={20} /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Scheduled Time</p>
                                        <p className="text-sm font-black text-slate-700">{scheduledTime}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex items-start space-x-3">
                            <Shield className="text-blue-600 mt-1 shrink-0" size={20} />
                            <div className="text-xs text-blue-800 leading-relaxed font-bold">
                                权益说明：本次检测包含入户配电箱体检、插座极性检测、漏保灵敏度测试。所有参与师傅均经过平台实名认证并持证上岗。
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleCreateInitialOrder}
                                disabled={processing}
                                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center"
                            >
                                {processing ? <Loader2 size={24} className="animate-spin mr-2" /> : <Sparkles size={24} className="mr-2 text-yellow-400 fill-yellow-400" />}
                                立即免费预约
                            </button>
                            <p className="text-center text-[10px] text-slate-400 font-bold mt-4 tracking-widest uppercase">安电通 · 守护万家灯火</p>
                        </div>
                    </div>
                )}

                {/* 步骤 1: 寻找师傅 */}
                {step === 'finding' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
                        <div className="relative mb-12 scale-110">
                            <div className="w-48 h-48 rounded-full border-2 border-emerald-100 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="w-40 h-40 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <SearchCheck size={64} className="text-emerald-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">正在匹配附近待命师傅</h2>
                        <p className="text-sm text-slate-400 font-bold">已在徐家汇街道通知 3 位公益服务师傅...</p>
                    </div>
                )}

                {/* 步骤 2: 师傅接单 */}
                {step === 'accepted' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 animate-scale-in">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl">
                                <img src="/assets/avatars/p1.png" className="w-full h-full rounded-full object-cover border-4 border-white" alt="elec" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-1">王师傅已接到您的申请</h2>
                        <div className="flex items-center text-orange-500 font-bold text-sm mb-6">
                            <Star size={14} className="fill-current mr-1" /> 4.9 · 本周累计服务 42 次
                        </div>
                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 text-emerald-700 font-black animate-bounce">
                            师傅正在赶来，请保持电话畅通
                        </div>
                    </div>
                )}

                {/* 步骤 3: 师傅到达 */}
                {step === 'arrived' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-lg rotate-12">
                            <MapPin size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">师傅已到达指定位置</h2>
                        <p className="text-lg text-slate-500 font-bold mb-10">核对信息：{selectedLocation.address}</p>
                        <button
                            onClick={() => setStep('scan')}
                            className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all"
                        >
                            开始全屋检测
                        </button>
                    </div>
                )}

                {/* 步骤 4: 检测中 */}
                {step === 'scan' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                        <div className="relative mb-12">
                            <div className="w-48 h-48 rounded-[3rem] border-4 border-emerald-100 flex items-center justify-center relative overflow-hidden shadow-inner bg-white">
                                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                                <Zap size={64} className="text-emerald-500 fill-emerald-500/10" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_1.5s_linear_infinite]"></div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-5 py-1.5 rounded-full border-2 border-emerald-500 shadow-lg font-black text-emerald-600 text-lg">
                                {scanProgress}%
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-2">{scanText}</h2>
                        <p className="text-sm text-slate-400 font-bold">检测设备：FLUKE 数字多功能分析仪</p>
                    </div>
                )}

                {/* 步骤 5: 诊断报告展示 */}
                {step === 'result' && (
                    <div className="p-4 space-y-6 animate-slide-up pb-24">
                        {/* Professional Score Card */}
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-50 blur-2xl"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">家庭安全评分</p>
                                <div className="relative mb-4">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            stroke='#f59e0b'
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray="440"
                                            strokeDashoffset={440 - (440 * 78) / 100}
                                            className="transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black text-yellow-500">78</span>
                                        <span className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                            存在隐患
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                                    <div className="bg-slate-50 rounded-2xl p-3">
                                        <p className="text-[10px] text-slate-400 font-bold mb-1">检测师</p>
                                        <p className="text-sm font-black text-slate-700">王师傅</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3">
                                        <p className="text-[10px] text-slate-400 font-bold mb-1">检测设备</p>
                                        <p className="text-sm font-black text-slate-700">FLUKE 1664FC</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-black text-slate-800 text-sm px-2">发现隐患</h3>
                            {[
                                { title: '漏保开关老化', desc: '动作电流 45mA (标准 30mA)，建议更换', icon: Settings, color: 'bg-orange-50 text-orange-600' },
                                { title: '厨房插座过热', desc: '插座内部碳化严重，存在打火隐患', icon: Zap, color: 'bg-red-50 text-red-600' },
                                { title: '配电箱接线松动', desc: '端子压接不实，需现场紧固', icon: SearchCheck, color: 'bg-yellow-50 text-yellow-600' }
                            ].map((issue, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-50 flex items-start space-x-4">
                                    <div className={`w-12 h-12 rounded-2xl ${issue.color} flex items-center justify-center shrink-0 shadow-sm`}><issue.icon size={24} /></div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-800 text-base">{issue.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">{issue.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center -mb-4 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full">可以在订单中查看详细检测报告</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => navigate('/user/inspection/deep-report/temp_order_id')}
                                className="w-full py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-[1.5rem] font-bold text-lg shadow-sm active:scale-95 transition-transform"
                            >
                                <span className="mr-2">📄</span> 查看深度检测报告
                            </button>
                            <button
                                onClick={() => setStep('proposal')}
                                className="w-full py-5 bg-[#0F172A] text-white rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-transform"
                            >
                                由师傅现场协助整改
                            </button>
                        </div>
                    </div>
                )}

                {/* 步骤 6: 整改方案与支付 */}
                {step === 'proposal' && (
                    <div className="p-4 space-y-6 animate-slide-up pb-32">
                        <div className="flex items-center space-x-3">
                            <div className="w-1.5 h-7 bg-emerald-500 rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-800">整改所需物料清单</h2>
                        </div>

                        <div className="space-y-3">
                            {materials.map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMaterials(prev => prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id])}
                                    className={`p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${selectedMaterials.includes(m.id) ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-slate-800">{m.name}</h4>
                                        <span className="text-red-600 font-black">¥{m.price}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold">{m.desc}</p>
                                    {selectedMaterials.includes(m.id) && (
                                        <div className="absolute top-2 right-2 text-emerald-500 animate-scale-in">
                                            <CheckCircle size={18} fill="currentColor" className="text-emerald-50 text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                            <div className={`p-4 rounded-2xl border transition-all ${usePoints ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-transparent'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${usePoints ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                                            <Coins size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">积分抵扣</p>
                                            <p className="text-[10px] text-slate-400 font-bold">可用 {currentUser?.points || 0} 积分，抵 ¥{(maxRedeemablePoints / 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setUsePoints(!usePoints)}
                                        disabled={maxRedeemablePoints <= 0}
                                        className={`w-12 h-7 rounded-full relative transition-colors ${usePoints ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${usePoints ? 'right-1' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-5 rounded-[1.5rem] flex items-start space-x-3 border border-orange-100">
                            <Info size={20} className="text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-orange-700 font-bold leading-relaxed">说明：本次上门仅收取物料费。整改物料享受 12 个月超长质保，师傅现场操作免人工费。</p>
                        </div>
                    </div>
                )}

                {/* 步骤 7: 完成结束 */}
                {step === 'done' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl rotate-12">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">隐患已全面排除</h2>
                        <p className="text-lg text-slate-400 font-bold mb-10">师傅已完成现场修复与再次检测</p>
                        <button
                            onClick={() => navigate('/user/orders')}
                            className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all"
                        >
                            返回订单列表
                        </button>
                    </div>
                )}
            </div>

            {/* 固定支付栏 */}
            {step === 'proposal' && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-screen-md mx-auto flex items-center justify-between">
                        <div>
                            <div className="flex items-center text-xs text-slate-400 font-black mb-1">
                                物料总费 <span className="mx-1 opacity-50">|</span>
                                {usePoints && <span className="text-indigo-500 font-bold">积分抵扣 -¥{(pointsDiscount).toFixed(2)}</span>}
                            </div>
                            <div className="flex items-baseline text-red-600">
                                <span className="text-sm font-bold">¥</span>
                                <span className="text-3xl font-black mx-1 tracking-tighter">{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleFinalPayment}
                            disabled={processing || selectedMaterials.length === 0}
                            className="px-12 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center"
                        >
                            {processing ? <Loader2 size={20} className="animate-spin mr-2" /> : <CreditCard size={20} className="mr-2" />}
                            立即支付
                        </button>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl scale-100 animate-scale-in">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">确定要退出检测吗？</h3>
                            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                                当前正在进行公益检测流程，退出后可能需要重新预约。
                            </p>
                            <div className="flex space-x-3 w-full">
                                <button
                                    onClick={() => setShowExitConfirm(false)}
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-base active:scale-95 transition-all"
                                >
                                    继续检测
                                </button>
                                <button
                                    onClick={() => { setShowExitConfirm(false); navigate(-1); }}
                                    className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-all"
                                >
                                    确认退出
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fix: Changed showAddrPicker to showAddressPicker */}
            {showAddressPicker && (
                <AddressSelector
                    onClose={() => setShowAddressPicker(false)}
                    onSelect={(loc) => { setSelectedLocation(loc); setShowAddressPicker(false); }}
                />
            )}
            {showTimePicker && (
                <TimeSelector
                    onClose={() => setShowTimePicker(false)}
                    onSelect={(t) => { setScheduledTime(t); setShowTimePicker(false); }}
                />
            )}

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(180px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
