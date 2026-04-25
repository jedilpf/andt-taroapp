
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ChevronRight, Search, Trash2, UserCheck, Zap } from 'lucide-react';

export const UserFavorites = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('masters');

    const mockMasters = [
        { id: 1, name: "王师傅", rating: 4.9, orders: 582, distance: "0.5km", avatar: "/assets/avatars/p1.png", tags: ["金牌电工", "党员"] },
        { id: 2, name: "张师傅", rating: 4.8, orders: 129, distance: "0.8km", avatar: "/assets/avatars/p2.png", tags: ["灯具安装"] }
    ];

    const mockServices = [
        { id: 101, title: "全屋用电安全公益检测", price: 0, tag: "官方补贴", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200" },
        { id: 102, title: "施耐德 1P+N 断路器更换", price: 128, tag: "惠民价", image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=200" }
    ];

    return (
        <div className="h-full bg-[#F5F5F5] flex flex-col">
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-gray-100 rounded-full"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-black text-gray-800">我的收藏</h1>
                </div>
                <div className="relative">
                    <Search size={20} className="text-gray-400" />
                </div>
            </div>

            <div className="bg-white flex px-4 border-b border-gray-50">
                {[
                    { id: 'masters', label: '电工师傅' },
                    { id: 'services', label: '服务/商品' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-black relative transition-all ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-1 left-6 right-6 h-1 bg-yellow-400 rounded-full"></div>}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {activeTab === 'masters' ? (
                    mockMasters.map(elec => (
                        <div key={elec.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3 active:scale-[0.99] transition-transform">
                            <img src={elec.avatar} className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-800 text-sm flex items-center">
                                    {elec.name} <UserCheck size={14} className="ml-1 text-blue-500"/>
                                </h3>
                                <div className="flex items-center text-[10px] text-gray-400 mt-1">
                                    <Star size={10} className="text-orange-500 fill-current mr-0.5"/> {elec.rating} 
                                    <span className="mx-2">|</span> 已服务 {elec.orders} 单
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {elec.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[8px] rounded font-bold border border-gray-100">{t}</span>)}
                                </div>
                            </div>
                            <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black">预约</button>
                        </div>
                    ))
                ) : (
                    mockServices.map(service => (
                        <div key={service.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex space-x-3 active:scale-[0.99] transition-transform">
                            <img src={service.image} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-black text-gray-800 text-sm leading-tight">{service.title}</h3>
                                    <span className="mt-1 inline-block px-1.5 py-0.5 bg-red-50 text-red-500 text-[8px] rounded font-black border border-red-100">{service.tag}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-red-500 font-black text-lg">¥{service.price}</p>
                                    <button className="p-1.5 text-gray-300 active:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
