
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Zap, Search, BookOpen, Clock, ChevronRight, PlayCircle, Flame, AlertTriangle } from 'lucide-react';

// Data with Local Image Paths
// ---------------------------------------------------------------------------
// 本地图片配置指南:
// 1. 创建文件夹 public/assets/academy/
// 2. 放入对应文件名的图片
// ---------------------------------------------------------------------------
const CATEGORIES = ['推荐', '必读', '科普', '急救', '警示'];

const FEATURED_VIDEO = {
    id: 0,
    title: "3分钟看懂家庭电路：小白也能学会的排查技巧",
    image: "https://images.unsplash.com/photo-1615811361269-669249293d80?w=800&fit=crop",
    localImage: "/assets/academy/video_poster.png",
    duration: "03:15",
    views: "12.5w"
};

const ARTICLES = [
    { 
        id: 1, 
        title: "冬季家庭用电“十不准”，关键时刻能救命", 
        desc: "随着气温下降，取暖设备使用频繁，这些禁忌千万别犯。",
        category: "必读", 
        views: "10w+", 
        date: "2023-11-15",
        image: "https://images.unsplash.com/photo-1473221326025-c4337b756488?w=300&h=200&fit=crop",
        localImage: "/assets/academy/a1.png"
    },
    { 
        id: 2, 
        title: "漏电保护器每月自检指南，手把手教你操作", 
        desc: "按一下这个按钮，确保全家安全，只需30秒。",
        category: "科普", 
        views: "5.2w+", 
        date: "2023-11-10",
        image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=300&h=200&fit=crop",
        localImage: "/assets/academy/a2.png"
    },
    { 
        id: 3, 
        title: "家中突然跳闸？电工教你三步快速排查法", 
        desc: "别急着合闸！先看这三个地方，避免二次故障。",
        category: "急救", 
        views: "8.9w+", 
        date: "2023-11-05",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop",
        localImage: "/assets/academy/a3.png"
    },
    { 
        id: 4, 
        title: "电动车充电火灾隐患大盘点，切勿进楼入户", 
        desc: "血淋淋的教训！电动车电池起火速度极快，难以扑灭。",
        category: "警示", 
        views: "12w+", 
        date: "2023-10-28",
        image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=300&h=200&fit=crop",
        localImage: "/assets/academy/a4.png"
    },
    { 
        id: 5, 
        title: "插座发黑还能用吗？出现这些迹象立即更换", 
        desc: "插座老化是引起家庭火灾的主要原因之一。",
        category: "科普", 
        views: "4.5w+", 
        date: "2023-10-20",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=200&fit=crop",
        localImage: "/assets/academy/a5.png"
    },
];

export const SafetyAcademyPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('推荐');

    const filteredArticles = activeCategory === '推荐' 
        ? ARTICLES 
        : ARTICLES.filter(a => a.category === activeCategory);

    return (
        <div className="h-full bg-slate-50 flex flex-col relative">
            {/* Header */}
            <div className="bg-white sticky top-0 z-20 shadow-sm">
                <div className="p-4 flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                    <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2">
                        <Search size={16} className="text-gray-400 mr-2"/>
                        <input type="text" placeholder="搜索安全知识..." className="bg-transparent text-sm outline-none flex-1 text-gray-700"/>
                    </div>
                </div>
                
                {/* Categories */}
                <div className="flex px-4 pb-2 space-x-6 overflow-x-auto no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`pb-2 text-sm font-bold relative whitespace-nowrap transition-colors ${activeCategory === cat ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {cat}
                            {activeCategory === cat && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-green-600 rounded-full"></div>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                
                {/* Featured Video (Only on '推荐') */}
                {activeCategory === '推荐' && (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer aspect-video bg-black">
                        {/* 优先使用 localImage，失败则使用 image */}
                        <img 
                            src={FEATURED_VIDEO.localImage || FEATURED_VIDEO.image} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-80 transition-opacity" 
                            alt="Featured"
                            onError={(e) => {
                                if (FEATURED_VIDEO.image && e.currentTarget.src !== FEATURED_VIDEO.image) {
                                    e.currentTarget.src = FEATURED_VIDEO.image;
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded">热门视频</span>
                                <span className="text-xs opacity-80 flex items-center"><PlayCircle size={12} className="mr-1"/> {FEATURED_VIDEO.views}播放</span>
                            </div>
                            <h3 className="text-lg font-bold leading-tight mb-1">{FEATURED_VIDEO.title}</h3>
                            <span className="text-xs bg-black/30 backdrop-blur-md px-2 py-0.5 rounded flex items-center self-start w-fit">
                                <Clock size={10} className="mr-1"/> {FEATURED_VIDEO.duration}
                            </span>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                            <PlayCircle size={32} className="text-white fill-white/50"/>
                        </div>
                    </div>
                )}

                {/* Article List */}
                <div className="space-y-4">
                    {filteredArticles.map(article => (
                        <div key={article.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex space-x-3 active:scale-[0.99] transition-transform">
                            {/* Image */}
                            <div className="w-28 h-20 rounded-xl bg-gray-200 shrink-0 overflow-hidden relative">
                                {/* 优先使用 localImage */}
                                <img 
                                    src={article.localImage || article.image} 
                                    className="w-full h-full object-cover" 
                                    alt={article.title}
                                    onError={(e) => {
                                        if (article.image && e.currentTarget.src !== article.image) {
                                            e.currentTarget.src = article.image;
                                        }
                                    }}
                                />
                                {article.category === '警示' && (
                                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                        <AlertTriangle size={8} className="inline mr-0.5"/>必看
                                    </div>
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">{article.title}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-1">{article.desc}</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-1.5 py-0.5 rounded ${
                                            article.category === '警示' ? 'bg-red-50 text-red-500' : 
                                            article.category === '必读' ? 'bg-orange-50 text-orange-500' :
                                            'bg-blue-50 text-blue-500'
                                        }`}>{article.category}</span>
                                        <span>{article.date}</span>
                                    </div>
                                    <span className="flex items-center"><BookOpen size={10} className="mr-1"/> {article.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Tip */}
                <div className="text-center py-6 text-gray-400 text-xs">
                    <p>学习安全知识 · 守护家庭平安</p>
                </div>
            </div>
        </div>
    );
};
