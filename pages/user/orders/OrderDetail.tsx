
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Clock, Phone, Star, CheckCircle,
    CreditCard, ShieldCheck, FileText, AlertTriangle,
    Wrench, MoreHorizontal, ShoppingCart, DollarSign, MessageCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

export const OrderDetail = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { orders } = useApp();

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-400 mb-4">订单不存在</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 font-bold">返回</button>
            </div>
        );
    }

    const statusConfig = {
        [OrderStatus.PENDING]: { color: 'bg-orange-500', label: '待接单', desc: '系统正在全力为您匹配师傅...' },
        [OrderStatus.ACCEPTED]: { color: 'bg-blue-600', label: '已接单', desc: '师傅已接单，请保持通讯畅通' },
        [OrderStatus.ARRIVED]: { color: 'bg-indigo-600', label: '已上门', desc: '师傅已到达现场，开始检测' },
        [OrderStatus.IN_PROGRESS]: { color: 'bg-purple-600', label: '施工中', desc: '正在为您进行专业电力作业' },
        [OrderStatus.COMPLETED]: { color: 'bg-green-600', label: '已完成', desc: '服务已完成，期待您的好评' },
        [OrderStatus.PAID]: { color: 'bg-blue-500', label: '已支付', desc: '订单已确认，感谢您的使用' },
        [OrderStatus.CANCELLED]: { color: 'bg-gray-400', label: '已取消', desc: '该订单已取消交易' }
    }[order.status as OrderStatus];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-[#F5F5F5] pb-safe">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft size={24} /></button>
                    <h1 className="text-lg font-black text-gray-800">订单详情</h1>
                </div>
                <button className="p-2"><MoreHorizontal size={20} /></button>
            </div>

            {/* Status Header - 显著缩小 py-10 -> py-6 */}
            <div className={`${statusConfig.color} px-6 py-6 text-white relative overflow-hidden transition-all duration-500`}>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black italic tracking-tighter mb-1">{statusConfig.label}</h2>
                    <p className="text-xs opacity-90 font-bold">{statusConfig.desc}</p>
                </div>
                {/* 缩小装饰性图标 */}
                <div className="absolute right-[-20px] bottom-[-20px] p-4 opacity-10 rotate-12 scale-75 transition-transform"><CheckCircle size={100} /></div>
            </div>

            <div className="px-3 -mt-4 relative z-20 space-y-3 pb-24">
                {/* Mechanic Card */}
                {order.electricianName && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800">{order.electricianName}</h3>
                                <p className="text-[10px] font-bold text-gray-400 flex items-center mt-1">
                                    <Star size={10} className="text-orange-500 mr-0.5 fill-current" /> 4.9 · 实名电工
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => window.location.href = `tel:4008889527`} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:bg-green-100 transition-colors"><Phone size={18} /></button>
                            <button onClick={() => navigate('/user/service-chat')} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-100 transition-colors"><MessageCircle size={18} /></button>
                        </div>
                    </div>
                )}

                {/* Items List */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center space-x-2">
                        <ShoppingCart size={16} className="text-blue-600" />
                        <span className="text-xs font-black text-gray-800">服务与物料清单</span>
                    </div>
                    <div className="p-4 space-y-4">
                        {(order.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-800">
                                <div className="flex-1 min-w-0">
                                    <p className="truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">x{item.qty}</p>
                                </div>
                                <span className="ml-4">¥{item.price.toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-dashed border-gray-100 space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-bold">
                                <span>商品总额</span>
                                <span>¥{(order.priceEstimate.final || order.priceEstimate.min).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 font-bold">
                                <span>上门/人工费</span>
                                <span>¥{(order.priceEstimate.breakdown?.labor || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-sm font-black text-gray-900">实付款</span>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-red-600 tracking-tighter">¥{(order.priceEstimate.final || order.priceEstimate.min).toFixed(2)}</p>
                                    <p className="text-[10px] text-amber-600 font-black">下单可得 {order.pointsReward} 积分</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics/Info Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-start">
                        <MapPin size={18} className="text-gray-400 mr-3 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-black text-gray-800 mb-0.5">{order.clientName} 138****8000</p>
                            <p className="text-xs text-gray-500 font-bold leading-relaxed">{order.location.address}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Clock size={18} className="text-gray-400 mr-3 shrink-0" />
                        <p className="text-sm font-black text-gray-800">服务时间：{order.scheduledTime}</p>
                    </div>
                </div>

                {/* Order Footer Info */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-[11px] text-gray-400 font-bold space-y-2">
                    <div className="flex justify-between"><span>订单编号</span><span className="text-gray-800">{order.id}</span></div>
                    <div className="flex justify-between"><span>支付方式</span><span className="text-gray-800">微信支付</span></div>
                    <div className="flex justify-between"><span>下单时间</span><span className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</span></div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-3 flex justify-end items-center space-x-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-area-bottom z-50">
                {order.type === 'Checkup' && (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.PAID) && (
                    <>
                        <button
                            onClick={() => navigate(`/user/inspection/deep-report/${order.id}`)}
                            className="px-5 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[11px] font-black active:bg-blue-100"
                        >
                            深度检测报告
                        </button>
                        <button
                            onClick={() => navigate(`/user/inspection/report/${order.id}`)}
                            className="px-5 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-[11px] font-black active:bg-slate-100"
                        >
                            简版报告
                        </button>
                    </>
                )}
                <button className="px-5 py-2 border border-gray-200 text-gray-700 rounded-full text-[11px] font-black active:bg-gray-50">更多</button>
                <button onClick={() => navigate('/user/service-chat')} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-full text-[11px] font-black active:bg-gray-50">联系客服</button>
                {order.status === OrderStatus.COMPLETED && (
                    <button className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-full text-[11px] font-black shadow-lg shadow-yellow-200 active:scale-95 transition-all">评价</button>
                )}
            </div>
        </div>
    );
};
