
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    Zap, Wrench, MapPin, Clock, MessageSquare,
    ChevronRight, ArrowLeft, MoreHorizontal, PackageCheck, Coins,
    Search, Headphones, Store, Filter, RefreshCcw, X, Phone, Trash2, HelpCircle, CheckCircle, Loader2, AlertCircle, Info
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

// --- “更多操作” 底部抽屉组件 ---
const OrderActionSheet = ({ order, onClose, onDelete, onContact, onFeedback }: {
    order: any,
    onClose: () => void,
    onDelete: (id: string) => void,
    onContact: (order: any) => void,
    onFeedback: (order: any) => void
}) => {
    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-[430px] bg-white rounded-t-[2.5rem] p-6 animate-slide-up pointer-events-auto relative z-10 pb-safe shadow-2xl">
                <div className="w-10 h-1 bg-gray-100 rounded-full mx-auto mb-6"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-800">更多操作</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full active:scale-90 transition-transform"><X size={18} className="text-gray-400" /></button>
                </div>
                <div className="space-y-3 pb-4">
                    <button onClick={() => { onContact(order); onClose(); }} className="w-full p-4 flex items-center bg-[#F8FAFC] rounded-2xl active:bg-gray-100 transition-colors border border-gray-50">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4"><Phone size={20} /></div>
                        <span className="font-black text-gray-700">联系服务师傅</span>
                    </button>
                    <button onClick={() => { onFeedback(order); onClose(); }} className="w-full p-4 flex items-center bg-[#F8FAFC] rounded-2xl active:bg-gray-100 transition-colors border border-gray-50">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mr-4"><HelpCircle size={20} /></div>
                        <span className="font-black text-gray-700">订单故障反馈</span>
                    </button>
                    {(order.status === OrderStatus.CANCELLED || order.status === OrderStatus.COMPLETED) && (
                        <button onClick={() => { onDelete(order.id); onClose(); }} className="w-full p-4 flex items-center bg-red-50/50 rounded-2xl active:bg-red-50 transition-colors border border-red-50">
                            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mr-4"><Trash2 size={20} /></div>
                            <span className="font-black text-red-500">删除此订单</span>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 删除确认弹窗 ---
const DeleteConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onCancel}></div>
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs relative z-10 animate-scale-in text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} /></div>
                <h3 className="text-xl font-black text-gray-900 mb-2">确认删除？</h3>
                <p className="text-gray-400 text-sm font-medium mb-8">订单删除后将无法恢复，相关积分记录将保留在积分中心。</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold active:scale-95 transition-transform">取消</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform">删除</button>
                </div>
            </div>
        </div>,
        document.body
    )
);

// --- 收货成功反馈弹窗 ---
const SuccessModal = ({ points, onClose }: { points: number, onClose: () => void }) => (
    createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"></div>
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs relative z-10 animate-scale-in text-center shadow-2xl border border-white/20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">服务确认成功</h3>
                <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">感谢您的信任，本次服务赠送积分已发放至账户</p>
                <div className="bg-amber-50 rounded-2xl p-4 flex items-center justify-center mb-8 border border-amber-100 animate-pulse">
                    <Coins size={20} className="text-amber-500 mr-2" />
                    <span className="text-lg font-black text-amber-700">+{points} 积分</span>
                </div>
                <button onClick={onClose} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform">知道了</button>
            </div>
        </div>,
        document.body
    )
);

