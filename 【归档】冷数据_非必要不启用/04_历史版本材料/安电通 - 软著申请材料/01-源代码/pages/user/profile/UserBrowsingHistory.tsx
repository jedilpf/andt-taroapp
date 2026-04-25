
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Trash2, Clock, MapPin, ChevronRight } from 'lucide-react';

export const UserBrowsingHistory = () => {
    const navigate = useNavigate();

    const historyItems = [
        { date: '今天', items: [
            { id: 1, title: '王师傅', sub: '精修电路 · 距您0.5km', image: '/assets/avatars/p1.png', time: '14:20' },
            { id: 102, title: '施耐德 1P+N 断路器', sub: '民生补贴商品', image: 'https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=100', time: '10:15' }
        ]},
        { date: '昨天', items: [
            { id: 101, title: '社区公益安检', sub: '徐汇区全额补贴活动', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100', time: '18:30' }
        ]}
    ];

    return (
        <div className="h-full bg-white flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-gray-50 shrink-0">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-gray-100 rounded-full"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-black text-gray-800">浏览记录</h1>
                </div>
                <button className="text-gray-400 p-2"><Trash2 size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {historyItems.map((group, i) => (
                    <div key={i}>
                        <div className="px-4 py-3 bg-gray-50/50 flex items-center text-xs font-black text-gray-400 sticky top-0 backdrop-blur-md">
                            <Clock size={12} className="mr-1.5"/> {group.date}
                        </div>
                        <div className="divide-y divide-gray-50">
                            {group.items.map(item => (
                                <div key={item.id} className="p-4 flex items-center space-x-4 active:bg-gray-50 transition-colors">
                                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-50 shadow-inner" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black text-gray-800 text-sm truncate pr-2">{item.title}</h3>
                                            <span className="text-[9px] text-gray-300 font-bold">{item.time}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-medium mt-1 truncate">{item.sub}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="py-20 text-center opacity-10 font-black text-[10px] tracking-[0.5em] uppercase">
                    End of Records
                </div>
            </div>
        </div>
    );
};
