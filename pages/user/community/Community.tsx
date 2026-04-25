
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Heart, MessageCircle, Share2, Music, ChevronLeft, Plus,
    LayoutGrid, ShieldAlert, HeartHandshake, Landmark,
    Volume2, Search, Disc, Play, X, List, SearchX, Quote,
    ExternalLink, Sparkles, Send, Copy, MoreHorizontal, UserCheck,
    AlertTriangle, Loader2, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

// --- 类型定义 ---
interface Video {
    id: number;
    title: string;
    author: string;
    avatar: string;
    category: 'life' | 'fraud' | 'study';
    subCategory: string;
    likes: string;
    comments: string;
    shares: string;
    bgColor: string;
    videoUrl?: string; // 本地视频路径
    poster?: string;   // 视频封面图
}

// --- 补全模拟数据 (每个栏目5个) ---
const INITIAL_VIDEOS: Video[] = [
    // --- 社区生活 (Life) ---
    {
        id: 101,
        title: "电源插头根部破裂，电线破皮只剩下地线连着怎么办？教你轻松修复！",
        author: "邻里小王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang",
        category: 'life',
        subCategory: "用电安全",
        likes: "1.2w",
        comments: "342",
        shares: "568",
        bgColor: "from-emerald-600 to-teal-800",
        videoUrl: "/assets/videos/video1.mp4",
        poster: "/assets/videos/video1.png"
    },
    {
        id: 102,
        title: "楼道灯重新点亮 方便居民出行，照亮邻里路。",
        author: "文明先锋",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abe",
        category: 'life',
        subCategory: "正能量",
        likes: "5k",
        comments: "128",
        shares: "92",
        bgColor: "from-blue-600 to-indigo-800",
        videoUrl: "/assets/videos/video2.mp4",
        poster: "/assets/videos/video2.png"
    },
    {
        id: 103,
        title: "物业费积分抵扣教程，简单三步省下大几百！",
        author: "安电小助手",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Helper",
        category: 'life',
        subCategory: "社区指南",
        likes: "3.2k",
        comments: "45",
        shares: "1.1k",
        bgColor: "from-orange-500 to-amber-700"
    },
    {
        id: 104,
        title: "社区百家宴：来看看大家都带了什么拿手菜？",
        author: "爱吃的小李",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Foodie",
        category: 'life',
        subCategory: "随手拍",
        likes: "8.9k",
        comments: "1.2k",
        shares: "432",
        bgColor: "from-rose-500 to-pink-700"
    },
    {
        id: 105,
        title: "徐家汇街道垃圾分类红黑榜，看看你们小区上榜了吗？",
        author: "环保达人",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Green",
        category: 'life',
        subCategory: "公益宣传",
        likes: "4.1k",
        comments: "89",
        shares: "21",
        bgColor: "from-cyan-600 to-blue-800"
    },

    // --- 反诈宣传 (Fraud) ---
    {
        id: 201,
        title: "【高发】冒充客服退款诈骗，千万别点这个链接！",
        author: "反诈先锋",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Police",
        category: 'fraud',
        subCategory: "案例解析",
        likes: "4.5k",
        comments: "890",
        shares: "2.1k",
        bgColor: "from-slate-700 to-slate-900",
        videoUrl: "/assets/videos/video3.mp4",
        poster: "/assets/videos/video3.png"
    },
    {
        id: 202,
        title: "刷单返现全是坑！看看这个邻居是怎么被骗的。",
        author: "徐汇卫士",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guard",
        category: 'fraud',
        subCategory: "邻里警示",
        likes: "8.2k",
        comments: "1.1k",
        shares: "4.3k",
        bgColor: "from-blue-900 to-slate-950",
        videoUrl: "/assets/videos/video4.mp4",
        poster: "/assets/videos/video4.png"
    },
    { id: 203, title: "【反诈剧场】夕阳红理财骗局，专门针对老年人！", author: "平安志愿者", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elderly", category: 'fraud', subCategory: "反诈情景剧", likes: "15w", comments: "2w", shares: "5w", bgColor: "from-indigo-900 to-purple-900" },
    { id: 204, title: "杀猪盘真实录音：温柔陷阱背后的残酷真相。", author: "反诈大数据", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Data", category: 'fraud', subCategory: "绝密内幕", likes: "22w", comments: "3w", shares: "8w", bgColor: "from-red-900 to-slate-900" },
    { id: 205, title: "安装国家反诈中心App，守护你的钱袋子。", author: "反诈普及员", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=App", category: 'fraud', subCategory: "官方指南", likes: "50w", comments: "5w", shares: "12w", bgColor: "from-blue-600 to-indigo-900" },

    // --- 学习强国 (Study) ---
    {
        id: 301,
        title: "【学习进行时】新质生产力如何深刻改变我们的日常生活？",
        author: "强国之声",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Study",
        category: 'study',
        subCategory: "理论前沿",
        likes: "50w",
        comments: "10w",
        shares: "20w",
        bgColor: "from-red-600 to-red-900",
        videoUrl: "/assets/videos/video5.mp4",
        poster: "/assets/videos/video5.png"
    },
    {
        id: 302,
        title: "【大国重器】探秘特高压输电：如何让中国电力领先世界？",
        author: "科创中国",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=China",
        category: 'study',
        subCategory: "科技强强国",
        likes: "25w",
        comments: "5k",
        shares: "1.2w",
        bgColor: "from-red-700 to-orange-900",
        videoUrl: "/assets/videos/video6.mp4",
        poster: "/assets/videos/video6.png"
    },
    { id: 303, title: "【党员必修】习总书记|领航中国·2025丨始终把人民放在心上", author: "实时新闻", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Party", category: 'study', subCategory: "党课课堂", likes: "12w", comments: "1.2k", shares: "8.5k", bgColor: "from-red-800 to-red-950" },
    { id: 304, title: "【大美中国】江山如此多娇：航拍祖国绣河山。", author: "强国地理", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=View", category: 'study', subCategory: "大美中国", likes: "30w", comments: "2.1w", shares: "10w", bgColor: "from-orange-600 to-red-900" },
    { id: 305, title: "【工匠精神】王进：离带电高压线最近的“电力蜘蛛侠”。", author: "匠心传承", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Craft", category: 'study', subCategory: "大国工匠", likes: "18w", comments: "1w", shares: "4w", bgColor: "from-red-900 to-yellow-900" },
];

// --- 虚拟评论组件 ---
const CommentDrawer = ({ onClose }: { onClose: () => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState([
        { user: "海边清风", text: "这个科普太及时了，老房子确实要检查下！", time: "2小时前", likes: 12 },
        { user: "电力达人", text: "这种接线法很规范，点赞！", time: "5小时前", likes: 8 },
        { user: "安安", text: "收藏了，下次修电试试看。", time: "昨天", likes: 3 },
    ]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setComments([{ user: "我 (业主)", text: inputValue, time: "刚刚", likes: 0 }, ...comments]);
        setInputValue('');
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="w-full max-w-md bg-[#16181D] rounded-t-[2rem] p-6 animate-slide-up h-[70vh] flex flex-col relative border-t border-white/10">
                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 shrink-0" />
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-white font-black">评论 ({comments.length})</h3>
                    <button onClick={onClose} className="text-white/40"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
                    {comments.map((c, i) => (
                        <div key={i} className="flex space-x-3">
                            <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-white/40 text-xs font-bold mb-1">@{c.user}</p>
                                <p className="text-white/90 text-sm leading-relaxed">{c.text}</p>
                                <p className="text-white/20 text-[10px] mt-2 font-bold">{c.time}</p>
                            </div>
                            <div className="flex flex-col items-center text-white/20">
                                <Heart size={14} />
                                <span className="text-[10px] mt-1">{c.likes}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 pb-safe bg-[#16181D] border-t border-white/5">
                    <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="留下你的精彩评论..."
                            className="flex-1 bg-transparent text-white text-sm outline-none font-medium"
                        />
                        <button onClick={handleSend} className="text-red-500 active:scale-90 transition-transform"><Send size={20} /></button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 虚拟分享组件 ---
const ShareSheet = ({ onClose }: { onClose: () => void }) => (
    createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="w-full max-w-md bg-[#16181D] rounded-t-[2rem] p-8 animate-slide-up relative border-t border-white/10">
                <h3 className="text-white font-black text-center mb-8">分享至</h3>
                <div className="grid grid-cols-4 gap-y-8 mb-10">
                    {[
                        { label: '微信', color: 'bg-emerald-500', icon: MessageCircle },
                        { label: '朋友圈', color: 'bg-blue-500', icon: Disc },
                        { label: '下载', color: 'bg-slate-700', icon: Plus },
                        { label: '复制链接', color: 'bg-indigo-500', icon: Copy },
                        { label: '不感兴趣', color: 'bg-white/10', icon: X },
                        { label: '举报', color: 'bg-red-500/20 text-red-500', icon: AlertTriangle },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center group">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white mb-2 active:scale-90 transition-transform`}>
                                <item.icon size={24} />
                            </div>
                            <span className="text-white/40 text-[10px] font-bold">{item.label}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-sm">取消</button>
            </div>
        </div>,
        document.body
    )
);

// --- 模拟/真实视频背景组件 ---
const MockVideoBackground: React.FC<{ video: Video, isGrid?: boolean }> = ({ video, isGrid }) => {
    const [hasError, setHasError] = useState(false);

    // 关键点：如果视频加载失败 (安卓端常见 404)，自动回退到艺术背景
    if (video.videoUrl && !isGrid && !hasError) {
        return (
            <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
                <video
                    src={video.videoUrl}
                    poster={video.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => {
                        console.warn(`Video load failed for ${video.videoUrl}, falling back to static background.`);
                        setHasError(true);
                    }}
                    className="w-full h-full object-cover opacity-90 animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
            </div>
        );
    }

    return (
        <div className={`absolute inset-0 bg-gradient-to-br ${video.bgColor} flex flex-col items-center justify-center p-8 text-center overflow-hidden`}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            {isGrid && video.poster && (
                <img
                    src={video.poster}
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80";
                        e.currentTarget.className = "absolute inset-0 w-full h-full object-cover opacity-20 grayscale";
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt=""
                />
            )}
            <div className="relative z-10 flex flex-col items-center animate-fade-in">
                <div className={`mb-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl ${isGrid ? 'w-12 h-12' : 'w-24 h-24'}`}>
                    {video.category === 'study' ? <Landmark size={isGrid ? 24 : 48} className="text-white fill-white/20" /> : <Play size={isGrid ? 24 : 48} className="text-white fill-white/20 ml-1" />}
                </div>
                <div className={`${isGrid ? 'text-xs' : 'text-xl'} font-black text-white/90 leading-tight tracking-tight px-4`}>
                    {video.title}
                </div>
            </div>
            <div className="absolute -bottom-10 -left-10 text-white/5 font-black text-8xl rotate-12 pointer-events-none select-none italic whitespace-nowrap">
                {video.subCategory}
            </div>
        </div>
    );
};

// --- 沉浸式单视频卡片 ---
const ImmersiveVideoCard: React.FC<{ video: Video, themeColor: string }> = ({ video, themeColor }) => {
    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showFollowToast, setShowFollowToast] = useState(false);

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (followed) return;
        setFollowed(true);
        setShowFollowToast(true);
        setTimeout(() => setShowFollowToast(false), 2000);
    };

    return (
        <div className="relative h-screen w-full snap-start bg-black overflow-hidden">
            <MockVideoBackground video={video} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

            {showFollowToast && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-2xl flex items-center animate-scale-in border border-white/10">
                    <UserCheck size={18} className="text-emerald-500 mr-2" />
                    <span className="text-sm font-black">已关注 @{video.author}</span>
                </div>
            )}

            <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center space-y-6">
                <div className="relative mb-2">
                    <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white">
                        <img
                            src={video.avatar}
                            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`; }}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>
                    {!followed && (
                        <button
                            onClick={handleFollow}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white border-2 border-black active:scale-150 transition-all duration-300"
                        >
                            <Plus size={14} strokeWidth={4} />
                        </button>
                    )}
                </div>
                <button onClick={() => setLiked(!liked)} className="flex flex-col items-center group active:scale-125 transition-transform">
                    <Heart size={36} className={`drop-shadow-lg transition-all ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    <span className="text-white text-xs font-black mt-1 drop-shadow-md">{liked ? "1.3w" : video.likes}</span>
                </button>
                <button onClick={() => setShowComments(true)} className="flex flex-col items-center active:scale-90 transition-transform">
                    <MessageCircle size={36} className="text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-black mt-1 drop-shadow-md">{video.comments}</span>
                </button>
                <button onClick={() => setShowShare(true)} className="flex flex-col items-center active:scale-90 transition-transform">
                    <Share2 size={36} className="text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-black mt-1 drop-shadow-md">{video.shares}</span>
                </button>
                <div className="pt-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 animate-[spin_5s_linear_infinite] shadow-2xl relative overflow-hidden">
                        <Disc size={24} className="text-white/40" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-5 pb-safe z-10 text-white pointer-events-none">
                <div className="max-w-[85%] space-y-3">
                    <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${themeColor} bg-opacity-20 text-opacity-100 backdrop-blur-md border border-white/10`}>
                            #{video.subCategory}
                        </span>
                        {video.category === 'study' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white flex items-center">
                                <ExternalLink size={10} className="mr-1" /> 学习强国
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-md">@{video.author} {followed && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/40 align-middle ml-1">已关注</span>}</h3>
                    <p className="text-white/90 text-base font-bold leading-relaxed line-clamp-2 drop-shadow-sm">
                        {video.title}
                    </p>
                    <div className="flex items-center space-x-2 pt-2 overflow-hidden text-white/60">
                        <Music size={14} className="animate-pulse shrink-0" />
                        <div className="flex whitespace-nowrap animate-[scroll-text_10s_linear_infinite]">
                            <span className="text-xs font-medium mr-8">正在播放: 原声 - {video.author}</span>
                            <span className="text-xs font-medium mr-8">正在播放: 原声 - {video.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showComments && <CommentDrawer onClose={() => setShowComments(false)} />}
            {showShare && <ShareSheet onClose={() => setShowShare(false)} />}
        </div>
    );
};

export const CommunityPage = () => {
    const navigate = useNavigate();
    const [activeType, setActiveType] = useState<'life' | 'fraud' | 'study'>('life');
    const [layoutMode, setLayoutMode] = useState<'feed' | 'grid'>('feed');
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVideos = useMemo(() => {
        let list = INITIAL_VIDEOS.filter(v => v.category === activeType);
        if (searchQuery.trim()) {
            list = list.filter(v =>
                v.title.includes(searchQuery) ||
                v.author.includes(searchQuery) ||
                v.subCategory.includes(searchQuery)
            );
        }
        return list;
    }, [activeType, searchQuery]);

    const themes = {
        life: { color: 'text-emerald-400 bg-emerald-400', icon: HeartHandshake, label: '社区生活' },
        fraud: { color: 'text-blue-400 bg-blue-400', icon: ShieldAlert, label: '反诈宣传' },
        study: { color: 'text-red-400 bg-red-400', icon: Landmark, label: '学习强国' }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-black overflow-hidden font-sans relative">

            {isSearching && (
                <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-2xl animate-fade-in flex flex-col pointer-events-auto">
                    <div className="px-5 pt-safe pb-4 border-b border-white/10">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 bg-white/10 rounded-2xl flex items-center px-4 py-3 border border-white/20">
                                <Search size={20} className="text-gray-400 mr-3" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="搜索社区内容..."
                                    className="bg-transparent text-white text-base outline-none flex-1 font-bold"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="p-1 bg-white/10 rounded-full">
                                        <X size={14} className="text-white" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                                className="text-white font-black text-sm px-2"
                            >
                                取消
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                        {searchQuery && filteredVideos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <SearchX size={64} className="text-white mb-4" />
                                <p className="text-white font-black">未找到相关内容</p>
                            </div>
                        ) : searchQuery ? (
                            <div className="grid grid-cols-2 gap-3">
                                {filteredVideos.map(v => (
                                    <div key={v.id} onClick={() => { setLayoutMode('feed'); setIsSearching(false); }} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 animate-fade-up">
                                        <MockVideoBackground video={v} isGrid />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-black line-clamp-1">@{v.author}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-1">社区热搜</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['#安全用电', '#反诈骗', '#党课学习', '#老房改造', '#电工王师傅'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag.replace('#', ''))}
                                            className="px-4 py-2 bg-white/5 rounded-xl text-white text-xs font-bold border border-white/5 active:bg-white/10"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="absolute top-0 left-0 w-full z-[100] px-4 pt-safe pb-4 flex flex-col pointer-events-none">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/user/home')} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-transform pointer-events-auto shadow-xl">
                        <ChevronLeft size={28} />
                    </button>



                    <div className="flex items-center space-x-3 pointer-events-auto">
                        <button
                            onClick={() => setIsSearching(true)}
                            className={`p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 shadow-xl transition-all ${isSearching ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                        >
                            <Search size={24} />
                        </button>
                        <button
                            onClick={() => setLayoutMode(layoutMode === 'feed' ? 'grid' : 'feed')}
                            className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 shadow-xl"
                        >
                            {layoutMode === 'feed' ? <LayoutGrid size={24} /> : <List size={24} />}
                        </button>
                    </div>
                </div>

                <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-2xl pointer-events-auto">
                    {(Object.keys(themes) as Array<keyof typeof themes>).map(type => {
                        const isActive = activeType === type;
                        const Icon = themes[type].icon;
                        return (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${isActive
                                    ? type === 'study'
                                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/40 scale-105'
                                        : 'bg-white/20 text-white shadow-inner'
                                    : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <Icon size={16} className={`mr-1.5 ${isActive ? 'animate-pulse' : ''}`} />
                                {themes[type].label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 bg-neutral-950 overflow-hidden">
                {layoutMode === 'feed' ? (
                    <div className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth">
                        {filteredVideos.map((video) => (
                            <ImmersiveVideoCard
                                key={video.id}
                                video={video}
                                themeColor={themes[activeType].color}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto pt-[160px] px-4 pb-24 no-scrollbar animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            {filteredVideos.map((video, idx) => (
                                <div
                                    key={video.id}
                                    onClick={() => setLayoutMode('feed')}
                                    className={`relative aspect-[3/4.5] bg-neutral-900 rounded-[2.2rem] overflow-hidden group active:scale-[0.98] transition-all cursor-pointer border border-white/5 animate-fade-up`}
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <MockVideoBackground video={video} isGrid />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 bg-white">
                                                <img
                                                    src={video.avatar}
                                                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`; }}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <p className="text-white/60 text-[9px] font-black truncate">@{video.author}</p>
                                        </div>
                                        <h4 className="text-white text-[11px] font-black line-clamp-2 leading-snug">{video.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute right-5 bottom-10 z-[150]">
                <button className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[1.8rem] shadow-[0_15px_30px_rgba(79,70,229,0.4)] flex items-center justify-center border-2 border-white/20 active:scale-90 transition-all active:rotate-12 group">
                    <Plus size={36} strokeWidth={3} className="group-active:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            <style>{`
                @keyframes scroll-text { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

const PlusIcon = (props: any) => <Zap {...props} />;

export default CommunityPage;
