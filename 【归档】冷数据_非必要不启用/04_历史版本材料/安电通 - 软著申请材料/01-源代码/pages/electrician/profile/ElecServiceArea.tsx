
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Sliders, Plus, Save } from 'lucide-react';

export const ElecServiceArea = () => {
    const navigate = useNavigate();
    const [radius, setRadius] = useState(5);

    return (
        <div className="min-h-full pb-10">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">服务区域设置</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Map Preview Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-2xl relative overflow-hidden border border-gray-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-32 h-32 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center animate-pulse">
                             <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                         </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                        上海市 · 静安区
                    </div>
                </div>

                {/* Radius Slider */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center"><Target size={18} className="mr-2 text-blue-600"/> 服务半径</h3>
                        <span className="text-blue-600 font-bold text-lg">{radius} km</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        step="1"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1km</span>
                        <span>10km</span>
                        <span>20km</span>
                    </div>
                </div>

                {/* District Settings */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Sliders size={18} className="mr-2 text-gray-400"/> 偏好区域</h3>
                     <div className="flex flex-wrap gap-2">
                         {['黄浦区', '静安区', '徐汇区', '长宁区', '浦东新区'].map(area => (
                             <button key={area} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-colors">
                                 {area}
                             </button>
                         ))}
                         <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-lg text-sm flex items-center">
                             <Plus size={14} className="mr-1"/> 添加
                         </button>
                     </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t safe-area-bottom">
                <button onClick={() => navigate(-1)} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center">
                    <Save size={18} className="mr-2"/> 保存设置
                </button>
            </div>
        </div>
    );
}
