
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Check, ChevronRight, Gem, Shield, Clock, Gift, Zap, Star, X, CheckCircle, ShieldAlert, Cpu, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../context/AppContext';

// --- 类型定义 ---
type Level = 'silver' | 'gold' | 'diamond';

interface Plan {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    tag?: string;
    duration: string;
}

interface SafetyPackage {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    originalPrice: number;
    items: string[];
    image: string;
    icon: any;
}

// --- 数据配置 ---
const SAFETY_PACKAGES: SafetyPackage[] = [
    {
        id: 'pkg-1',
        title: "老房电路焕新套餐",
        subtitle: "针对20年以上房龄 · 全面消除隐患",
        price: 899,
        originalPrice: 1280,
        items: ["配电箱整体加固", "8处开关面板换新", "全屋漏电深度测试", "线路老化红外扫描"],
        image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=400&h=400&fit=crop",
        icon: ShieldAlert
    },
    {
        id: 'pkg-2',
        title: "全屋智能照明升级",
        subtitle: "老房变智能 · 语音/手机随心控",
        price: 599,
        originalPrice: 888,
        items: ["3路智能开关", "中央控制网关", "2路人体感应灯控", "金牌师傅上门调试"],
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
        icon: Cpu
    }
];

const LEVELS = {
    silver: {
        id: 'silver',
        name: '白银会员',
        color: 'from-slate-100 via-white to-slate-300',
        textColor: 'text-slate-800',
        shadow: 'shadow-slate-500/20',
        badge: '白银尊享',
        benefits: [
            { name: '上门费 9 折', icon: Zap },
            { name: '专属客服', icon: Shield },
            { name: '生日礼包', icon: Gift },
        ]
    },
    gold: {
        id: 'gold',
        name: '黄金会员',
        color: 'from-[#FFD101] via-[#FFD101] to-[#FFB800]',
        textColor: 'text-[#4A3900]',
        shadow: 'shadow-yellow-500/30',
        badge: '黄金尊享',
        benefits: [
            { name: '免费上门 (2次/月)', icon: Zap },
            { name: '维修费 8.8 折', icon: Star },
            { name: '极速响应通道', icon: Clock },
            { name: '双倍积分', icon: Gem },
        ]
    },
    diamond: {
        id: 'diamond',
        name: '黑钻会员',
        color: 'from-[#2D2D2D] via-[#1A1A1A] to-[#121212]',
        textColor: 'text-[#FFD101]',
        shadow: 'shadow-black/50',
        badge: '黑钻至尊',
        benefits: [
            { name: '无限次免费上门', icon: Zap },
            { name: '维修费 8 折', icon: Star },
            { name: '全年免费体检', icon: Shield },
            { name: '1对1 专属管家', icon: Crown },
            { name: '节日豪华礼品', icon: Gift },
        ]
    }
};

const PRICING: Record<Level, Plan[]> = {
    silver: [
        { id: 101, name: '连续包月', price: 9.9, originalPrice: 19.9, duration: '1个月' },
        { id: 102, name: '超值季卡', price: 29.9, originalPrice: 59.9, duration: '3个月', tag: '省 ¥30' },
        { id: 103, name: '尊享年卡', price: 99.0, originalPrice: 238.8, duration: '12个月', tag: '推荐' },
    ],
    gold: [
        { id: 201, name: '连续包月', price: 19.9, originalPrice: 29.9, duration: '1个月' },
        { id: 202, name: '超值季卡', price: 49.9, originalPrice: 89.9, duration: '3个月', tag: '省 ¥40' },
        { id: 203, name: '尊享年卡', price: 169.0, originalPrice: 358.8, duration: '12个月', tag: '省 189 元' },
    ],
    diamond: [
        { id: 301, name: '连续包月', price: 39.9, originalPrice: 59.9, duration: '1个月' },
        { id: 302, name: '超值季卡', price: 99.9, originalPrice: 179.9, duration: '3个月', tag: '省 ¥80' },
        { id: 303, name: '尊享年卡', price: 299.0, originalPrice: 718.8, duration: '12个月', tag: '极尊尊享' },
    ]
};

// --- 付款弹窗 ---
const PurchaseModal = ({ onClose, plan, levelName, onConfirm }: { onClose: () => void, plan: Plan, levelName: string, onConfirm: () => void }) => {
    const [step, setStep] = useState<'pay' | 'success'>('pay');

    const handlePay = () => {
        setStep('success');
        setTimeout(() => {
            onConfirm();
        }, 1500);
    };

    if (step === 'success') {
        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="bg-[#1C1E22] border border-white/10 p-8 rounded-[3rem] flex flex-col items-center animate-scale-in w-[85%] max-w-sm text-center">
                    <div className="w-24 h-24 bg-[#FFD101] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,209,1,0.4)]">
                        <Trophy size={48} className="text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-black text-white">开通成功</h3>
                    <p className="text-slate-400 text-sm mt-2">尊贵的{levelName}权益已生效<br/>愿每一次用电都更安全、更智能</p>
                </div>
            </div>, document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-[480px] bg-white rounded-t-[3rem] p-8 animate-slide-up pointer-events-auto relative z-10 pb-safe shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-800">确认订单</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 flex justify-between items-center mb-8 border border-slate-100">
                    <div>
                        <p className="text-base font-black text-slate-800">{levelName} · {plan.name}</p>
                        <p className="text-xs text-slate-400 mt-1 font-bold">有效期增加 {plan.duration}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-red-600">¥{plan.price}</p>
                    </div>
                </div>

                <button 
                    onClick={handlePay}
                    className="w-full py-5 bg-[#FFD101] text-slate-900 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform"
                >
                    确认支付并升级
                </button>
            </div>
        </div>, document.body
    );
};

