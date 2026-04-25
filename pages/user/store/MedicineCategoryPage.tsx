import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Filter, Tag } from 'lucide-react';

interface CategoryPageProps {
    category: any;
    onBack: () => void;
    onProductSelect: (product: any) => void;
}

const MedicineCategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onProductSelect }) => {
    const activeCatName = category?.name || '社区药房';
    const [subCat, setSubCat] = useState(0);

    // Dynamic Data Dictionary
    const categoryData: Record<string, any> = {
        '感冒发烧': {
            subCats: ['全部', '感冒灵', '退烧药', '止咳', '抗病毒', '消炎', '体温计'],
            bannerColor: 'bg-red-100',
            textColor: 'text-red-800',
            products: [
                { id: 101, title: '999 感冒灵颗粒 10g*9袋', price: '14.5', original: '18.0', tags: ['家中常备', '中西结合'], img: '', sales: '100万+' },
                { id: 102, title: '芬必得 布洛芬缓释胶囊 20粒', price: '28.9', original: '35.0', tags: ['止痛退烧'], img: '', sales: '50万+' },
                { id: 103, title: '连花清瘟胶囊 24粒', price: '19.8', original: '25.0', tags: ['清热解毒'], img: '', sales: '80万+' },
                { id: 104, title: '念慈菴 蜜炼川贝枇杷膏 300ml', price: '39.0', original: '45.0', tags: ['润肺止咳'], img: '', sales: '20万+' },
                { id: 105, title: '快克 复方氨酚烷胺胶囊', price: '12.5', original: '15.0', tags: ['抗感冒'], img: '', sales: '10万+' },
                { id: 106, title: '电子体温计 家用精准', price: '29.9', original: '49.9', tags: ['医疗器械'], img: '', sales: '5万+' },
            ]
        },
        '皮肤用药': {
            subCats: ['全部', '皮炎湿疹', '蚊虫叮咬', '创口贴', '烧烫伤', '抗真菌', '痤疮'],
            bannerColor: 'bg-orange-100',
            textColor: 'text-orange-800',
            products: [
                { id: 201, title: '999 皮炎平 复方醋酸地塞米松乳膏', price: '18.9', original: '22.0', tags: ['止痒消炎'], img: '', sales: '20万+' },
                { id: 202, title: '云南白药 创可贴 100片', price: '15.9', original: '19.9', tags: ['止血护创'], img: '', sales: '50万+' },
                { id: 203, title: '达克宁 硝酸咪康唑乳膏', price: '21.5', original: '26.0', tags: ['脚气杀菌'], img: '', sales: '10万+' },
                { id: 204, title: '红霉素软膏 10g', price: '3.5', original: '5.0', tags: ['消炎生肌', '平价神药'], img: '', sales: '100万+' },
                { id: 205, title: '无比滴 止痒液 50ml', price: '39.9', original: '49.0', tags: ['蚊虫克星'], img: '', sales: '15万+' },
            ]
        },
        '肠胃消化': {
            subCats: ['全部', '健胃消食', '腹泻', '便秘', '胃痛胃酸', '益生菌', '护肝'],
            bannerColor: 'bg-amber-100',
            textColor: 'text-amber-800',
            products: [
                { id: 301, title: '江中 健胃消食片 成人装', price: '16.8', original: '20.0', tags: ['助消化'], img: '', sales: '30万+' },
                { id: 302, title: '思密达 蒙脱石散 3g*10袋', price: '25.0', original: '30.0', tags: ['止泻'], img: '', sales: '20万+' },
                { id: 303, title: '修正 奥美拉唑肠溶胶囊', price: '19.9', original: '28.0', tags: ['胃痛胃酸'], img: '', sales: '10万+' },
                { id: 304, title: '开塞露 20ml*5支', price: '9.9', original: '12.0', tags: ['通便'], img: '', sales: '20万+' },
                { id: 305, title: '合生元 益生菌粉', price: '88.0', original: '108.0', tags: ['调理肠胃'], img: '', sales: '5万+' },
            ]
        },
        '儿童用药': {
            subCats: ['全部', '感冒发烧', '止咳化痰', '维生素', '外用护理', '消化不良'],
            bannerColor: 'bg-pink-100',
            textColor: 'text-pink-800',
            products: [
                { id: 401, title: '小葵花 小儿感冒颗粒', price: '18.5', original: '22.0', tags: ['儿童专用'], img: '', sales: '15万+' },
                { id: 402, title: '美林 布洛芬混悬液 100ml', price: '35.0', original: '45.0', tags: ['儿童退烧', '草莓味'], img: '', sales: '30万+' },
                { id: 403, title: '伊可新 维生素AD滴剂', price: '42.0', original: '52.0', tags: ['补钙搭档'], img: '', sales: '25万+' },
                { id: 404, title: '丁桂儿脐贴', price: '29.9', original: '36.0', tags: ['腹泻腹痛'], img: '', sales: '12万+' },
                { id: 405, title: '兵兵 退热贴 4贴装', price: '15.9', original: '19.9', tags: ['物理降温'], img: '', sales: '10万+' },
            ]
        },
        '慢病管理': {
            subCats: ['全部', '高血压', '糖尿病', '高血脂', '心脑血管', '医疗器械'],
            bannerColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            products: [
                { id: 501, title: '欧姆龙 上臂式电子血压计', price: '299.0', original: '359.0', tags: ['医疗精准', '送长辈'], img: '', sales: '5万+' },
                { id: 502, title: '三诺 血糖测试仪套装', price: '89.0', original: '129.0', tags: ['送试纸', '家用'], img: '', sales: '8万+' },
                { id: 503, title: '络活喜 苯磺酸氨氯地平片', price: '32.5', original: '40.0', tags: ['降压药'], img: '', sales: '10万+' },
                { id: 504, title: '阿司匹林肠溶片', price: '15.0', original: '18.0', tags: ['防血栓'], img: '', sales: '20万+' },
                { id: 505, title: '鱼跃 制氧机 3L家庭型', price: '1899.0', original: '2299.0', tags: ['大件物流'], img: '', sales: '1万+' },
            ]
        }
    };

    // Default Fallback
    const defaultData = {
        subCats: ['全部', '综合推荐', '销量排行', '今日特价'],
        bannerColor: 'bg-cyan-100',
        textColor: 'text-cyan-800',
        products: [
            { id: 901, title: '云南白药牙膏 留兰香型', price: '38.0', original: '45.0', tags: ['口腔护理'], img: '', sales: '20万+' },
            { id: 902, title: '医用外科口罩 50只独立装', price: '19.9', original: '29.9', tags: ['防疫'], img: '', sales: '100万+' },
            { id: 903, title: '75% 酒精消毒液 500ml', price: '9.9', original: '15.0', tags: ['消杀'], img: '', sales: '50万+' },
            { id: 904, title: '风油精 3ml', price: '3.0', original: '5.0', tags: ['提神醒脑'], img: '', sales: '200万+' }
        ]
    };

    const currentData = categoryData[activeCatName] || defaultData;
    const subCats = currentData.subCats;

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
                        <span className="text-xs text-slate-400">在 {activeCatName} 中搜索</span>
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
                    {subCats.map((item: string, i: number) => (
                        <div
                            key={i}
                            onClick={() => setSubCat(i)}
                            className={`h-12 flex items-center justify-center text-xs font-medium relative transition-colors cursor-pointer px-2 text-center ${i === subCat ? 'bg-white text-cyan-600 font-bold' : 'text-slate-500'}`}
                        >
                            {i === subCat && <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-600 rounded-r-full"></div>}
                            {item}
                        </div>
                    ))}
                </div>

                {/* Right Product List */}
                <div className="flex-1 h-full overflow-y-auto no-scrollbar p-3 space-y-3">
                    {/* Banner */}
                    <div className={`w-full h-20 ${currentData.bannerColor} rounded-lg mb-4 flex items-center justify-center overflow-hidden relative shadow-sm`}>
                        <div className={`text-xl font-black italic ${currentData.textColor} opacity-20 transform -rotate-12 absolute scale-150`}>
                            {activeCatName}
                        </div>
                        <div className="relative z-10 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-slate-800 shadow-sm">
                            {activeCatName} · 精选专区
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-sm text-slate-800">{subCats[subCat]}</h3>
                        <span className="text-[10px] text-slate-400">综合排序</span>
                    </div>

                    {/* Products */}
                    {currentData.products.map((item: any) => (
                        <div key={item.id} onClick={() => onProductSelect(item)} className="flex bg-white py-3 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 p-2 flex items-center justify-center relative">
                                {item.img ? (
                                    <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" alt={item.title} />
                                ) : (
                                    <div className="text-xs text-slate-300 font-bold text-center leading-tight">
                                        {item.title.substring(0, 4)}<br />图片
                                    </div>
                                )}
                                {/* Rank/Tag Overlay */}
                                {item.sales.includes('100万') && <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] px-1 rounded-br">TOP1</div>}
                            </div>
                            <div className="ml-3 flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2 leading-relaxed">{item.title}</h4>
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                        {item.tags.map((tag: string, t: number) => (
                                            <span key={t} className="text-[9px] border border-cyan-100 text-cyan-600 px-1 rounded bg-cyan-50">{tag}</span>
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
                                    <button onClick={(e) => { e.stopPropagation(); onProductSelect(item); }} className="w-7 h-7 bg-cyan-500 text-white rounded-full flex items-center justify-center active:scale-90 shadow-lg shadow-cyan-100 transition-transform">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="h-10 text-center text-xs text-slate-300 pt-4 pb-8 flex items-center justify-center">
                        <span className="w-8 h-px bg-slate-200 mr-2"></span>
                        {activeCatName} 到底啦
                        <span className="w-8 h-px bg-slate-200 ml-2"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineCategoryPage;
