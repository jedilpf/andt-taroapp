
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, Plus } from 'lucide-react';

export const ElecSkills = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([
        { id: 1, name: '电路检修', selected: true },
        { id: 2, name: '灯具安装', selected: true },
        { id: 3, name: '开关插座', selected: true },
        { id: 4, name: '弱电布线', selected: true },
        { id: 5, name: '智能家居', selected: false },
        { id: 6, name: '监控安装', selected: false },
    ]);

    const toggleSkill = (id: number) => {
        setSkills(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
    };

    return (
        <div className="min-h-full pb-10">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">技能与证书</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Certification Status */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
                    <div>
                        <h2 className="font-bold text-lg flex items-center"><Award size={20} className="mr-2"/> 已认证：高级电工</h2>
                        <p className="text-xs opacity-90 mt-1">证书编号：1234****5678</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle size={24}/>
                    </div>
                </div>

                {/* Skills Grid */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">接单技能 (可多选)</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {skills.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => toggleSkill(s.id)}
                                className={`py-3 rounded-xl text-sm font-bold border transition-all ${s.selected ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Certificates */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">证书管理</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[4/3] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=150&fit=crop" className="w-full h-full object-cover rounded-2xl opacity-80" alt="Cert"/>
                        </div>
                         <button className="aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-all">
                            <Plus size={24} className="mb-2"/>
                            <span className="text-xs">上传新证书</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t safe-area-bottom">
                <button onClick={() => navigate(-1)} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                    保存修改
                </button>
            </div>
        </div>
    );
}