export const UserMemberCenter = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const [currentTab, setCurrentTab] = useState<Level>('gold'); 
    const currentPlans = PRICING[currentTab];
    const [selectedPlanId, setSelectedPlanId] = useState(currentPlans[2].id);
    const [showPayModal, setShowPayModal] = useState(false);

    const currentExp = 14508;
    const nextLevelExp = 30000;
    const progressPercent = (currentExp / nextLevelExp) * 100;

    const currentLevelData = LEVELS[currentTab];

    useEffect(() => {
        setSelectedPlanId(PRICING[currentTab][2].id);
    }, [currentTab]);

    return (
        <div className="h-full bg-[#16181D] overflow-y-auto no-scrollbar pb-32">
            {/* 1. 顶部艺术渐变背景 */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-[-40%] left-[-20%] w-[140%] h-full bg-gradient-to-br ${currentTab === 'gold' ? 'from-[#FFD101]/20' : (currentTab === 'silver' ? 'from-slate-400/10' : 'from-yellow-900/40')} to-transparent blur-[140px]`}></div>
                <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#16181D] to-transparent"></div>
            </div>

            {/* 2. 导航栏 */}
            <div className="relative z-10 p-5 flex justify-between items-center text-white pt-safe">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-white/5 border border-white/5 active:scale-90 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-black tracking-widest uppercase">会员中心</h1>
                <button className="text-xs font-black text-[#FFD101] bg-[#FFD101]/10 px-4 py-1.5 rounded-full border border-[#FFD101]/20">权益细则</button>
            </div>

            {/* 3. 用户与进度信息 (汉化版) */}
            <div className="relative z-10 px-6 mt-4 mb-10 flex items-end justify-between">
                <div className="flex items-center space-x-5">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-[1.6rem] bg-[#2A2C32] p-0.5 shadow-2xl border border-white/5">
                             <img src={currentUser?.avatar} className="w-full h-full rounded-[1.4rem] object-cover" alt="Avatar"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[#FFD101] rounded-lg p-1 shadow-lg shadow-yellow-500/30">
                            <Crown size={14} className="text-slate-900 fill-slate-900" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">{currentUser?.name}</h2>
                        <div className="flex items-center text-[11px] text-slate-400 font-bold mt-1 tracking-wide">
                            <Clock size={12} className="mr-1 text-[#FFD101]"/> 有效期至 2027.11
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[#FFD101] font-black mb-2 uppercase tracking-widest">成长值进度</p>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                        <div className="h-full bg-gradient-to-r from-yellow-700 to-[#FFD101] shadow-[0_0_10px_rgba(255,209,1,0.5)]" style={{width: `${progressPercent}%`}}></div>
                    </div>
                    <p className="text-[10px] text-white/30 font-black mt-2 tracking-tighter">{currentExp} / {nextLevelExp}</p>
                </div>
            </div>

            {/* 4. 等级切换器 */}
            <div className="relative z-10 px-6 mb-8">
                <div className="flex justify-between bg-[#2A2C32]/40 rounded-2xl p-1.5 border border-white/5 shadow-2xl backdrop-blur-xl">
                    {(Object.keys(LEVELS) as Level[]).map(key => (
                        <button
                            key={key}
                            onClick={() => setCurrentTab(key)}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 ${
                                currentTab === key 
                                ? `bg-[#FFD101] text-slate-900 shadow-[0_4px_20px_rgba(255,209,1,0.2)]` 
                                : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            {LEVELS[key].name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 5. 核心会员卡 (中文化与纹理) */}
            <div className="relative z-10 px-4 mb-10 group">
                <div className={`relative w-full aspect-[1.7] rounded-[3rem] bg-gradient-to-br ${currentLevelData.color} p-10 flex flex-col justify-between shadow-2xl transition-all duration-500 overflow-hidden border border-white/10`}>
                    {/* 卡片内纹理 */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <Crown size={180} className="fill-current"/>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className={`text-3xl font-black italic tracking-tighter uppercase ${currentLevelData.textColor}`}>{currentLevelData.badge}</h2>
                            <div className="flex items-center mt-2 space-x-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={10} className={`${currentLevelData.textColor} fill-current opacity-30`}/>)}
                            </div>
                        </div>
                        <div className={`p-4 rounded-3xl backdrop-blur-md border border-white/20 bg-black/10 ${currentLevelData.textColor}`}>
                            <Crown size={32} className="fill-current"/>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex space-x-8 overflow-x-auto no-scrollbar pb-1">
                            {currentLevelData.benefits.map((b, i) => (
                                <div key={i} className="flex flex-col items-center shrink-0">
                                    <div className={`w-12 h-12 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/10 ${currentLevelData.textColor}`}>
                                        <b.icon size={24}/>
                                    </div>
                                    <span className={`text-[11px] font-black text-center leading-tight tracking-tight ${currentLevelData.textColor}`}>{b.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. 会员专属焕新套餐 */}
            <div className="relative z-10 px-6 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-black text-xl flex items-center">
                         <div className="w-1.5 h-6 bg-[#FFD101] rounded-full mr-3 shadow-[0_0_15px_#FFD101]"></div>
                         会员专属 · 安全焕新
                    </h3>
                    <span className="text-[10px] font-black text-[#FFD101] bg-[#FFD101]/10 px-3 py-1 rounded-full border border-[#FFD101]/20">专享 7.5 折起</span>
                </div>
                
                <div className="space-y-5">
                    {SAFETY_PACKAGES.map((pkg) => (
                        <div key={pkg.id} className="bg-[#1F2228] rounded-[2.5rem] p-7 border border-white/5 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all group">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                        <pkg.icon size={32} className="text-[#FFD101]"/>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-bold line-through">原价 ¥{pkg.originalPrice}</p>
                                        <div className="flex items-baseline text-[#FFD101] mt-1">
                                            <span className="text-sm font-black mr-1">¥</span>
                                            <span className="text-3xl font-black tracking-tighter">{pkg.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{pkg.title}</h4>
                                <p className="text-xs text-slate-500 font-bold mb-6 tracking-wide">{pkg.subtitle}</p>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                                    {pkg.items.map((item, i) => (
                                        <div key={i} className="flex items-center text-[11px] font-bold text-slate-300">
                                            <CheckCircle2 size={14} className="mr-2 text-[#FFD101] shrink-0"/>
                                            <span className="truncate">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center shadow-lg">
                                    立即预约会员专属方案 <ChevronRight size={16} className="ml-1 opacity-40"/>
                                </button>
                            </div>
                            <pkg.icon size={120} className="absolute -right-8 -bottom-8 text-white/[0.02] rotate-12 group-hover:scale-110 transition-transform duration-700"/>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. 续费选择 */}
            <div className="relative z-10 px-6 mb-12">
                 <h3 className="text-white font-black text-lg mb-6 flex items-center">
                    <Sparkles size={20} className="mr-2 text-[#FFD101]"/> 续费升级服务
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {currentPlans.map(plan => (
                        <div 
                            key={plan.id}
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={`relative rounded-[2rem] p-5 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                                selectedPlanId === plan.id 
                                ? 'border-[#FFD101] bg-[#FFD101]/5 shadow-[0_0_20px_rgba(255,209,1,0.05)] scale-105' 
                                : 'border-white/5 bg-[#1F2228]/50 text-slate-500'
                            }`}
                        >
                            {plan.tag && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-3 py-1 rounded-full whitespace-nowrap font-black shadow-lg z-10 uppercase tracking-tighter">
                                    {plan.tag}
                                </div>
                            )}
                            <span className={`text-[12px] font-black mb-2 ${selectedPlanId === plan.id ? 'text-[#FFD101]' : ''}`}>{plan.name}</span>
                            <div className={`flex items-baseline ${selectedPlanId === plan.id ? 'text-[#FFD101]' : 'text-white'}`}>
                                <span className="text-xs font-bold mr-0.5">¥</span>
                                <span className="text-2xl font-black tracking-tighter">{plan.price}</span>
                            </div>
                            <span className="text-[10px] opacity-30 line-through mt-1 font-bold">¥{plan.originalPrice}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 8. 固定底部操作 */}
            <div className="fixed bottom-0 left-0 w-full bg-[#16181D]/90 backdrop-blur-2xl border-t border-white/5 p-6 z-[50] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                <div className="max-w-md mx-auto text-center">
                    <button 
                        onClick={() => setShowPayModal(true)}
                        className="w-full py-5 bg-[#FFD101] text-slate-900 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-[0.98] transition-transform flex items-center justify-center group"
                    >
                        立即开通服务
                        <ChevronRight size={24} strokeWidth={4} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <p className="mt-3 text-[10px] text-white/20 font-black tracking-widest uppercase">官方安全认证会员服务</p>
                </div>
            </div>

            {showPayModal && (
                <PurchaseModal 
                    plan={currentPlans.find(p => p.id === selectedPlanId)!}
                    levelName={currentLevelData.name}
                    onClose={() => setShowPayModal(false)}
                    onConfirm={() => setShowPayModal(false)}
                />
            )}
        </div>
    );
};
