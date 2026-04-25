import React, { useState } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Filter } from 'lucide-react';

interface CategoryPageProps {
    category: any;
    onBack: () => void;
    onProductSelect: (product: any) => void;
}

const SupermarketCategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onProductSelect }) => {
    const activeCat = category || { name: '粮油调味' };
    const [subCat, setSubCat] = useState(0);

    const subCats = ['全部', '食用油', '大米', '面粉', '调味品', '方便食品', '烘焙原料'];

    // Diverse Mock Data
    const products = [
        {
            id: 1,
            title: '金龙鱼 黄金比例调和油 1.8L 非转基因食用油',
            price: '29.9',
            original: '45.0',
            tags: ['满99减10', '多买优惠'],
            img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
            sales: '10万+'
        },
        {
            id: 2,
            title: '十月稻田 长粒香大米 5kg 东北大米',
            price: '39.9',
            original: '59.0',
            tags: ['爆款', '自营'],
            img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            sales: '5000+'
        },
        {
            id: 3,
            title: '海天 上等蚝油 700g 挤挤装',
            price: '9.9',
            original: '12.9',
            tags: ['第2件半价'],
            img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400',
            sales: '20万+'
        },
        {
            id: 4,
            title: '安电自营 抽纸 3层120抽*20包 整箱',
            price: '29.9',
            original: '39.9',
            tags: ['囤货首选'],
            img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400',
            sales: '100万+'
        },
        {
            id: 5,
            title: '可口可乐 摩登罐 330ml*24罐 汽水饮料',
            price: '45.0',
            original: '55.0',
            tags: ['快乐肥宅水'],
            img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
            sales: '5万+'
        },
        {
            id: 6,
            title: '乐事 薯片 70g*5包 组合装',
            price: '19.9',
            original: '25.0',
            tags: ['解馋零食'],
            img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
            sales: '8000+'
        }
    ];

    return (
        <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-fade-in text-slate-800">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-10 pt-safe">
                <div className="flex items-center px-3 py-2 space-x-3">
                    <button onClick={onBack} className="p-1 -ml-1 text-slate-700 active:opacity-50">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 flex items-center px-3">
                        <Search size={14} className="text-slate-400 mr-2" />
                        <span className="text-xs text-slate-400">在 {activeCat.name} 中搜索</span>
                    </div>
                    <button className="p-1">
                        <Filter size={20} className="text-slate-700" />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-22 bg-slate-50 h-full overflow-y-auto no-scrollbar shrink-0">
                    {subCats.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setSubCat(i)}
                            className={`h-12 flex items-center justify-center text-xs font-medium relative transition-colors cursor-pointer ${i === subCat ? 'bg-white text-red-600 font-bold' : 'text-slate-500'}`}
                        >
                            {i === subCat && <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-600 rounded-r-full"></div>}
                            {item}
                        </div>
                    ))}
                </div>

                {/* Right Product List */}
                <div className="flex-1 h-full overflow-y-auto no-scrollbar p-3 space-y-3">
                    {/* Banner */}
                    <div className="w-full h-24 bg-green-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative shadow-sm">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-green-800 shadow-sm border border-green-100">
                            {activeCat.name} · 超级品类日
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-sm text-slate-800">{subCats[subCat]}</h3>
                        <span className="text-[10px] text-slate-400">综合排序</span>
                    </div>

                    {/* Products */}
                    {products.map((item) => (
                        <div key={item.id} onClick={() => onProductSelect(item)} className="flex bg-white py-3 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-28 h-28 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 p-2">
                                <img
                                    src={item.img}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt={item.title}
                                />
                            </div>
                            <div className="ml-3 flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2 leading-relaxed">{item.title}</h4>
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                        {item.tags.map((tag, t) => (
                                            <span key={t} className="text-[9px] border border-red-200 text-red-500 px-1 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400">已售 {item.sales}</span>
                                        <div className="text-red-600 font-black text-lg leading-none mt-1">
                                            <span className="text-xs">¥</span>{item.price}
                                            <span className="text-xs text-slate-400 font-normal line-through ml-1 decoration-slate-300">¥{item.original}</span>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onProductSelect(item); }} className="w-8 h-8 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full flex items-center justify-center active:scale-90 shadow-lg shadow-red-100 transition-transform">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="h-10 text-center text-xs text-slate-300 pt-6 pb-12 flex items-center justify-center">
                        <span className="w-8 h-px bg-slate-200 mr-2"></span>
                        已经到底啦
                        <span className="w-8 h-px bg-slate-200 ml-2"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupermarketCategoryPage;
