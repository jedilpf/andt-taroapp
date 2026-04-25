import React, { useState } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, ShoppingCart, Star, ChevronRight, Truck, ShieldCheck, Heart, Check } from 'lucide-react';

interface ProductDetailProps {
    product: any;
    onBack: () => void;
    onBuy?: () => void;
}

const SupermarketProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onBuy }) => {
    const [added, setAdded] = useState(false);

    // Dynamic Product Data Merging
    const item = {
        t: product?.t || product?.title || '金龙鱼 黄金比例调和油 5L',
        p: product?.p || product?.price || '69.9',
        img: product?.img || '/assets/products/item5.png',
        desc: product?.desc || '黄金比例，营养均衡。精选八种植物油按科学脂肪酸比例调和而成。',
        sales: product?.sales || '10万+',
        rating: product?.rating || '99%',
        tag: product?.tag || '自营'
    };

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-10 p-4 pt-safe flex justify-between items-center">
                <button onClick={onBack} className="w-9 h-9 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-95">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex space-x-2">
                    <button className="w-9 h-9 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-95">
                        <Share2 size={18} />
                    </button>
                    <button className="w-9 h-9 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-95">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {/* Product Image */}
                <div className="aspect-square bg-white relative">
                    <img
                        src={item.img}
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"; }}
                        className="w-full h-full object-contain p-8 mix-blend-multiply"
                        alt=""
                    />
                    <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                        1/5
                    </div>
                </div>

                {/* Price & Info */}
                <div className="bg-white p-4 -mt-4 relative rounded-t-3xl shadow-sm space-y-3">
                    <div className="flex items-baseline space-x-2 text-red-600">
                        <span className="text-sm font-bold">¥</span>
                        <span className="text-3xl font-black">{item.p}</span>
                        <span className="text-slate-400 text-xs font-normal line-through ml-2">¥{parseFloat(item.p) * 1.2}</span>
                        <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold ml-auto">
                            超值补贴
                        </span>
                    </div>

                    <h1 className="text-lg font-black text-slate-900 leading-snug">
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-1.5 py-0.5 rounded mr-1 align-middle">自营</span>
                        {item.t}
                    </h1>

                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-50 p-2 rounded-lg">
                        <span>已售 {item.sales || '500+'}</span>
                        <div className="w-px h-3 bg-slate-200"></div>
                        <span className="flex items-center text-slate-600 font-bold"><Star size={12} className="text-yellow-400 mr-1 fill-current" /> {item.rating || '98%'} 好评</span>
                        <div className="w-px h-3 bg-slate-200"></div>
                        <span className="flex items-center">详情 <ChevronRight size={12} /></span>
                    </div>
                </div>

                {/* Services */}
                <div className="mt-3 bg-white p-4 space-y-4">
                    <div className="flex items-start text-xs">
                        <span className="font-bold text-slate-900 min-w-[3rem]">发货</span>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center text-slate-800">
                                <Truck size={14} className="mr-1 text-red-600" />
                                <span className="font-bold">安电物流</span>
                                <span className="text-slate-400 ml-1">| 此商品支持半日达</span>
                            </div>
                            <p className="text-slate-400 pl-5">23:00前下单，预计明天(周三)送达</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                    <div className="w-full h-px bg-slate-50"></div>
                    <div className="flex items-start text-xs">
                        <span className="font-bold text-slate-900 min-w-[3rem]">保障</span>
                        <div className="flex-1 flex flex-wrap gap-2 text-slate-500">
                            <span className="flex items-center"><ShieldCheck size={12} className="mr-0.5" /> 假一赔十</span>
                            <span className="flex items-center"><ShieldCheck size={12} className="mr-0.5" /> 破损包赔</span>
                            <span className="flex items-center"><ShieldCheck size={12} className="mr-0.5" /> 7天无理由退货</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                </div>

                {/* Simulated Reviews */}
                <div className="mt-3 bg-white p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-900 text-sm">评价 (100+)</h3>
                        <span className="text-xs text-slate-400 flex items-center">好评度 99% <ChevronRight size={12} /></span>
                    </div>
                    <div className="flex space-x-3 overflow-x-auto no-scrollbar">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 p-3 rounded-xl min-w-[200px] shrink-0">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                                    <span className="text-xs text-slate-500 ml-2">用户88**{i}</span>
                                    <div className="ml-auto flex"><Star size={10} className="text-yellow-400 fill-current" /></div>
                                </div>
                                <p className="text-xs text-slate-800 line-clamp-2">东西收到很满意，物流非常快，安电超市值得信赖！包装也很完好。</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Images */}
                <div className="mt-3 bg-white p-4 pb-10">
                    <h3 className="flex items-center justify-center font-bold text-slate-400 text-xs mb-4">
                        <span className="w-8 h-px bg-slate-200 mr-2"></span> 商品详情 <span className="w-8 h-px bg-slate-200 ml-2"></span>
                    </h3>
                    <div className="space-y-2">
                        {/* Placeholders for long detail images */}
                        <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-xs">商品介绍图 1</div>
                        <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-xs">商品介绍图 2</div>
                        <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-xs">规格参数表</div>
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 flex items-center px-4 py-2 pb-safe z-50">
                <div className="flex space-x-5 mr-6">
                    <div className="flex flex-col items-center">
                        <MoreHorizontal size={20} className="text-slate-600" />
                        <span className="text-[9px] text-slate-500 mt-0.5">店铺</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <ShoppingCart size={20} className="text-slate-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full">1</span>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5">购物车</span>
                    </div>
                </div>

                <div className="flex-1 flex space-x-2">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 h-10 font-bold text-sm rounded-full shadow-sm transition-all active:scale-95 flex items-center justify-center ${added ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}`}
                    >
                        {added ? <><Check size={16} className="mr-1" /> 已加入</> : '加入购物车'}
                    </button>
                    <button onClick={onBuy} className="flex-1 h-10 bg-red-600 text-white font-bold text-sm rounded-full shadow-lg shadow-red-200 active:scale-95 transition-transform">
                        立即购买
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupermarketProductDetail;
