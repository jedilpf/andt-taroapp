
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle, MapPin, Navigation, Clock, FileText, Camera, Shield, DollarSign } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

export const TaskDetail = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const { orders, updateOrder } = useApp();
    
    const allOrders = [...orders]; 
    const order = allOrders.find(o => o.id === id);
    const [loading, setLoading] = useState(false);
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [finalPrice, setFinalPrice] = useState('');

    if (!order) return (
        <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center">
            <FileText size={48} className="text-gray-300 mb-4"/>
            <p className="text-gray-500">订单详情加载中或不存在...</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold">返回上一页</button>
        </div>
    );

    const steps = [
        { status: OrderStatus.ACCEPTED, label: '已接单' },
        { status: OrderStatus.ARRIVED, label: '已上门' },
        { status: OrderStatus.IN_PROGRESS, label: '施工中' },
        { status: OrderStatus.COMPLETED, label: '待支付' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);
    
    const handleNextStep = () => {
        // If current status is IN_PROGRESS, showing input first
        if (order.status === OrderStatus.IN_PROGRESS && !showPriceInput) {
            setShowPriceInput(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            let nextStatus = order.status;
            let updates: any = {};

            if (order.status === OrderStatus.ACCEPTED) {
                nextStatus = OrderStatus.ARRIVED;
            } else if (order.status === OrderStatus.ARRIVED) {
                nextStatus = OrderStatus.IN_PROGRESS;
            } else if (order.status === OrderStatus.IN_PROGRESS) {
                nextStatus = OrderStatus.COMPLETED;
                // Save the final price if entered
                if (finalPrice) {
                    updates.priceEstimate = { 
                        ...order.priceEstimate, 
                        final: parseFloat(finalPrice) 
                    };
                }
            }

            updateOrder(order.id, { status: nextStatus, ...updates });
            setLoading(false);
            if (nextStatus === OrderStatus.COMPLETED) {
                navigate(-1); // Go back to list or stay
            }
        }, 800);
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24 relative z-50">
            {/* Header */}
            <div className="bg-blue-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-md">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20}/></button>
                <span className="font-bold text-lg">订单详情</span>
                <button onClick={() => window.open('tel:13800000000')} className="p-2 hover:bg-white/10 rounded-full"><Phone size={20}/></button>
            </div>

            {/* Status Bar */}
            <div className="bg-white p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center relative">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        return (
                            <div key={step.status} className="flex flex-col items-center bg-white px-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {isCompleted ? <CheckCircle size={14}/> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Client Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{order.type === 'Repair' ? '电路急修' : order.title}</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1"/> {order.scheduledTime}
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">¥{order.priceEstimate.final || order.priceEstimate.min}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="mt-1"><MapPin size={18} className="text-blue-600"/></div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm mb-1">{order.location.address}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{order.clientName} (已实名)</p>
                                <button onClick={() => alert("已为您规划最优路线")} className="bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded text-xs font-bold flex items-center shadow-sm active:bg-blue-50">
                                    <Navigation size={12} className="mr-1"/> 导航
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Input Area (Only visible when finishing) */}
                {showPriceInput && (
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-blue-100 animate-slide-up">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center"><DollarSign size={16} className="mr-2 text-green-600"/> 录入最终费用</h3>
                        <div className="bg-gray-50 rounded-xl p-2 flex items-center border border-gray-200">
                            <span className="text-lg font-bold text-gray-500 px-3">¥</span>
                            <input 
                                type="number" 
                                value={finalPrice}
                                onChange={(e) => setFinalPrice(e.target.value)}
                                placeholder="请输入实收金额 (含材料)"
                                className="flex-1 bg-transparent outline-none text-xl font-bold text-gray-900 h-10"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">确认后将发送账单给用户，用户支付后资金进入余额。</p>
                    </div>
                )}

                {/* Description */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center"><FileText size={16} className="mr-2 text-gray-400"/> 故障描述</h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">{order.description || '用户未填写详细描述，请上门后核实。'}</p>
                    
                    {/* Photo Upload Mock */}
                    <div className="mt-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">现场留底 (施工前/后)</p>
                        <div className="flex gap-3">
                            <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-gray-100 cursor-pointer">
                                <Camera size={20}/>
                                <span className="text-[10px] mt-1">拍照</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start text-sm text-orange-800">
                    <Shield size={16} className="mr-2 mt-0.5 shrink-0"/>
                    <p>作业时请务必切断电源，规范佩戴绝缘手套。遇到高危情况请立即报备平台。</p>
                </div>
            </div>

            {/* Fixed Bottom Action */}
            {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.PAID && order.status !== OrderStatus.CANCELLED && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 safe-area-bottom">
                    <button 
                        onClick={handleNextStep} 
                        disabled={loading || (showPriceInput && !finalPrice)}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform flex justify-center items-center disabled:opacity-70 ${showPriceInput ? 'bg-green-600 text-white shadow-green-200' : 'bg-blue-600 text-white shadow-blue-200'}`}
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {showPriceInput ? '确认费用并完工' : (
                            order.status === OrderStatus.ACCEPTED ? '我已到达现场' : (
                                order.status === OrderStatus.ARRIVED ? '开始施工' : '完工录入费用'
                            )
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