export const Orders = () => {
    const { currentUser, orders, updateOrder, earnPoints } = useApp();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [activeTab, setActiveTab] = useState(state?.initialTab || '全部');
    const [selectedOrderForMore, setSelectedOrderForMore] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState<number | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);

    const tabs = ['全部', '待付款', '待收货/使用', '待评价', '退款/售后'];

    const displayOrders = orders.filter(o => {
        if (hiddenIds.includes(o.id)) return false;
        if (o.clientId !== currentUser?.id) return false;
        if (activeTab === '全部') return true;
        if (activeTab === '待付款') return false;
        if (activeTab === '待收货/使用') return [OrderStatus.PAID, OrderStatus.IN_PROGRESS, OrderStatus.ACCEPTED, OrderStatus.ARRIVED].includes(o.status);
        if (activeTab === '待评价') return o.status === OrderStatus.COMPLETED;
        if (activeTab === '退款/售后') return o.status === OrderStatus.CANCELLED;
        return false;
    });

    const handleContactMechanic = (order: any) => {
        window.location.href = `tel:4008889527`;
    };

    const handleFeedback = (order: any) => {
        navigate('/user/service-chat', { state: { orderId: order.id } });
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            setHiddenIds(prev => [...prev, deleteTargetId]);
            setDeleteTargetId(null);
        }
    };

    const handleConfirmReceipt = (e: React.MouseEvent, order: any) => {
        e.stopPropagation();
        setLoadingId(order.id);
        setTimeout(() => {
            updateOrder(order.id, { status: OrderStatus.COMPLETED });
            earnPoints(order.pointsReward || 0);
            setLoadingId(null);
            setShowSuccess(order.pointsReward || 0);
        }, 800);
    };

    const handleReorder = (e: React.MouseEvent, order: any) => {
        e.stopPropagation();
        if (order.type === 'Install') navigate('/user/install');
        else navigate('/user/repair');
    };

    return (
        <div className="h-full bg-[#F5F5F5] flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50 pt-safe">
                <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                        <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 text-gray-800"><ArrowLeft size={24} /></button>
                        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3 py-1.5 border border-gray-200/50">
                            <Search size={14} className="text-gray-400 mr-2" /><input type="text" placeholder="搜索我的订单" className="bg-transparent text-xs outline-none w-full font-medium" />
                        </div>
                    </div>
                    <div className="flex items-center ml-2 space-x-2">
                        <button className="flex flex-col items-center"><Filter size={18} className="text-gray-600" /><span className="text-[8px] font-bold">筛选</span></button>
                        <button onClick={() => navigate('/user/service-chat')} className="flex flex-col items-center"><Headphones size={18} className="text-gray-600" /><span className="text-[8px] font-bold">客服</span></button>
                    </div>
                </div>
                <div className="flex px-4 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-3 text-[13px] font-black relative transition-all ${activeTab === tab ? 'text-gray-900' : 'text-gray-400'}`}>
                            {tab}{activeTab === tab && <div className="absolute bottom-1 left-4 right-4 h-1 bg-yellow-400 rounded-full"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* List - 重构卡片布局 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 no-scrollbar">
                {displayOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 active:scale-[0.99] transition-all" onClick={() => navigate(`/user/order/${order.id}`)}>
                        {/* 顶部：店铺名称与订单状态 */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                                <div className="p-1 bg-yellow-400 rounded-md shrink-0"><Store size={12} className="text-gray-900 fill-current" /></div>
                                <h3 className="text-[13px] font-black text-gray-900 flex items-center truncate max-w-[180px]">{order.title} <ChevronRight size={14} className="text-gray-300 ml-0.5" /></h3>
                            </div>
                            <span className={`text-[11px] font-bold ${order.status === OrderStatus.COMPLETED ? 'text-orange-500' : order.status === OrderStatus.PAID ? 'text-blue-500' : 'text-gray-400'}`}>
                                {order.status === OrderStatus.COMPLETED ? '待评价' : order.status === OrderStatus.PAID ? '待收货' : order.status === OrderStatus.CANCELLED ? '已取消' : '进行中'}
                            </span>
                        </div>

                        {/* 中间：紧凑型左图右文布局 */}
                        <div className="flex space-x-3 mb-3">
                            {/* 固定大小的缩略图 */}
                            <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0 shadow-inner">
                                <img src={order.images?.[0]} className="w-full h-full object-cover" alt="" />
                            </div>

                            {/* 右侧文字信息 */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div className="min-w-0">
                                    <h4 className="text-[13px] font-black text-gray-800 line-clamp-1 leading-snug">{order.items?.map((it: any) => it.name).join(' · ') || '电力服务'}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1 truncate">订单编号：{order.id}</p>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center">
                                        <span className="text-[10px] text-gray-400 font-bold">共{order.items?.length || 1}件服务</span>
                                        {(order.pointsReward || 0) > 0 && (
                                            <div className="ml-2 inline-flex items-center text-[9px] text-amber-600 font-black bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                                +{order.pointsReward}积分
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-baseline text-gray-900">
                                        <span className="text-[10px] font-black mr-0.5">¥</span>
                                        <span className="text-lg font-black tracking-tighter">{(order.priceEstimate.final || order.priceEstimate.min).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 底部：操作按钮栏 */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                            <button onClick={(e) => { e.stopPropagation(); setSelectedOrderForMore(order); }} className="text-gray-300 p-2 -ml-2 active:text-gray-900 transition-colors"><MoreHorizontal size={20} /></button>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-end pl-2">
                                {order.status === OrderStatus.COMPLETED && (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); navigate('/user/welfare'); }} className="px-3 py-1.5 border border-gray-100 text-gray-700 rounded-full text-[11px] font-black active:bg-gray-50 bg-white whitespace-nowrap">领神券</button>
                                        <button onClick={(e) => { e.stopPropagation(); alert('评价入口'); }} className="px-3 py-1.5 border border-gray-100 text-gray-700 rounded-full text-[11px] font-black active:bg-gray-50 bg-white whitespace-nowrap">评价</button>
                                        <button onClick={(e) => handleReorder(e, order)} className="px-3 py-1.5 bg-white border border-orange-200 text-orange-600 rounded-full text-[11px] font-black active:bg-orange-50 flex items-center shadow-sm whitespace-nowrap"><RefreshCcw size={10} className="mr-1" /> 再来一单</button>
                                    </>
                                )}
                                {order.status === OrderStatus.PAID && (
                                    <button onClick={(e) => handleConfirmReceipt(e, order)} disabled={loadingId === order.id} className="px-6 py-1.5 bg-gray-900 text-white rounded-full text-[11px] font-black flex items-center shadow-lg active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap">
                                        {loadingId === order.id ? <Loader2 size={12} className="animate-spin mr-2" /> : <PackageCheck size={12} className="mr-1.5" />}确认收货
                                    </button>
                                )}
                                {order.type === 'Checkup' && (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.PAID) && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/user/inspection/deep-report/${order.id}`); }}
                                        className="px-3 py-1.5 border-2 border-blue-500 text-blue-600 rounded-full text-[11px] font-black active:bg-blue-50 transition-colors whitespace-nowrap bg-white"
                                    >
                                        查看检测报告
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOrderForMore && (
                <OrderActionSheet
                    order={selectedOrderForMore}
                    onClose={() => setSelectedOrderForMore(null)}
                    onDelete={(id) => setDeleteTargetId(id)}
                    onContact={handleContactMechanic}
                    onFeedback={handleFeedback}
                />
            )}
            {deleteTargetId && <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setDeleteTargetId(null)} />}
            {showSuccess !== null && <SuccessModal points={showSuccess} onClose={() => setShowSuccess(null)} />}
        </div>
    );
};
