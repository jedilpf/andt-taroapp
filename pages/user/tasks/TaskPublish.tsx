
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, X, DollarSign, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AddressSelector } from '../../../components/user/UserShared';
import { Location, TaskStatus } from '../../../types';

export const TaskPublish = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [location, setLocation] = useState<Location | null>(currentUser?.location || null);
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImages(prev => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !description || !reward || !location) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // In a real app, we would post to API and get the ID back
            // For now, we just navigate to the list
            navigate('/user/tasks', { replace: true });
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-[#F5F7FA]">
            {/* Header */}
            <div className="sticky top-0 z-50 pt-safe bg-white/80 backdrop-blur-md border-b border-gray-50/50">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="font-black text-lg text-gray-900">发布需求</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-32">

                {/* Title & Desc */}
                <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-50 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="需求标题 (例如: 卧室灯泡更换)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-lg font-black text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
                        />
                    </div>
                    <div className="h-[1px] bg-gray-50 w-full"></div>
                    <div>
                        <textarea
                            placeholder="请描述具体需求、故障现象或特殊要求..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none bg-transparent resize-none leading-relaxed"
                        />
                    </div>

                    {/* Image Upload Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 active:scale-90 transition-transform"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {images.length < 4 && (
                            <label className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-200 text-gray-400 active:bg-gray-100 transition-colors cursor-pointer">
                                <Camera size={24} className="mb-1" />
                                <span className="text-[10px] font-bold">添加图片</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Reward & Location */}
                <div className="bg-white rounded-[1.5rem] p-1 shadow-sm border border-gray-50">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center text-gray-800">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-3">
                                <DollarSign size={18} />
                            </div>
                            <span className="font-bold text-sm">悬赏金额</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 mr-1">¥</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={reward}
                                onChange={(e) => setReward(e.target.value)}
                                className="w-20 text-right font-black text-lg outline-none placeholder:text-gray-300 text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="mx-4 h-[1px] bg-gray-50"></div>

                    <button
                        onClick={() => setShowAddressSelector(true)}
                        className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors rounded-b-[1.5rem]"
                    >
                        <div className="flex items-center text-gray-800">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-3">
                                <MapPin size={18} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-sm block">服务地址</span>
                                {location ? (
                                    <span className="text-xs text-gray-500 font-medium truncate max-w-[200px] block mt-0.5">
                                        {location.address}
                                    </span>
                                ) : (
                                    <span className="text-xs text-red-400 font-bold mt-0.5">请选择地址</span>
                                )}
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                </div>

                {/* Warning */}
                <div className="flex items-start bg-orange-50 p-4 rounded-xl border border-orange-100/50">
                    <AlertCircle size={16} className="text-orange-500 mt-0.5 mr-2 shrink-0" />
                    <p className="text-xs text-orange-700 leading-relaxed font-medium">
                        为了保障您的权益，请勿在平台外私下交易。接单前建议详细沟通确认需求细节。
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-50 pb-safe z-40 max-w-md mx-auto">
                <button
                    onClick={handleSubmit}
                    disabled={!title || !description || !reward || !location || isSubmitting}
                    className="w-full py-4 bg-slate-900 text-white rounded-[1.25rem] font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
                >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : '立即发布需求'}
                </button>
            </div>

            {showAddressSelector && (
                <AddressSelector
                    onClose={() => setShowAddressSelector(false)}
                    onSelect={(loc) => { setLocation(loc); setShowAddressSelector(false); }}
                />
            )}
        </div>
    );
};
