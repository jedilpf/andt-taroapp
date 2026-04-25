
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Share2, MoreHorizontal, AlertCircle, CheckCircle, User, Phone, X } from 'lucide-react';
import { TaskStatus } from '../../../types';

// Mock Data (Should match List for consistency in demo)
const MOCK_TASK_DETAIL = {
    id: 1,
    title: "卧室插座更换",
    description: "家里卧室的插座接触不良，需要更换一个新的。请自带工具和配件。最好是公牛牌的。",
    reward: 50.00,
    status: TaskStatus.PENDING,
    publisherId: 1,
    publisherName: "Current User",
    address: "上海市徐汇区天钥桥路100号 3号楼 402室",
    images: ["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"],
    createTime: "2026-01-27 10:00:00",
    candidates: [] // Future: List of electricians who applied
};

export const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(MOCK_TASK_DETAIL);
    const [showActionMenu, setShowActionMenu] = useState(false);

    // Mock Cancel
    const handleCancel = () => {
        setTask(prev => ({ ...prev, status: TaskStatus.CANCELLED }));
        setShowActionMenu(false);
    };

    // Timeline steps based on status
    const steps = [
        { status: TaskStatus.PENDING, label: '已发布', time: task.createTime },
        { status: TaskStatus.ACCEPTED, label: '师傅接单', time: '' },
        { status: TaskStatus.COMPLETED, label: '已完成', time: '' }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === task.status);
    const displayStepIndex = currentStepIndex === -1 ? (task.status === TaskStatus.CANCELLED ? 0 : 0) : currentStepIndex;


    return (
        <div className="h-full flex flex-col bg-[#F5F7FA] relative">
            {/* Header */}
            <div className="sticky top-0 z-50 pt-safe bg-white/80 backdrop-blur-md">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="font-black text-lg text-gray-900">需求详情</h1>
                    <button onClick={() => setShowActionMenu(true)} className="p-2 -mr-2 text-gray-900 active:scale-90 transition-transform">
                        <MoreHorizontal size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Status Card */}
                <div className="bg-white p-6 pb-8 mb-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-1">
                                {task.status === TaskStatus.PENDING ? '等待接单' :
                                    task.status === TaskStatus.ACCEPTED ? '师傅赶往中' :
                                        task.status === TaskStatus.COMPLETED ? '服务已完成' : '已取消'}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">
                                {task.status === TaskStatus.PENDING ? '正在为您通知附近师傅...' : ''}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.status === TaskStatus.PENDING ? 'bg-orange-100 text-orange-600' :
                                task.status === TaskStatus.CANCELLED ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'
                            }`}>
                            <Clock size={24} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between relative px-2">
                        {/* Line */}
                        <div className="absolute left-4 right-4 top-2.5 h-0.5 bg-gray-100 -z-0"></div>
                        <div className={`absolute left-4 top-2.5 h-0.5 bg-green-500 -z-0 transition-all duration-500`} style={{ width: `${displayStepIndex * 50}%` }}></div>

                        {steps.map((step, idx) => {
                            const isCompleted = idx <= displayStepIndex && task.status !== TaskStatus.CANCELLED;
                            return (
                                <div key={idx} className="flex flex-col items-center relative z-10 bg-white px-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${isCompleted ? 'border-green-500 bg-white' : 'border-gray-200 bg-white'
                                        }`}>
                                        {isCompleted && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                                    </div>
                                    <span className={`text-[10px] font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-4 space-y-4">
                    {/* Main Info */}
                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-black text-gray-900 leading-snug flex-1 mr-4">{task.title}</h3>
                            <div className="flex items-baseline text-orange-600">
                                <span className="text-xs font-bold mr-0.5">¥</span>
                                <span className="text-2xl font-black">{task.reward}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{task.description}</p>

                        {task.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {task.images.map((img, i) => (
                                    <img key={i} src={img} className="w-full aspect-square object-cover rounded-xl bg-gray-50" alt="" />
                                ))}
                            </div>
                        )}

                        <div className="h-[1px] bg-gray-50 w-full my-4"></div>

                        <div className="space-y-3">
                            <div className="flex items-start text-gray-500 text-sm">
                                <MapPin size={16} className="mr-3 mt-1 shrink-0" />
                                <span className="font-medium text-gray-700">{task.address}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                                <Clock size={16} className="mr-3 shrink-0" />
                                <span className="font-medium">{task.createTime} 发布</span>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Section (Placeholder) */}
                    {task.status === TaskStatus.PENDING && (
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[1.5rem] p-5 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-lg mb-1">正在通知附近师傅</h4>
                                    <p className="text-blue-100 text-xs font-medium">预计 10 分钟内会有师傅接单，请耐心等待</p>
                                </div>
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-spin-slow">
                                    <Share2 size={20} />
                                </div>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 animate-pulse"></div>
                        </div>
                    )}

                    {/* Safety Tip */}
                    <div className="flex items-start p-4 text-gray-400 text-xs leading-relaxed justify-center text-center">
                        <AlertCircle size={14} className="mr-1.5 mt-0.5 shrink-0" />
                        <span>如遇紧急情况或纠纷，请拨打客服电话 <span className="text-blue-500 border-b border-blue-200">400-888-9527</span></span>
                    </div>
                </div>
            </div>

            {/* Action Menu Sheet */}
            {showActionMenu && (
                <div className="fixed inset-0 z-[1000] flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={() => setShowActionMenu(false)}></div>
                    <div className="w-full max-w-md bg-white rounded-t-[2.5rem] p-6 animate-slide-up relative z-10 pb-safe">
                        <div className="w-10 h-1 bg-gray-100 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-lg font-black text-gray-900 mb-4 px-2">管理需求</h3>
                        <div className="space-y-3">
                            {task.status === TaskStatus.PENDING && (
                                <button
                                    onClick={handleCancel}
                                    className="w-full p-4 flex items-center bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center mr-4">
                                        <X size={20} />
                                    </div>
                                    <span className="font-black text-gray-700">取消需求</span>
                                </button>
                            )}
                            <button className="w-full p-4 flex items-center bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mr-4">
                                    <Share2 size={20} />
                                </div>
                                <span className="font-black text-gray-700">分享给朋友</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowActionMenu(false)}
                            className="w-full py-4 mt-6 bg-white border border-gray-100 text-gray-500 rounded-2xl font-bold active:bg-gray-50"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
