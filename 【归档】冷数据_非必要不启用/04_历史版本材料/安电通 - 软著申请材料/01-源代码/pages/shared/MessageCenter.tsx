
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Bell, Package, Zap, Gift, 
    ChevronRight, Trash2, CheckCircle2, History,
    MessageSquare, Volume2, ShieldAlert, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessageCenter = () => {
    const navigate = useNavigate();
    const { messages, markAllMessagesRead } = useApp();
    const [activeTab, setActiveTab] = useState<'ALL' | 'ORDER' | 'SYSTEM'>('ALL');

    const filteredMessages = messages.filter(m => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'ORDER') return m.type === 'ORDER';
        if (activeTab === 'SYSTEM') return m.type === 'SYSTEM' || m.type === 'PROMO';
        return true;
    });

    const getIcon = (type: string) => {
        switch(type) {
            case 'ORDER': return { icon: Package, color: 'text-blue-500 bg-blue-50' };
            case 'SYSTEM': return { icon: ShieldAlert, color: 'text-orange-500 bg-orange-50' };
            case 'PROMO': return { icon: Sparkles, color: 'text-purple-500 bg-purple-50' };
            default: return { icon: Bell, color: 'text-gray-500 bg-gray-50' };
        }
    };

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-slate-800" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">消息通知</h1>
                </div>
                <button onClick={markAllMessagesRead} className="text-xs font-black text-slate-400 hover:text-slate-600">全标已读</button>
            </div>

            {/* Tabs */}
            <div className="bg-white flex p-1 rounded-2xl mx-4 my-4 shadow-sm border border-slate-100">
                {(['ALL', 'ORDER', 'SYSTEM'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        {tab === 'ALL' ? '全部' : (tab === 'ORDER' ? '订单更新' : '系统消息')}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-3 pb-24">
                {filteredMessages.length === 0 ? (
                    <div className="py-20 flex flex-col items-center opacity-20 grayscale">
                        <MessageSquare size={64} strokeWidth={1} />
                        <p className="mt-4 font-black">暂无消息</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => {
                        const { icon: Icon, color } = getIcon(msg.type);
                        return (
                            <div 
                                key={msg.id} 
                                onClick={() => msg.link && navigate(msg.link)}
                                className={`bg-white rounded-[1.8rem] p-5 shadow-sm border transition-all active:scale-[0.98] flex items-start space-x-4 ${!msg.read ? 'border-blue-200 bg-blue-50/10' : 'border-slate-100'}`}
                            >
                                <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-inner relative`}>
                                    <Icon size={20} />
                                    {!msg.read && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-slate-800 text-sm truncate">{msg.title}</h4>
                                        <span className="text-[9px] font-bold text-slate-400 shrink-0 ml-4">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
