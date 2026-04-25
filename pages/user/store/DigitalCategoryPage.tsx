import React, { useState } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Filter } from 'lucide-react';

interface CategoryPageProps {
    category: any;
    onBack: () => void;
    onProductSelect: (product: any) => void;
}

const DigitalCategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onProductSelect }) => {
    const activeCat = category || { name: '手机数码' };
    const [subCat, setSubCat] = useState(0);

    const subCats = ['全部', '手机', '摄影', '影音', '智能', '办公', '配件'];

    // Digital Mock Data
    const products = [
        {
            id: 11,
            title: 'Apple iPhone 15 Pro Max 256GB 黑色钛金属',
            price: '9999',
            original: '12999',
            tags: ['百亿补贴', '12期免息'],
            img: '/assets/store/hero_mobile.png', // Fallback or reuse existing abstract asset
            sales: '10万+'
        },
        {
            id: 12,
            title: 'Sony/索尼 WH-1000XM5 头戴式降噪耳机',
            price: '2499',
            original: '2999',
            tags: ['新品', '音质天花板'],
            img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
            sales: '2万+'
        },
        {
            id: 13,
            title: 'Nintendo Switch OLED 游戏机 日版',
            price: '1899',
            original: '2599',
            tags: ['好价', '现货'],
            img: 'https://images.unsplash.com/photo-1578303512597-8147061c23a6?w=400',
            sales: '50万+'
        },
        {
            id: 14,
            title: 'DJI 大疆 Mini 4 Pro 无人机 入门套装',
            price: '4788',
            original: '4988',
            tags: ['航拍神器'],
            img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
            sales: '1万+'
        },
        {
            id: 15,
            title: 'Keychron Q1 Pro 机械键盘 蓝牙双模',
            price: '998',
            original: '1200',
            tags: ['客制化', '全铝'],
            img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
            sales: '5000+'
        },
        {
            id: 16,
            title: 'MacBook Air M3芯片 13.6英寸 午夜色',
            price: '8999',
            original: '9999',
            tags: ['教育优惠', '轻薄本'],
            img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
            sales: '1万+'
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
                        <span className="text-xs text-slate-400">搜 {activeCat.name}</span>
                    </div>
                    <button className="p-1">
                        <Filter size={20} className="text-slate-700" />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-24 bg-slate-50 h-full overflow-y-auto no-scrollbar shrink-0">
                    {subCats.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setSubCat(i)}
                            className={`h-12 flex items-center justify-center text-xs font-medium relative transition-colors cursor-pointer ${i === subCat ? 'bg-white text-blue-600 font-bold' : 'text-slate-500'}`}
                        >
                            {i === subCat && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"></div>}
                            {item}
                        </div>
                    ))}
                </div>

                {/* Right Product List */}
                <div className="flex-1 h-full overflow-y-auto no-scrollbar p-3 space-y-3">
                    {/* Banner */}
                    <div className="w-full h-24 bg-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative shadow-sm">
                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                        <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-blue-800 shadow-sm border border-blue-100">
                            {activeCat.name} · 数码狂欢节
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
                                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400"; }}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    alt={item.title}
                                />
                            </div>
                            <div className="ml-3 flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2 leading-relaxed">{item.title}</h4>
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                        {item.tags.map((tag, t) => (
                                            <span key={t} className="text-[9px] border border-blue-200 text-blue-500 px-1 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400">已售 {item.sales}</span>
                                        <div className="text-blue-600 font-black text-lg leading-none mt-1">
                                            <span className="text-xs">¥</span>{item.price}
                                            <span className="text-xs text-slate-400 font-normal line-through ml-1 decoration-slate-300">¥{item.original}</span>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onProductSelect(item); }} className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center active:scale-90 shadow-lg shadow-blue-100 transition-transform">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="h-10 text-center text-xs text-slate-300 pt-6 pb-12 flex items-center justify-center">
                        <span className="w-8 h-px bg-slate-200 mr-2"></span>
                        没有更多了
                        <span className="w-8 h-px bg-slate-200 ml-2"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalCategoryPage;
