
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';

export const AfterSalesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Apply' | 'Processing'>('Apply');

    // Mock Data for orders that can be disputed
    const eligibleOrders = [
        { id: 'o102', title: '客厅水晶吊灯安装', date: '2023-11-22', price: 150, status: '已完成' },
        { id: 'o103', title: '卫生间电路跳闸', date: '2023-11-20', price: 80, status: '已完成' },
    ];

    const processingClaims = [
        { id: 'c001', title: '插座面板松动', date: '2023-11-25', status: '审核中', desc: '安装后第二天发现面板松动' }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
            {/* Fixed Header with high z-index */}
            <div className="bg-white p-4 flex items-center space-x-3 shadow-sm shrink-0 z-[60] relative">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">售后维权</h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-0">
                {/* Guarantee Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative overflow-hidden shrink-0">
                    <div className="relative z-10">
                        <div className="flex items-center mb-2">
                            <ShieldCheck size={24} className="mr-2" />
                            <h2 className="text-xl font-bold">90天无忧质保</h2>
                        </div>
                        <p className="opacity-90 text-sm">维修后同一部位出现同样故障，平台免费返修。</p>
                    </div>
                    <ShieldCheck size={100} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
                </div>

                {/* Tabs - Sticky inside scroll view */}
                <div className="bg-white flex border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                    <button
                        onClick={() => setActiveTab('Apply')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Apply' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
                    >
                        申请售后
                    </button>
                    <button
                        onClick={() => setActiveTab('Processing')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Processing' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
                    >
                        处理进度
                    </button>
                </div>

                <div className="p-4 space-y-4 pb-20">
                    {activeTab === 'Apply' ? (
                        eligibleOrders.length > 0 ? (
                            eligibleOrders.map(order => (
                                <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800">{order.title}</h3>
                                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded font-medium">{order.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">完工时间：{order.date} • 实付 ¥{order.price}</p>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => window.dispatchEvent(new Event('open-support'))}
                                            className="px-4 py-1.5 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold bg-orange-50 active:scale-95 transition-transform"
                                        >
                                            申请售后
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={24} className="text-gray-400"/>
                                </div>
                                <p className="text-gray-400 text-sm">暂无符合条件的订单</p>
                            </div>
                        )
                    ) : (
                        processingClaims.length > 0 ? (
                            processingClaims.map(claim => (
                                <div key={claim.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-gray-800">{claim.title}</h3>
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{claim.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-3">{claim.desc}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>申请时间：{claim.date}</span>
                                        <button className="flex items-center text-gray-600 font-medium">
                                            查看详情 <ChevronRight size={12}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ShieldCheck size={24} className="text-gray-400"/>
                                </div>
                                <p className="text-gray-400 text-sm">暂无处理中的申请</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
