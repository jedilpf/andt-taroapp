
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
    ArrowLeft, Home, Droplets, Lightbulb, ChevronRight, Star, 
    X, CheckCircle2, Loader2, MapPin, Smartphone, Flame, Zap, Check, Building2,
    ShieldCheck, SendHorizontal, Wallet, Info, UserCircle2, Landmark, History, UserCheck, 
    PlusCircle, Coins, Trash2, Calendar, Trophy, Gift, Sparkles, TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddressSelector } from '../../components/user/UserShared';

// --- 积分规则说明弹窗 ---
const PointsRulesModal = ({ onClose }: { onClose: () => void }) => {
    return createPortal(
        <div className="fixed inset-0 z-[1200] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] p-6 relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[85vh]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">积分权益规则</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
                    <section>
                        <h4 className="text-sm font-black text-blue-600 mb-3 flex items-center">
                            <PlusCircle size={16} className="mr-2"/> 如何获得积分？
                        </h4>
                        <div className="space-y-3">
                            {[
                                { t: '每日签到', d: '连续签到最高可获得100积分奖励', p: '+5~100' },
                                { t: '完成报修单', d: '订单实付金额 1:1 转化为积分', p: '实付金额' },
                                { t: '参与公益活动', d: '参与社区志愿活动，每次奖励50积分起', p: '+50起' },
                                { t: '新用户首单', d: '完成首单服务，额外赠送1000积分', p: '+1000' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{item.t}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{item.d}</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{item.p}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-sm font-black text-orange-600 mb-3 flex items-center">
                            <SendHorizontal size={16} className="mr-2"/> 如何使用积分？
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-sm font-black text-slate-800">1. 直接抵扣费用</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">在“福利大厅”中，可将积分按 100:1 比例直接兑换为物业费、水电费余额。</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-sm font-black text-slate-800">2. 商城换购</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">在“生活商城”中，指定商品支持积分全额兑换或“积分+现金”换购。</p>
                            </div>
                        </div>
                    </section>
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                    <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg">我明白了</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 每日签到中心界面 ---
const CheckInModal = ({ onClose, onCheckInSuccess }: { onClose: () => void, onCheckInSuccess: (pts: number) => void }) => {
    const [checkedDays, setCheckedDays] = useState([true, true, false, false, false, false, false]);
    const [loading, setLoading] = useState(false);

    const rewards = [5, 5, 10, 10, 15, 15, 100];
    const currentDay = 3; 

    const handleDoCheckIn = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onCheckInSuccess(rewards[currentDay - 1]);
            setCheckedDays(prev => {
                const next = [...prev];
                next[currentDay - 1] = true;
                return next;
            });
        }, 800);
    };

    return createPortal(
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="w-full max-sm bg-white rounded-[3rem] overflow-hidden relative z-10 animate-scale-in shadow-2xl">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
                            <Calendar size={40} className="text-white" strokeWidth={2.5}/>
                        </div>
                        <h3 className="text-2xl font-black text-white">坚持签到 · 领福利</h3>
                        <p className="text-blue-100 text-xs mt-2 font-bold opacity-80 uppercase tracking-widest">Continuous Check-in Rewards</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"><X size={20}/></button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-4 gap-3 mb-8">
                        {rewards.map((pts, i) => {
                            const isChecked = checkedDays[i];
                            const isToday = i === currentDay - 1;
                            const isBigPrize = i === 6;
                            
                            return (
                                <div key={i} className={`relative rounded-2xl flex flex-col items-center justify-center py-3 border-2 transition-all ${isChecked ? 'bg-emerald-50 border-emerald-100' : (isToday ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent')} ${isBigPrize ? 'col-span-2 aspect-auto' : 'aspect-square'}`}>
                                    {isBigPrize && <Trophy size={16} className="absolute -top-2 -right-1 text-amber-500 fill-amber-500 rotate-12" />}
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isChecked ? 'text-emerald-500' : 'text-slate-400'}`}>第{i+1}天</span>
                                    <div className="my-1">
                                        {isChecked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Coins size={16} className={isBigPrize ? 'text-amber-500' : 'text-slate-300'} />}
                                    </div>
                                    <span className={`text-[10px] font-black ${isChecked ? 'text-emerald-600' : 'text-slate-600'}`}>+{pts}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start mb-8">
                        <Info size={16} className="text-orange-500 mr-2 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-orange-700 font-bold leading-relaxed">连续签到7天可解锁“百元积分大礼包”。中途断签将从第1天重新开始计算哦！</p>
                    </div>

                    {!checkedDays[currentDay - 1] ? (
                        <button 
                            onClick={handleDoCheckIn}
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles size={20} className="mr-2 text-yellow-400 fill-yellow-400"/>}
                            立即签到
                        </button>
                    ) : (
                        <button disabled className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg cursor-not-allowed">
                            今日已签到
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 虚拟兑换记录弹窗 ---
const ExchangeRecordsModal = ({ records, onClose }: { records: any[], onClose: () => void }) => {
    return createPortal(
        <div className="fixed inset-0 z-[1100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] p-6 relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[80vh]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center">
                        <History size={20} className="mr-2 text-blue-500" /> 兑换记录
                    </h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                    {records.length === 0 ? (
                        <div className="py-20 flex flex-col items-center opacity-20 grayscale">
                            <History size={64} />
                            <p className="mt-4 font-black">暂无记录</p>
                        </div>
                    ) : (
                        records.map((rec, i) => (
                            <div key={rec.id} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <rec.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{rec.label}-直兑</p>
                                        <div className="flex items-center text-[10px] text-slate-400 font-bold mt-0.5">
                                            <Calendar size={10} className="mr-1"/> {rec.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-600">+{rec.amount}{rec.unit}</p>
                                    <p className="text-[10px] text-slate-300 font-bold">消耗 {rec.points} 积分</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 兑换与选择详情弹窗 (核心修复点) ---
const ExchangeDetailModal = ({ service, onClose, onConfirm, records }: { service: any, onClose: () => void, onConfirm: (amt: number, pts: number) => void, records: any[] }) => {
    const { currentUser } = useApp();
    const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddrPicker, setShowAddrPicker] = useState(false);
    const [showRecords, setShowRecords] = useState(false);
    
    // 账户信息
    const [address, setAddress] = useState(currentUser?.location?.address || '');
    const [ownerName, setOwnerName] = useState(currentUser?.name.split(' ')[0] || '李女士');
    const [phone, setPhone] = useState(currentUser?.phone || '13800138000');
    const [propertyName, setPropertyName] = useState('万科物业管理服务中心'); 
    const [isAgreed, setIsAgreed] = useState(true);

    // 积分计算逻辑 (如果是物业费，1个月设为5000积分基数)
    const customPoints = useMemo(() => {
        const amt = parseFloat(customAmount);
        if (isNaN(amt)) return 0;
        const base = service.id === 'prop' ? 5000 : 100;
        return Math.ceil(amt * base);
    }, [customAmount, service.id]);

    const currentAmount = isCustom ? parseFloat(customAmount) : service.plans[selectedPlanIdx].amount;
    const currentPoints = isCustom ? customPoints : service.plans[selectedPlanIdx].points;
    const canAfford = (currentUser?.points || 0) >= currentPoints && (isCustom ? !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) > 0 : true);

    const handleConfirm = () => {
        if (!address || !ownerName || !phone || (service.id === 'prop' && !propertyName)) {
            alert('请完整填写账户绑定信息');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            onConfirm(currentAmount, currentPoints);
            setLoading(false);
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="w-full max-w-md bg-[#F8FAFC] rounded-t-[2.5rem] p-6 relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[95vh]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                
                <div className="overflow-y-auto no-scrollbar pb-32">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center shadow-lg shrink-0`}>
                            <service.icon size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{service.label}-直兑</h3>
                            <div className="flex items-center mt-1 space-x-2">
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100">实时发放</span>
                                <span className="text-[10px] text-slate-400 font-bold truncate">由平台联合机构提供</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform shrink-0"><X size={20}/></button>
                    </div>

                    <div className="bg-[#1C1E22] rounded-[1.8rem] p-6 mb-6 relative overflow-hidden shadow-xl border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Building2 size={80} className="text-white"/></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">账户信息</p>
                                <button 
                                    onClick={() => setShowRecords(true)}
                                    className="bg-white/10 px-2 py-1 rounded-lg flex items-center border border-white/5 active:scale-95 transition-transform"
                                >
                                    <History size={10} className="text-[#FFD101] mr-1"/>
                                    <span className="text-[9px] text-white font-bold">兑换记录</span>
                                </button>
                            </div>
                            <div className="flex items-center text-white space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <UserCheck size={20} className="text-[#FFD101]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-black tracking-tight truncate">{ownerName}</p>
                                    <p className="text-[11px] text-white/50 font-bold tracking-wider">{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-amber-400 font-bold mt-5 flex items-center bg-white/5 py-1.5 px-3 rounded-lg w-fit">
                                <Info size={12} className="mr-1.5 shrink-0"/> 兑换后权益直接发放至此账户
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center px-1 mb-4">
                            <div className="w-1 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">接收账户绑定</span>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                            {service.id === 'prop' && (
                                <div className="flex items-center justify-between h-14 px-4 border-b border-slate-50 overflow-hidden">
                                    <div className="flex items-center text-slate-400 shrink-0 w-24">
                                        <Landmark size={18} className="shrink-0" />
                                        <span className="text-xs font-black ml-2 whitespace-nowrap">物业名称</span>
                                    </div>
                                    <input 
                                        value={propertyName}
                                        onChange={e => setPropertyName(e.target.value)}
                                        className="flex-1 text-right bg-transparent outline-none text-sm font-black text-slate-800 p-0 h-full leading-none"
                                        placeholder="输入物业公司"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-50 overflow-hidden">
                                <div className="flex items-center text-slate-400 shrink-0 w-24">
                                    <UserCircle2 size={18} className="shrink-0" />
                                    <span className="text-xs font-black ml-2 whitespace-nowrap">户主姓名</span>
                                </div>
                                <input 
                                    value={ownerName}
                                    onChange={e => setOwnerName(e.target.value)}
                                    className="flex-1 text-right bg-transparent outline-none text-sm font-black text-slate-800 p-0 h-full leading-none"
                                    placeholder="输入姓名"
                                />
                            </div>

                            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-50 overflow-hidden">
                                <div className="flex items-center text-slate-400 shrink-0 w-24">
                                    <Smartphone size={18} className="shrink-0" />
                                    <span className="text-xs font-black ml-2 whitespace-nowrap">绑定手机</span>
                                </div>
                                <input 
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="flex-1 text-right bg-transparent outline-none text-sm font-black text-slate-800 p-0 h-full leading-none tracking-wider"
                                    placeholder="手机号码"
                                />
                            </div>

                            <div onClick={() => setShowAddrPicker(true)} className="flex items-center justify-between h-14 px-4 cursor-pointer active:bg-slate-50 transition-colors overflow-hidden">
                                <div className="flex items-center text-slate-400 shrink-0 w-24">
                                    <MapPin size={18} className="shrink-0" />
                                    <span className="text-xs font-black ml-2 whitespace-nowrap">服务地址</span>
                                </div>
                                <div className="flex-1 text-right min-w-0 flex items-center justify-end ml-4">
                                    <p className="text-sm font-black text-slate-800 truncate leading-none">{address || '从库中选择'}</p>
                                    <ChevronRight size={16} className="text-slate-300 ml-1 shrink-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center px-1 mb-4">
                            <div className="w-1 h-3 bg-amber-500 rounded-full mr-2"></div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">选择兑换权益</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {service.plans.map((plan: any, idx: number) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setSelectedPlanIdx(idx); setIsCustom(false); }}
                                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center relative overflow-hidden ${(!isCustom && selectedPlanIdx === idx) ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]' : 'border-white bg-white text-slate-400 shadow-sm'}`}
                                >
                                    <span className={`text-2xl font-black mb-1 ${(!isCustom && selectedPlanIdx === idx) ? 'text-white' : 'text-slate-900'}`}>{plan.amount}{service.unit}</span>
                                    <span className="text-[10px] font-black opacity-60 tracking-tighter">{plan.points} 积分兑换</span>
                                    {(!isCustom && selectedPlanIdx === idx) && (
                                        <div className="absolute top-0 right-0 bg-white text-slate-900 p-1 rounded-bl-xl shadow-md">
                                            <Check size={12} strokeWidth={4}/>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div 
                            onClick={() => setIsCustom(true)}
                            className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer relative ${isCustom ? 'border-slate-900 bg-white shadow-xl' : 'border-dashed border-slate-200 bg-slate-50/50 text-slate-400'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase tracking-widest">自定义{service.unit === '个月' ? '时长' : '金额'}</span>
                                {isCustom && <span className="text-[10px] text-amber-600 font-black animate-pulse">消耗 {customPoints} 积分</span>}
                            </div>
                            <div className="flex items-center h-8">
                                <input 
                                    type="number"
                                    value={customAmount}
                                    onChange={e => setCustomAmount(e.target.value)}
                                    placeholder={`输入兑换${service.unit === '个月' ? '月份' : '金额'}`}
                                    className={`flex-1 bg-transparent outline-none text-2xl font-black p-0 h-full leading-none placeholder:text-slate-200 ${isCustom ? 'text-slate-900' : 'text-slate-300'}`}
                                />
                                <span className={`text-2xl font-black ml-2 leading-none ${isCustom ? 'text-slate-900' : 'text-slate-300'}`}>{service.unit}</span>
                            </div>
                            {!isCustom && <div className="absolute inset-0 z-10"></div>}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white p-6 border-t border-slate-100 pt-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <button onClick={() => setIsAgreed(!isAgreed)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isAgreed ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                            {isAgreed && <Check size={10} strokeWidth={4}/>}
                        </button>
                        <span className="text-[10px] text-slate-400 font-bold">确认账户信息无误并同意《权益发放协议》</span>
                    </div>
                    
                    <button 
                        disabled={loading || !canAfford || !isAgreed} 
                        onClick={handleConfirm}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center ${canAfford && isAgreed ? 'bg-slate-900 text-white' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none'}`}
                    >
                        {loading ? (
                            <div className="flex items-center"><Loader2 className="animate-spin mr-3" size={24}/> 处理中...</div>
                        ) : (
                            <div className="flex items-center">
                                {canAfford ? `扣除 ${currentPoints} 积分并发放` : '积分不足或数值无效'}
                            </div>
                        )}
                    </button>
                </div>
            </div>
            {showAddrPicker && <AddressSelector onClose={() => setShowAddrPicker(false)} onSelect={(loc) => { setAddress(loc.address); setShowAddrPicker(false); }} />}
            {showRecords && <ExchangeRecordsModal records={records} onClose={() => setShowRecords(false)} />}
        </div>,
        document.body
    );
};

export const PointsMall = () => {
    const navigate = useNavigate();
    const { currentUser, spendPoints, earnPoints } = useApp();
    const [selectedService, setSelectedService] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState<any>(null);
    const [showRules, setShowRules] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);
    
    const [records, setRecords] = useState<any[]>(() => {
        return [
            { id: '1', label: '电费', icon: Lightbulb, amount: 50, unit: '元', points: 5000, time: '2023-11-20 14:30' },
            { id: '2', label: '物业费', icon: Home, amount: 3, unit: '个月', points: 15000, time: '2023-11-15 09:15' }
        ];
    });

    const serviceGroups = [
        {
            id: 'prop', 
            label: '物业费', 
            icon: Home, 
            color: 'bg-blue-50 text-blue-600',
            desc: '物业费-时长直兑',
            unit: '个月',
            plans: [
                { amount: 1, points: 5000 },
                { amount: 3, points: 15000 },
                { amount: 6, points: 28000 },
                { amount: 12, points: 55000 },
            ]
        },
        {
            id: 'elec', 
            label: '电费', 
            icon: Lightbulb, 
            color: 'bg-amber-50 text-amber-600',
            desc: '电费-余额直兑',
            unit: '元',
            plans: [
                { amount: 30, points: 3000 },
                { amount: 50, points: 5000 },
                { amount: 100, points: 10000 },
                { amount: 200, points: 19500 },
            ]
        },
        {
            id: 'water', 
            label: '水费', 
            icon: Droplets, 
            color: 'bg-sky-50 text-sky-600',
            desc: '水费-余额直兑',
            unit: '元',
            plans: [
                { amount: 10, points: 1000 },
                { amount: 20, points: 2000 },
                { amount: 50, points: 5000 },
            ]
        },
        {
            id: 'gas', 
            label: '燃气费', 
            icon: Flame, 
            color: 'bg-rose-50 text-rose-600',
            desc: '燃气费-余额直兑',
            unit: '元',
            plans: [
                { amount: 30, points: 3000 },
                { amount: 50, points: 5000 },
            ]
        },
        {
            id: 'phone', 
            label: '话费', 
            icon: Smartphone, 
            color: 'bg-emerald-50 text-emerald-600',
            desc: '话费-余额直兑',
            unit: '元',
            plans: [
                { amount: 10, points: 1000 },
                { amount: 30, points: 3000 },
                { amount: 50, points: 5000 },
                { amount: 100, points: 9800 },
            ]
        }
    ];

    const handleExchangeConfirm = (amt: number, pts: number) => {
        spendPoints(pts);
        
        const newRecord = {
            id: Date.now().toString(),
            label: selectedService.label,
            icon: selectedService.icon,
            amount: amt,
            unit: selectedService.unit,
            points: pts,
            time: new Date().toLocaleString([], { hour12: false }).replace(/\//g, '-')
        };
        setRecords(prev => [newRecord, ...prev]);

        setSelectedService(null);
        setShowSuccess({ amt, unit: selectedService.unit, label: selectedService.label, type: 'exchange' });
        setTimeout(() => setShowSuccess(null), 3000);
    };

    const handleCheckInSuccess = (pts: number) => {
        earnPoints(pts);
        setShowCheckIn(false);
        setShowSuccess({ amt: pts, label: '签到奖励', type: 'points' });
        setTimeout(() => setShowSuccess(null), 3000);
    };

    return (
        <div className="h-full bg-[#F6F7F9] flex flex-col relative overflow-hidden">
            <div className="bg-[#2563EB] pb-14 pt-8 px-5 rounded-b-[3.5rem] relative overflow-hidden z-10 shrink-0 shadow-xl">
                <div className="relative z-20 flex justify-between items-center text-white mb-8 pt-safe">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-all"><ArrowLeft size={24} strokeWidth={2.5}/></button>
                    <h1 className="text-lg font-black tracking-tight">社区福利大厅</h1>
                    <button onClick={() => setShowRules(true)} className="text-[11px] font-black bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm active:bg-white/20 transition-colors">权益规则</button>
                </div>
                
                <div className="relative z-20 flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">福利积分</div>
                        <h2 className="text-5xl font-black text-white tracking-tighter flex items-baseline">
                            {currentUser?.points || 0} 
                            <span className="text-sm font-black ml-1.5 opacity-60">积分</span>
                        </h2>
                    </div>
                    
                    <button 
                        onClick={() => setShowCheckIn(true)}
                        className="bg-[#FFD101] text-[#4A3900] px-6 py-3 rounded-2xl font-black text-xs shadow-2xl active:scale-95 flex items-center transition-all border-2 border-slate-900 ring-4 ring-white/10"
                    >
                        <Star size={16} className="mr-1.5 fill-current"/>签到领积分
                    </button>
                </div>
                
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-[60px]"></div>
            </div>

            <div className="px-4 -mt-7 z-[100] h-24 shrink-0">
                <div className="bg-white rounded-[2.5rem] p-3.5 shadow-2xl shadow-blue-900/10 flex justify-between items-center border border-white backdrop-blur-xl">
                    {serviceGroups.map(service => (
                        <button 
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className="flex flex-col items-center group active:scale-90 transition-all flex-1"
                        >
                            <div className={`w-11 h-11 rounded-2xl ${service.color} flex items-center justify-center mb-1.5 shadow-sm border border-white`}>
                                <service.icon size={22} strokeWidth={2.5}/>
                            </div>
                            <span className="text-[10px] font-black text-slate-600">{service.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6 no-scrollbar relative">
                <div className="flex items-center px-1">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full mr-3"></div>
                    <h3 className="font-black text-slate-800 text-lg">积分权益直兑专区</h3>
                    <div className="flex-1 border-t border-slate-200 ml-4 opacity-40"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {serviceGroups.map(service => (
                        <div 
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden"
                        >
                            <div className="flex items-center space-x-4 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center shadow-inner`}>
                                    <service.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-base">{service.label}-直兑</h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">{service.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 relative z-10">
                                <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full border border-blue-100">去发放</span>
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-active:translate-x-1 transition-transform">
                                    <ChevronRight size={20} strokeWidth={3} />
                                </div>
                            </div>
                            <service.icon size={100} className="absolute -right-4 -bottom-6 text-slate-400/5 rotate-12" />
                        </div>
                    ))}
                </div>

                <div className="py-10 flex flex-col items-center opacity-20">
                     <div className="w-10 h-10 rounded-full border-2 border-slate-400 flex items-center justify-center mb-4">
                         <ShieldCheck size={20} className="text-slate-500" />
                     </div>
                     <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase text-center leading-relaxed font-bold">安电通数字 · 机构联合直兑保障<br/>ANDIANTONG DIRECT PROVISIONING</p>
                </div>
            </div>

            {selectedService && (
                <ExchangeDetailModal 
                    service={selectedService} 
                    records={records}
                    onClose={() => setSelectedService(null)} 
                    onConfirm={handleExchangeConfirm} 
                />
            )}

            {showCheckIn && <CheckInModal onClose={() => setShowCheckIn(false)} onCheckInSuccess={handleCheckInSuccess} />}
            {showRules && <PointsRulesModal onClose={() => setShowRules(false)} />}

            {showSuccess && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none p-6">
                    <div className="bg-slate-900/95 backdrop-blur-xl text-white px-8 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center animate-scale-in border border-white/20 w-full max-w-xs text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${showSuccess.type === 'points' ? 'bg-amber-500 shadow-amber-500/40' : 'bg-green-50 shadow-green-500/40'}`}>
                             {showSuccess.type === 'points' ? <Sparkles size={40} className="text-white"/> : <SendHorizontal size={40} className="text-white" />}
                        </div>
                        <p className="text-2xl font-black tracking-tight">{showSuccess.label}{showSuccess.type === 'points' ? '成功' : '发放成功'}</p>
                        <div className="bg-white/10 px-4 py-2 rounded-2xl mt-4 border border-white/10">
                            <span className="text-sm font-bold text-slate-400">{showSuccess.type === 'points' ? '获得积分：' : '权益值：'}</span>
                            <span className="text-xl font-black text-[#FFD101]">{showSuccess.type === 'points' ? `+${showSuccess.amt}` : `${showSuccess.amt} ${showSuccess.unit}`}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-6 leading-relaxed">
                            {showSuccess.type === 'points' ? '坚持签到可获得更多奖励' : '福利已实时提交机构发放\n请在对应APP查看账户变动'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
