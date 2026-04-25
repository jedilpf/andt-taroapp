
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    ArrowLeft, ChevronRight, Zap, ShieldCheck, Clock, Package, Flame,
    Star, Info, CheckCircle2, Award, Coins, ShoppingBag, ArrowUpRight,
    ThermometerSun, Sun, Snowflake, Droplets, Leaf, Truck, Play, Timer,
    UserCheck, Smartphone, Siren, Heart, Apple, ShoppingCart, X, Loader2,
    MapPin, Gift, Check, Users, UserPlus, GraduationCap, Stethoscope, Medal, ShieldPlus, Plus, ShoppingBasket
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, SpecialIdentity } from '../../../types';
import SupermarketZone from './SupermarketZone';
import RechargeZone from './RechargeZone';
import FreshZone from './FreshZone';
import DigitalZone from './DigitalZone';
import MedicineZone from './MedicineZone';
import TakeoutZone from './TakeoutZone';
import TravelZone from './TravelZone';

// --- 全局通用成功/处理反馈组件 ---
const ActionFeedback = ({ type, title, desc, btnText, onBtnClick, icon: Icon, color }: any) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in h-full">
        <div className={`w-24 h-24 ${color} rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl`}>
            <Icon size={48} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-400 font-bold mb-10 leading-relaxed px-6">{desc}</p>
        <button
            onClick={onBtnClick}
            className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
        >
            {btnText}
        </button>
    </div>
);

