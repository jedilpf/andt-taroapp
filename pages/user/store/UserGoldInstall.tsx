
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
    ArrowLeft, Wrench, ShieldCheck, Star, ChevronRight, Zap, Target, 
    Award, CheckCircle2, ShieldAlert, Clock, X, Info, Loader2, Sparkles,
    CheckCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

// --- 套餐详情弹窗组件 ---
const PackageDetailModal = ({ pkg, onClose, onBook }: { pkg: any, onClose: () => void, onBook: (pkg: any) => void }) => {
    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="w-full max-w-md bg-[#F8FAFC] rounded-t-[3rem] p-6 relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[90vh]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-24">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-rose-50 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded border border-rose-100">{pkg.tag}</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-2">{pkg.title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={20}/></button>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-baseline mb-4">
                            <span className="text-red-600 font-black text-3xl">¥{pkg.price}</span>
                            <span className="text-xs text-slate-400 ml-2 font-bold">起 / 包含全部辅材费</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{pkg.desc}</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black text-slate-800 text-sm flex items-center">
                            <CheckCircle2 size={16} className="text-emerald-500 mr-2" /> 施工标准与内容
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {pkg.details.map((item: string, i: number) => (
                                <div key={i} className="bg-white p-4 rounded-2xl flex items-center space-x-3 border border-slate-50">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-xs font-black text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100 flex items-start space-x-3">
                        <ShieldCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-800 leading-relaxed font-bold">
                            金牌承诺：本套餐由平台 Top 1% 金牌技师承接，施工完毕后提供《数字化施工报告》，享五年品牌质保。
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white p-6 pb-safe border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={() => onBook(pkg)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
                    >
                        立即预约金牌师傅上门
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const UserGoldInstall = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [selectedPkg, setSelectedPkg] = useState<any>(null);
    const [booking, setBooking] = useState(false);

    const services = [
        { 
            id: 'g1',
            title: '全屋配电箱换新', 
            price: 299, 
            desc: '含空开、漏保组装及负载平衡调试。解决老旧箱体发热、跳闸隐患。', 
            tag: '金牌标杆',
            details: ['入户主线负载评估', '施耐德/公牛等国标空开组装', '漏电保护灵敏度专业测试', '数字化接线扭矩校准']
        },
        { 
            id: 'g2',
            title: '老房电路焕新施工', 
            price: 899, 
            desc: '全屋明/暗线局部更新、插座点位优化。针对20年以上老旧房屋定制。', 
            tag: '省心荐',
            details: ['老化线路抽样检测', '局部暗线换新/明线规范布置', '全屋开关插座点位升级', '五年用电安全联保']
        },
        { 
            id: 'g3',
            title: '别墅/复式全智控布线', 
            price: 1299, 
            desc: '大宅网络、智能系统底座专业施工。含千兆网络布线与智能面板调测。', 
            tag: '大师级',
            details: ['全宅智能拓扑方案设计', '屏蔽类/超六类网关布线', '智能家居网关节点调优', '强弱电防干扰专业隔离']
        },
    ];

    const handleConfirmBooking = (pkg: any) => {
        setBooking(true);
        setTimeout(() => {
            if (currentUser) {
                createOrder({
                    type: 'Install',
                    title: `金牌安装服务 - ${pkg.title}`,
                    description: `【金牌套餐预约】项目：${pkg.title}\n服务承诺：五年质保，金牌技师施工。`,
                    priceEstimate: { min: pkg.price, max: pkg.price, final: pkg.price },
                    location: currentUser.location,
                    status: OrderStatus.PENDING,
                    scheduledTime: '24小时内优先上门'
                });
            }
            setBooking(false);
            setSelectedPkg(null);
            navigate('/user/orders', { state: { initialTab: '待收货/使用' } });
        }, 1500);
    };

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-50">
                <button onClick={() => navigate(-1)} className="p-2.5 -ml-2 rounded-full bg-slate-100 active:scale-90 transition-transform">
                    <ArrowLeft size={24} className="text-slate-800" strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">金牌安装</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {/* Hero Banner - 完全还原截图 */}
                <div className="p-4">
                    <div className="bg-gradient-to-br from-[#E11D48] to-[#BE123C] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-rose-200">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-3">
                                <Award size={18} className="text-[#FFD101] fill-[#FFD101]" />
                                <span className="text-[11px] font-black tracking-[0.2em] uppercase opacity-90">GOLD STANDARD</span>
                            </div>
                            <h2 className="text-4xl font-black leading-tight tracking-tighter">金牌师傅 • 极致施工</h2>
                            <p className="mt-3 text-sm text-rose-100 font-bold opacity-80">严选平台 Top 1% 持证电工提供高品质服务</p>
                        </div>
                        {/* 装饰图标 */}
                        <Wrench size={160} className="absolute -right-6 -bottom-10 text-white/10 rotate-12" />
                    </div>
                </div>

                {/* Trust Badges - 完全还原截图 */}
                <div className="px-4 mb-8">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { t: '五年质保', icon: ShieldCheck },
                            { t: '明码实价', icon: CheckCircle },
                            { t: '不满意退', icon: ShieldCheck }
                        ].map(t => (
                            <div key={t.t} className="bg-white py-4 rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                                <t.icon size={20} className="text-rose-500 mb-2"/>
                                <span className="text-xs font-black text-slate-800">{t.t}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Header */}
                <div className="px-6 mb-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-800 text-lg flex items-center">
                            <div className="w-6 h-6 bg-rose-50 rounded-lg flex items-center justify-center mr-2">
                                <Target size={18} className="text-rose-500" strokeWidth={3} />
                            </div>
                            高标服务套餐
                        </h3>
                    </div>
                </div>

                {/* Service Cards - 完全还原截图列表布局 */}
                <div className="px-4 space-y-4">
                    {services.map((s) => (
                        <div 
                            key={s.id} 
                            onClick={() => setSelectedPkg(s)}
                            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all group relative overflow-hidden"
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center mb-1.5">
                                    <h4 className="text-lg font-black text-slate-900 truncate">{s.title}</h4>
                                    <span className="ml-2 bg-rose-50 text-rose-500 text-[9px] font-black px-2 py-0.5 rounded-md border border-rose-100 uppercase tracking-tighter">{s.tag}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-1 mb-4">{s.desc}</p>
                                <div className="flex items-baseline">
                                    <span className="text-red-600 font-black text-2xl tracking-tighter">¥{s.price}</span>
                                    <span className="text-[10px] text-slate-300 font-black ml-1.5 uppercase tracking-widest">起 / 包含辅材</span>
                                </div>
                            </div>
                            
                            {/* 黑色圆形箭头按钮 */}
                            <div className="w-12 h-12 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center shadow-xl group-active:scale-90 transition-transform shrink-0">
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部保障说明 */}
                <div className="mt-10 px-8 py-6 text-center opacity-30">
                    <ShieldCheck size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Andiantong Premium Service Assurance</p>
                </div>
            </div>

            {/* 预约处理遮罩 */}
            {booking && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-scale-in">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-rose-600">
                                <Sparkles size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">正在为您锁定金牌技师</h3>
                        <p className="text-xs text-slate-400 font-bold mt-2">专人对接，极速响应中...</p>
                    </div>
                </div>
            )}

            {selectedPkg && (
                <PackageDetailModal 
                    pkg={selectedPkg} 
                    onClose={() => setSelectedPkg(null)} 
                    onBook={handleConfirmBooking} 
                />
            )}
        </div>
    );
};
