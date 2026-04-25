
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Plus, Clock, MapPin, DollarSign, ChevronRight, Inbox } from 'lucide-react';
import { Task, TaskStatus } from '../../../types';

// Mock Data
const MOCK_TASKS = [
    {
        id: 1,
        title: "卧室插座更换",
        description: "家里卧室的插座接触不良，需要更换一个新的。",
        reward: 50.00,
        status: TaskStatus.PENDING,
        publisherId: 1,
        publisherName: "Current User",
        address: "上海市徐汇区天钥桥路100号",
        images: ["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=300&q=80"],
        createTime: "2026-01-27 10:00:00"
    },
    {
        id: 2,
        title: "全屋电路检修",
        description: "最近总跳闸，需要排查一下线路问题。",
        reward: 120.00,
        status: TaskStatus.ACCEPTED,
        publisherId: 1,
        publisherName: "Current User",
        address: "上海市徐汇区天钥桥路100号",
        images: [],
        createTime: "2026-01-26 14:30:00"
    },
    {
        id: 3,
        title: "安装吸顶灯",
        description: "客厅新买的水晶灯需要安装。",
        reward: 80.00,
        status: TaskStatus.COMPLETED,
        publisherId: 1,
        publisherName: "Current User",
        address: "上海市徐汇区天钥桥路100号",
        images: ["https://images.unsplash.com/photo-1513506003013-680c38598a95?auto=format&fit=crop&w=300&q=80"],
        createTime: "2026-01-20 09:00:00"
    }
];

export const TaskList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'Processing' | 'DONE'>('ALL');

    const tabs = [
        { id: 'ALL', label: '全部' },
        { id: 'PENDING', label: '待接单' },
        { id: 'Processing', label: '进行中' }, // Grouped Accepted/InProgress
        { id: 'DONE', label: '已完成' }, // Grouped Completed/Cancelled
    ];

    const getStatusLabel = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.PENDING: return { text: '待接单', color: 'text-orange-500 bg-orange-50' };
            case TaskStatus.ACCEPTED: return { text: '已接单', color: 'text-blue-500 bg-blue-50' };
            case TaskStatus.COMPLETED: return { text: '已完成', color: 'text-green-500 bg-green-50' };
            case TaskStatus.CANCELLED: return { text: '已取消', color: 'text-gray-400 bg-gray-100' };
            default: return { text: status, color: 'text-gray-500' };
        }
    };

    const filteredTasks = MOCK_TASKS.filter(task => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return task.status === TaskStatus.PENDING;
        if (activeTab === 'Processing') return [TaskStatus.ACCEPTED].includes(task.status);
        if (activeTab === 'DONE') return [TaskStatus.COMPLETED, TaskStatus.CANCELLED].includes(task.status);
        return false;
    });

    return (
        <div className="h-full flex flex-col bg-[#F5F7FA]">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 pt-safe">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate('/user/home')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div className="flex-1 mx-4 bg-gray-100/80 rounded-full flex items-center px-4 py-2 border border-gray-200/50">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input type="text" placeholder="搜索我的需求" className="bg-transparent text-sm outline-none w-full font-medium text-gray-700" />
                    </div>
                    <button onClick={() => navigate('/user/task-publish')} className="p-2 -mr-2 text-gray-900 active:scale-90 transition-transform">
                        <Plus size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-2 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`whitespace-nowrap px-4 py-3 text-[13px] font-black relative transition-all ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-full"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3 pb-24">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => {
                        const statusStyle = getStatusLabel(task.status);
                        return (
                            <div
                                key={task.id}
                                onClick={() => navigate(`/user/task/${task.id}`)}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 active:scale-[0.99] transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-sm font-black text-gray-900 line-clamp-1 flex-1 mr-2">{task.title}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusStyle.color}`}>
                                        {statusStyle.text}
                                    </span>
                                </div>

                                <div className="flex space-x-3">
                                    {task.images.length > 0 ? (
                                        <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                                            <img src={task.images[0]} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                            <Inbox size={24} className="text-gray-300" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{task.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-400 text-xs">
                                                <Clock size={12} className="mr-1" />
                                                <span className="scale-90 origin-left">{task.createTime.split(' ')[0]}</span>
                                            </div>
                                            <span className="text-lg font-black text-gray-900 flex items-baseline">
                                                <span className="text-xs mr-0.5">¥</span>{task.reward}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Inbox size={40} className="text-gray-300" />
                        </div>
                        <p className="font-bold text-sm">暂无相关需求</p>
                        <button
                            onClick={() => navigate('/user/task-publish')}
                            className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-bold shadow-lg shadow-gray-200"
                        >
                            发布新需求
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