// --- 专区 1: 全屋换新 (补贴科技风 - 包含申请链路) ---
const RenewalZone = () => {
    const { currentUser, createOrder } = useApp();
    const [step, setStep] = useState<'intro' | 'applying' | 'success'>('intro');
    const navigate = useNavigate();

    // 检查是否有特殊身份
    const hasSpecialIdentity = currentUser?.specialIdentity && currentUser.specialIdentity !== SpecialIdentity.NONE;

    const getIdentityLabel = (id?: SpecialIdentity) => {
        switch (id) {
            case SpecialIdentity.TEACHER: return { text: '优秀教师', icon: GraduationCap, color: 'text-blue-500' };
            case SpecialIdentity.DOCTOR: return { text: '医务人员', icon: Stethoscope, color: 'text-emerald-500' };
            case SpecialIdentity.VETERAN: return { text: '退伍军人', icon: Medal, color: 'text-orange-500' };
            case SpecialIdentity.MARTYR_CHILD: return { text: '烈士子女', icon: ShieldPlus, color: 'text-rose-500' };
            default: return null;
        }
    };

    const identityInfo = getIdentityLabel(currentUser?.specialIdentity);

    const handleApply = () => {
        setStep('applying');
        setTimeout(() => {
            setStep('success');
            // 后台自动生成一个测绘订单
            createOrder({
                type: 'Inspection',
                title: '全屋换新现场测绘',
                description: `【${identityInfo?.text || '普通用户'}补贴申请】预约现场测绘及线路评估方案设计。`,
                priceEstimate: { min: 0, max: 0, final: 0 },
                location: currentUser?.location,
                status: OrderStatus.PENDING,
                scheduledTime: '24小时内联系'
            });
        }, 2000);
    };

    if (step === 'applying') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white animate-fade-in">
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-slate-900">
                        <Smartphone size={40} />
                    </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">正在验证补贴资格</h3>
                <p className="text-sm text-slate-400 font-bold">正在调取您的实名信息与房产信息...</p>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <ActionFeedback
                icon={Award}
                color="bg-[#00DFA2]"
                title="补贴申请已通过"
                desc={`尊敬的 ${currentUser?.name}，您的 7.5 折全屋换新补贴已生效。师傅将在 24 小时内与您预约上门测绘。`}
                btnText="查看我的订单"
                onBtnClick={() => navigate('/user/orders')}
            />
        );
    }

    return (
        <div className="animate-fade-in pb-32">
            <div className="bg-[#0F172A] pt-24 pb-14 px-8 relative overflow-hidden rounded-b-[3.5rem] shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-[#FFD101] text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-md">OFFICIAL</span>
                        <span className="text-white/60 text-xs font-bold tracking-widest uppercase">安电通数字焕新工程</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">全屋开关换新<br /><span className="text-[#00DFA2]">政府补贴 7.5折</span></h1>

                    {hasSpecialIdentity ? (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl mb-8 flex items-center animate-fade-up">
                            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 ${identityInfo?.color}`}>
                                {identityInfo && <identityInfo.icon size={28} />}
                            </div>
                            <div>
                                <p className="text-white font-black text-sm">识别到您是：{identityInfo?.text}</p>
                                <p className="text-[#00DFA2] text-[10px] font-bold">已自动解锁：上门测绘费 ¥0.00 专项优待</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm font-medium mb-8 max-w-[80%]">上海市社区电力设施焕新工程专项补贴，每户最高立减 ¥500。</p>
                    )}

                    <button onClick={handleApply} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center group">
                        {hasSpecialIdentity ? '立即预约 0元测绘' : '立即申领补贴'} <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <Package size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
            </div>

            <div className="px-5 -mt-8 relative z-20 mb-8">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 flex justify-between">
                    {[
                        { title: '在线申请', desc: '系统实时核验', icon: Smartphone },
                        { title: '师傅上门', desc: '精准测量方案', icon: UserCheck },
                        { title: '完成换新', desc: '官方五年质保', icon: ShieldCheck }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center flex-1">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-2 border border-slate-100"><step.icon className="text-slate-800" size={24} /></div>
                            <h4 className="text-[11px] font-black text-slate-800 mb-1">{step.title}</h4>
                            <p className="text-[8px] text-slate-400 font-bold px-1">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 space-y-4">
                <h3 className="text-xl font-black text-slate-900">补贴专享单品</h3>
                {[1, 2].map(i => (
                    <div key={i} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center shadow-sm">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                            <img
                                src={i === 1 ? "/assets/products/item7.png" : "https://images.unsplash.com/photo-1558002038-1055907df827?w=300"}
                                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=300"; }}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div className="ml-4 flex-1">
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">补贴价</span>
                            <h4 className="font-black text-slate-800 text-sm mt-1">{i === 1 ? '施耐德 iC65N 断路器' : '松下 7孔防雷插座面板'}</h4>
                            <div className="flex items-end justify-between mt-2">
                                <p className="text-xl font-black text-red-600">¥{i === 1 ? '32.5' : '18.9'}</p>
                                <button onClick={handleApply} className="p-2 bg-slate-900 text-white rounded-xl active:scale-90 transition-transform"><PlusIcon size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 专区 2: 冬季取暖 (温馨暖色风 - 包含秒杀领券链路) ---
const WarmthZone = () => {
    const [claimed, setClaimed] = useState(false);
    const [claiming, setClaiming] = useState(false);

    const handleClaim = () => {
        setClaiming(true);
        setTimeout(() => {
            setClaiming(false);
            setClaimed(true);
        }, 1200);
    };

    return (
        <div className="animate-fade-in pb-32">
            <div className="bg-gradient-to-br from-orange-600 to-red-700 pt-24 pb-14 px-8 relative overflow-hidden rounded-b-[3.5rem] shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="p-1 bg-yellow-400 rounded-md text-red-700 animate-pulse"><Flame size={12} fill="currentColor" /></div>
                        <span className="text-white/80 text-xs font-black tracking-widest uppercase">WINTER WARMTH</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">冬季取暖节<br /><span className="text-yellow-300">电热毯 ¥49 起</span></h1>
                    <p className="text-orange-50 text-sm font-medium mb-8 max-w-[80%]">社区集体采购，温暖直达家门。全场取暖设备享以旧换新补贴。</p>

                    <button
                        onClick={handleClaim}
                        disabled={claimed || claiming}
                        className={`px-8 py-3.5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center ${claimed ? 'bg-white/20 text-white/50' : 'bg-yellow-400 text-red-900'}`}
                    >
                        {claiming ? <Loader2 size={24} className="animate-spin mr-2" /> : (claimed ? <Check size={24} className="mr-2" /> : null)}
                        {claimed ? '已存入卡包' : '立即抢暖冬神券'}
                    </button>
                </div>
                <ThermometerSun size={200} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
            </div>

            {/* 成功领券后的浮窗 */}
            {claimed && (
                <div className="px-6 mt-4 animate-bounce">
                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-red-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mr-3 font-black">¥50</div>
                            <span className="text-xs font-black text-slate-800">全场取暖设备通用红包</span>
                        </div>
                        <span className="text-[10px] font-black text-red-500 underline">去下单</span>
                    </div>
                </div>
            )}

            <div className="px-6 mt-8">
                <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100 flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mr-3"><Siren size={20} /></div>
                        <div>
                            <p className="text-sm font-black text-red-800">取暖用电安全</p>
                            <p className="text-[10px] text-red-500 font-bold">点击查看：大功率电器避坑指南</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-red-300" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { t: '恒温水暖毯', p: '299', img: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400" },
                        { t: '踢脚线取暖器', p: '499', img: "https://images.unsplash.com/photo-1626071494702-4204c3e58b1f?w=400" }
                    ].map(item => (
                        <div key={item.t} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-orange-50 active:scale-95 transition-transform">
                            <div className="aspect-square rounded-3xl overflow-hidden mb-4 bg-slate-50">
                                <img src={item.img} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=400"; }} className="w-full h-full object-cover" alt="" />
                            </div>
                            <h4 className="font-black text-slate-800 text-xs px-1">{item.t}</h4>
                            <div className="flex items-center justify-between mt-3 px-1">
                                <span className="text-red-600 font-black text-xl">¥{item.p}</span>
                                <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><ShoppingBag size={18} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 专区 3: 生鲜直供 (清新自然风 - 包含完整拼团链路) ---


// --- 专区 6: 急速到家 (地图风) ---


// --- 专区 4: 通用占位 (模拟链路) ---
const GenericZone = ({ type }: { type: string }) => {
    const titleMap: Record<string, string> = {
        'supermarket': '安电超市',
        'digital': '数码电器',
        'delivery': '急速到家',
        'recharge': '充值中心',
        'pin': '9.9元拼',
        'coupon': '领优惠券',
        'vip': '尊享会员',
        'brand': '品牌特卖',
        'subsidy': '百亿补贴',
        'quality': '品质生活',
        'travel': '社区出行',
        'medicine': '买药秒送',
        'takeout': '外卖',
        'all': '全部频道'
    };

    const title = titleMap[type] || '未定义专区';

    return (
        <div className="animate-fade-in pb-32">
            <div className="bg-[#0F172A] pt-24 pb-14 px-8 relative overflow-hidden rounded-b-[3.5rem] shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-blue-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md">SIMULATION</span>
                        <span className="text-white/60 text-xs font-bold tracking-widest uppercase">功能模拟</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                        {title}<br /><span className="text-blue-400 text-2xl">功能建设中</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mb-8 max-w-[80%]">此功能模块为演示链路，用于展示应用架构与交互流程。</p>

                    <div className="p-4 bg-white/10 backdrop-blur border border-white/10 rounded-2xl">
                        <p className="text-xs text-slate-300 font-mono">Route: /store/activity/{type}</p>
                        <p className="text-xs text-slate-300 font-mono mt-1">Status: Placeholder</p>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8 text-center text-slate-300">
                <p>更多精彩内容即将上线...</p>
            </div>
        </div>
    );
}

// --- 主容器组件 ---
export const UserActivityZone = () => {
    const navigate = useNavigate();
    const { type } = useParams<{ type: string }>();

    // 根据参数渲染不同子页面
    const renderContent = () => {
        switch (type) {
            case 'renewal': return <RenewalZone />;
            case 'warmth': return <WarmthZone />;
            case 'fresh': return <FreshZone />;
            case 'digital': return <DigitalZone />;
            case 'supermarket': return <SupermarketZone />;
            case 'recharge': return <RechargeZone />;
            case 'medicine': return <MedicineZone />;
            case 'takeout': return <TakeoutZone />;
            case 'travel': return <TravelZone />;

            default: return <GenericZone type={type || 'unknown'} />;
        }
    };

    const headerTheme = {
        renewal: 'bg-black/20',
        warmth: 'bg-red-900/20',
        fresh: 'bg-emerald-950/40',
        supermarket: 'bg-red-900/20',
        takeout: 'bg-orange-900/10',
        travel: 'bg-slate-900/10'
    }[type as 'renewal' | 'warmth' | 'fresh' | 'supermarket' | 'takeout' | 'travel'] || 'bg-slate-900/20';

    return (
        <div className="h-[100dvh] bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header - 沉浸式透明导航 (超市/数码/生鲜/药房/外卖/出行专区自带导航，此处隐藏) */}
            {type !== 'supermarket' && type !== 'digital' && type !== 'fresh'
                && type !== 'medicine' && type !== 'takeout' && type !== 'travel' && (
                    <div className="absolute top-0 left-0 w-full z-[100] p-4 pt-safe flex items-center justify-between">
                        <button onClick={() => navigate(-1)} className={`p-2 ${headerTheme} backdrop-blur-md rounded-full text-white active:scale-90 transition-transform border border-white/10`}>
                            <ArrowLeft size={24} />
                        </button>

                        <div className="w-10"></div>
                    </div>
                )}

            <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                {renderContent()}
            </div>
        </div>
    );
};

const PlusIcon = (props: any) => <Zap {...props} />;
