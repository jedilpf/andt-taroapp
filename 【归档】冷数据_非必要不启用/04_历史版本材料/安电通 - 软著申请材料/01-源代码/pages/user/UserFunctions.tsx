
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FileText, Zap, Wrench, MapPin, Clock, Settings, Wallet, Ticket, Headphones, Gift, ShieldCheck, LogOut, ChevronRight, ArrowLeft, Sparkles, AlertCircle, Loader2, X, SearchCheck, ThermometerSun, ShoppingBag, Crown, ClipboardList, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/Shared';
import { AddressSelector, TimeSelector } from '../../components/user/UserShared';
import { OrderStatus, UserRole, Location } from '../../types';
import { analyzeElectricalIssue } from '../../services/geminiService';

// --- Orders Page ---
export const Orders = () => {
    const { orders, currentUser } = useApp();
    const navigate = useNavigate();
    
    const myOrders = orders.filter(o => o.clientId === currentUser?.id);

    return (
        <div className="min-h-full bg-gray-50">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">我的订单</h1>
            </div>
            <div className="p-4 space-y-4 pb-6">
                {myOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                        <FileText size={48} className="mb-4 text-gray-300"/>
                        <p>暂无订单记录</p>
                        <button onClick={() => navigate('/user/repair')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-bold text-sm shadow-lg shadow-green-500/30">去下单</button>
                    </div>
                ) : (
                    myOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-2">
                                    <div className={`p-2 rounded-lg ${order.type === 'Repair' ? 'bg-red-100 text-red-600' : (order.type === 'Install' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600')}`}>
                                        {order.type === 'Repair' ? <Zap size={16}/> : (order.type === 'Install' ? <Wrench size={16}/> : <ShieldCheck size={16}/>)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{order.title}</h3>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <StatusBadge status={order.status}/>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 mb-3">
                                <p className="mb-1 flex items-start"><MapPin size={14} className="mr-2 mt-0.5 text-gray-400 shrink-0"/> {order.location.address}</p>
                                <p className="flex items-center"><Clock size={14} className="mr-2 text-gray-400"/> {order.scheduledTime}</p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">联系客服</button>
                                <button className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold">查看详情</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Profile Page ---
export const UserProfilePage = () => {
    const { currentUser, logout, switchRole } = useApp();
    const navigate = useNavigate();

    // Mock stats matching the image
    const stats = {
        balance: currentUser?.balance?.toFixed(2) || '0.00',
        coupons: 2,
        points: 150
    };

    const MenuItem = ({ icon: Icon, bg, text, label, onClick, isRed }: any) => (
         <div onClick={onClick} className="flex items-center justify-between p-4 active:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${bg} ${text}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <span className={`font-medium ${isRed ? 'text-red-500' : 'text-gray-700'}`}>{label}</span>
            </div>
            {!isRed && <ChevronRight size={18} className="text-gray-300" />}
        </div>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-24">
            {/* Dark Header */}
            <div className="bg-slate-900 pt-12 pb-24 px-6 relative rounded-b-[2rem] shadow-xl overflow-hidden">
                {/* Abstract bg pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-500 via-gray-900 to-black pointer-events-none"></div>
                
                <div className="relative z-10">
                    {/* Top Bar */}
                    <div className="flex justify-end mb-4">
                         <button onClick={() => navigate('/user/settings')}><Settings size={24} className="text-gray-400 hover:text-white transition-colors"/></button>
                    </div>

                    {/* Profile Info */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-0.5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full">
                             <img src={currentUser?.avatar} className="w-16 h-16 rounded-full border-2 border-slate-900 object-cover" alt="avatar"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
                            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded border border-yellow-600/50 bg-yellow-900/30 text-yellow-500 text-xs backdrop-blur-sm">
                                <Crown size={12} className="mr-1 fill-yellow-500" /> 黄金会员
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-center px-2 text-white">
                        <div className="flex-1" onClick={() => navigate('/user/income')}> {/* Placeholder link */}
                             <p className="text-2xl font-bold tracking-tight">{stats.balance}</p>
                             <p className="text-xs text-gray-400 mt-1">钱包余额</p>
                        </div>
                        <div className="flex-1" onClick={() => navigate('/user/coupons')}>
                             <p className="text-2xl font-bold tracking-tight">{stats.coupons}</p>
                             <p className="text-xs text-gray-400 mt-1">优惠券</p>
                        </div>
                        <div className="flex-1" onClick={() => navigate('/user/benefits')}>
                             <p className="text-2xl font-bold tracking-tight">{stats.points}</p>
                             <p className="text-xs text-gray-400 mt-1">积分</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Content */}
            <div className="px-4 -mt-14 relative z-10 space-y-4">
                
                {/* VIP Banner */}
                <div className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-gray-900/20 border border-gray-700">
                     <div>
                        <div className="flex items-center text-amber-400 font-bold text-sm mb-0.5">
                            <Sparkles size={16} className="mr-1.5" /> 开通 Plus 会员
                        </div>
                        <p className="text-xs text-gray-400">免费上门检测 · 维修 8 折</p>
                     </div>
                     <button className="bg-amber-400 text-amber-950 text-xs font-bold px-4 py-2 rounded-full hover:bg-amber-300 transition-colors">
                        立即开通
                     </button>
                </div>

                {/* Menu Group 1 */}
                <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-50">
                    <MenuItem 
                        icon={ClipboardList} 
                        bg="bg-blue-50" text="text-blue-600" 
                        label="我的订单" 
                        onClick={() => navigate('/user/orders')} 
                    />
                    <MenuItem 
                        icon={Ticket} 
                        bg="bg-orange-50" text="text-orange-600" 
                        label="优惠券包" 
                        onClick={() => navigate('/user/coupons')} 
                    />
                    <MenuItem 
                        icon={MapPin} 
                        bg="bg-green-50" text="text-green-600" 
                        label="地址管理" 
                        onClick={() => navigate('/user/addresses')} 
                    />
                </div>

                {/* Menu Group 2 */}
                <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-50">
                    <MenuItem 
                        icon={Zap} 
                        bg="bg-purple-50" text="text-purple-600" 
                        label="切换到电工版" 
                        onClick={() => {switchRole(UserRole.ELECTRICIAN); navigate('/electrician/hall');}} 
                    />
                    <MenuItem 
                        icon={LogOut} 
                        bg="bg-red-50" text="text-red-500" 
                        label="退出登录" 
                        isRed
                        onClick={() => {logout(); navigate('/');}} 
                    />
                </div>
            </div>
        </div>
    );
};

// --- Repair Page ---
export const RepairPage = () => {
    const [desc, setDesc] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const { createOrder, currentUser } = useApp();
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if(!desc.trim()) return;
        setAnalyzing(true);
        try {
            const res = await analyzeElectricalIssue(desc);
            setResult(res);
        } catch (e) {
            setResult("无法连接到智能诊断服务，请直接预约师傅上门。");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleQuickOrder = () => {
        if(!currentUser) return;
        createOrder({
            type: 'Repair',
            title: '极速报修',
            description: desc || '用户使用极速报修功能下单',
            priceEstimate: { min: 30, max: 80 },
            location: currentUser.location,
            status: OrderStatus.PENDING
        });
        navigate('/user/orders');
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">电路急修</h1>
            </div>
            
            <div className="p-4 space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center"><Sparkles size={18} className="text-indigo-500 mr-2"/> AI 智能诊断</h2>
                    <textarea 
                        className="w-full p-4 bg-gray-50 rounded-xl text-sm min-h-[120px] outline-none border border-transparent focus:border-indigo-500 transition-colors"
                        placeholder="请描述故障现象，例如：'厨房插座冒火花'、'打开空调就跳闸'..."
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    />
                    <div className="mt-3 flex justify-end">
                         <button 
                            onClick={handleAnalyze}
                            disabled={analyzing || !desc}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center disabled:opacity-50"
                        >
                             {analyzing && <Loader2 className="animate-spin mr-2" size={16}/>}
                             智能分析
                         </button>
                    </div>
                    
                    {result && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                    <Zap size={16} className="text-indigo-600"/>
                                </div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {result}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800">一键下单</h2>
                        <span className="text-xs text-gray-400">最快 20 分钟上门</span>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mb-4">
                         <button className="p-3 border border-red-100 bg-red-50 rounded-xl text-red-600 text-sm font-bold flex flex-col items-center justify-center h-20">
                             <AlertCircle size={24} className="mb-1"/>
                             紧急故障
                         </button>
                         <button className="p-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-600 text-sm font-bold flex flex-col items-center justify-center h-20">
                             <Wrench size={24} className="mb-1"/>
                             常规维修
                         </button>
                     </div>
                     <button onClick={handleQuickOrder} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 active:scale-[0.98]">
                         呼叫电工
                     </button>
                </div>
            </div>
        </div>
    );
}

// --- Deep Inspection Page ---
export const DeepInspectionPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [loading, setLoading] = useState(false);

    const handleBooking = () => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
             createOrder({
                type: 'Inspection',
                title: '全屋深度电路体检',
                description: '服务包含：总配电箱检测、全屋开关插座排查、大功率电器负载测试、线路绝缘性检测。',
                priceEstimate: { min: 199, max: 299 },
                scheduledTime: '待协商',
                location: currentUser.location,
                status: OrderStatus.PENDING
            });
            setLoading(false);
            navigate('/user/orders');
        }, 1500);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">深度体检</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                     <div className="relative z-10">
                         <h2 className="text-3xl font-bold mb-2">全屋电路体检</h2>
                         <p className="opacity-90 text-sm mb-6 max-w-[70%]">消除看不见的隐患，为家人的安全保驾护航。建议每年一次。</p>
                         <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                             <span className="text-2xl font-bold">¥199</span>
                             <span className="text-xs opacity-80 ml-1">/次 起</span>
                         </div>
                     </div>
                     <ShieldCheck size={160} className="absolute -bottom-10 -right-10 opacity-20 rotate-12"/>
                </div>

                {/* Service Details */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">服务内容</h3>
                    <div className="space-y-4">
                        {[
                            { icon: Settings, title: "配电箱深度检测", desc: "检查漏保动作电流、接线端子是否松动发热" },
                            { icon: Zap, title: "开关插座排查", desc: "检测全屋插座接地状态、极性是否正确" },
                            { icon: ThermometerSun, title: "线路负载与发热", desc: "使用热成像仪检测线路是否存在过载发热" },
                            { icon: SearchCheck, title: "绝缘电阻测试", desc: "检测老旧线路绝缘层老化程度，防止漏电" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <item.icon size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 pb-8">
                    <button 
                        onClick={handleBooking} 
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2"/> : '立即预约体检'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">此服务由平台认证的金牌电工提供，包含专业检测报告</p>
                </div>
            </div>
        </div>
    );
};

// --- Install Page (New) ---
export const InstallPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [selectedService, setSelectedService] = useState<string>('灯具安装');
    const [desc, setDesc] = useState('');
    const [materials, setMaterials] = useState([
        { id: 1, name: '公牛五孔插座面板', price: 25, count: 0, image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=100&h=100&fit=crop' },
        { id: 2, name: 'LED吸顶灯 (卧室)', price: 89, count: 0, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100&h=100&fit=crop' },
        { id: 3, name: '单开双控开关', price: 18, count: 0, image: 'https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=100&h=100&fit=crop' },
        { id: 4, name: '电工绝缘胶带', price: 5, count: 0, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=100&h=100&fit=crop' },
    ]);

    const services = [
        { id: 'light', name: '灯具安装', basePrice: 30 },
        { id: 'switch', name: '开关插座', basePrice: 15 },
        { id: 'appliance', name: '家电接线', basePrice: 50 },
        { id: 'other', name: '其他安装', basePrice: 30 },
    ];

    const currentServicePrice = services.find(s => s.name === selectedService)?.basePrice || 0;
    
    const updateCount = (id: number, delta: number) => {
        setMaterials(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, count: Math.max(0, item.count + delta) };
            }
            return item;
        }));
    };

    const materialCost = materials.reduce((acc, curr) => acc + (curr.price * curr.count), 0);
    const totalEstimate = currentServicePrice + materialCost;

    const handleBooking = () => {
        if (!currentUser) return;
        const purchased = materials.filter(m => m.count > 0).map(m => `${m.name} x${m.count}`).join(', ');
        
        createOrder({
            type: 'Install',
            title: `上门安装 - ${selectedService}`,
            description: desc + (purchased ? `\n[代购材料]: ${purchased}` : ''),
            priceEstimate: { min: totalEstimate, max: totalEstimate + 50 },
            location: currentUser.location,
            status: OrderStatus.PENDING
        });
        navigate('/user/orders');
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50">
            <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">上门安装</h1>
            </div>

            {/* Add bottom padding to prevent content from being hidden by fixed footer */}
            <div className="p-4 space-y-4 pb-32">
                {/* Service Types */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-3 text-sm">选择服务类型</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {services.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedService(s.name)}
                                className={`p-3 rounded-xl text-sm font-bold flex justify-between items-center transition-all border ${selectedService === s.name ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-transparent text-gray-600'}`}
                            >
                                <span>{s.name}</span>
                                <span className="text-xs opacity-70">¥{s.basePrice}起</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Material Shop */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="font-bold text-gray-800 text-sm flex items-center">
                            <ShoppingBag size={16} className="mr-2 text-orange-500"/> 自营辅材 (师傅带上门)
                         </h2>
                    </div>
                    <div className="space-y-4">
                        {materials.map(item => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <img src={item.image} className="w-14 h-14 rounded-lg object-cover bg-gray-100" alt={item.name}/>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                    <p className="text-orange-500 font-bold text-sm">¥{item.price}</p>
                                </div>
                                <div className="flex items-center bg-gray-100 rounded-lg">
                                    <button onClick={() => updateCount(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg transition-colors font-bold disabled:opacity-30" disabled={item.count === 0}>-</button>
                                    <span className="w-8 text-center text-sm font-bold">{item.count}</span>
                                    <button onClick={() => updateCount(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-white rounded-lg transition-colors font-bold">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Remarks */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-2 text-sm">备注信息</h2>
                    <textarea 
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none min-h-[80px]"
                        placeholder="请描述具体安装位置、数量或特殊要求..."
                    />
                </div>
            </div>
                
            {/* Fixed Bottom Bar - Full Width */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
                <div className="max-w-screen-md mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400">预估总价 (含材料)</p>
                        <div className="flex items-baseline text-red-600">
                            <span className="text-sm font-bold">¥</span>
                            <span className="text-2xl font-extrabold mx-0.5">{totalEstimate}</span>
                            <span className="text-xs text-gray-400 ml-1">起</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleBooking}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    >
                        立即预约
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Activity Page ---
const EventBookingModal = ({ onClose }: { onClose: () => void }) => {
    const { currentUser, createOrder } = useApp();
    const navigate = useNavigate();
    const [time, setTime] = useState('尽快上门');
    // Initialize address from current user but allow changing only for this order
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 0, lng: 0, address: '选择服务地址' });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
             createOrder({
                type: 'Checkup',
                title: '冬季公益安全检测',
                description: '预约项目：冬季用电安全月公益检测（老旧线路、取暖设备、漏电保护）',
                priceEstimate: { min: 0, max: 0, final: 0 },
                scheduledTime: time,
                location: selectedLocation,
                status: OrderStatus.PENDING
            });
            setLoading(false);
            navigate('/user/orders');
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9990] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up pb-10 max-h-[85vh] overflow-y-auto pointer-events-auto relative z-10 mx-auto">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
                    <h3 className="text-lg font-bold text-gray-800">预约公益检测</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-500"/>
                    </button>
                </div>
                
                <div className="space-y-5 pb-6">
                    <div className="bg-sky-50 p-4 rounded-2xl flex items-center space-x-4 border border-sky-100">
                        <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">冬季用电安全检测</h4>
                            <p className="text-xs text-gray-500 mt-0.5">官方公益活动 · 全程免费</p>
                        </div>
                        <div className="flex-1 text-right">
                             <span className="text-lg font-bold text-green-600">¥0.00</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div onClick={() => setShowTimePicker(true)} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl cursor-pointer active:bg-gray-100 transition-colors">
                             <span className="font-bold text-gray-700 flex items-center"><Clock size={18} className="mr-2 text-gray-400"/> 上门时间</span>
                             <div className="flex items-center text-blue-600 font-medium text-sm">
                                 {time} <ChevronRight size={14} className="ml-1"/>
                             </div>
                        </div>
                        
                        <div onClick={() => setShowAddressPicker(true)} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl cursor-pointer active:bg-gray-100 transition-colors">
                             <span className="font-bold text-gray-700 flex items-center"><MapPin size={18} className="mr-2 text-gray-400"/> 上门地址</span>
                             <div className="flex items-center text-gray-600 text-sm text-right max-w-[60%]">
                                 <span className="truncate">{selectedLocation.address}</span> <ChevronRight size={14} className="ml-1 shrink-0"/>
                             </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70">
                            {loading ? <Loader2 className="animate-spin mr-2"/> : '确认免费预约'}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">每日限额 50 名，仅限本市住宅用户</p>
                    </div>
                </div>
            </div>
            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => {setTime(t); setShowTimePicker(false);}} />}
            {showAddressPicker && <AddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => {setSelectedLocation(loc); setShowAddressPicker(false);}} />}
        </div>,
        document.body
    );
};

export const ActivityPage = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-sky-50 pb-safe">
             <div className="bg-white p-4 shadow-sm flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">公益活动</h1>
            </div>
            <div className="p-4 pb-12">
                 <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden mb-6">
                      <div className="relative z-10">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20">冬季安全月</span>
                          <h2 className="text-3xl font-bold mt-3 mb-2">免费上门检修</h2>
                          <p className="opacity-90 text-sm mb-6 max-w-[80%]">针对本市老旧小区，提供免费的线路老化检测与隐患排查服务。</p>
                          <button onClick={() => setShowModal(true)} className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform">立即预约</button>
                      </div>
                      <ShieldCheck size={140} className="absolute -bottom-10 -right-10 opacity-20 rotate-12"/>
                 </div>

                 <h3 className="font-bold text-gray-800 mb-4 text-lg">活动详情</h3>
                 <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0">1</div>
                          <div>
                              <h4 className="font-bold text-gray-800">预约报名</h4>
                              <p className="text-sm text-gray-500 mt-1">在APP内填写地址与联系方式，选择上门时间。</p>
                          </div>
                      </div>
                       <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0">2</div>
                          <div>
                              <h4 className="font-bold text-gray-800">上门检测</h4>
                              <p className="text-sm text-gray-500 mt-1">持证电工上门，使用专业设备对全屋线路进行体检。</p>
                          </div>
                      </div>
                       <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0">3</div>
                          <div>
                              <h4 className="font-bold text-gray-800">出具报告</h4>
                              <p className="text-sm text-gray-500 mt-1">检测完成后，您将获得一份详细的《家庭用电安全报告》。</p>
                          </div>
                      </div>
                 </div>
            </div>
            {showModal && <EventBookingModal onClose={() => setShowModal(false)}/>}
        </div>
    )
}

// --- Electrician Booking Page (Specific) ---
export const ElectricianBookingPage = () => {
    const { elecId } = useParams<{elecId: string}>();
    const location = useLocation();
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    
    const [desc, setDesc] = useState('');
    const [selectedTime, setSelectedTime] = useState('尽快上门');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 0, lng: 0, address: '选择服务地址' });
    const [serviceType, setServiceType] = useState('Repair');

    // Fallback if state is missing
    const elec = location.state?.electrician || {
        id: elecId,
        name: '指定电工',
        // Updated fallback avatar to Unsplash
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150',
        rating: '5.0',
        priceStr: '¥40起',
        tags: ['专业电工']
    };

    const minPrice = parseInt(elec.priceStr?.replace(/\D/g, '') || '40');

    const handleBooking = () => {
         createOrder({
            type: serviceType as any,
            title: `预约服务 - ${elec.name}`,
            description: desc,
            location: selectedLocation,
            scheduledTime: selectedTime,
            electricianId: elec.id,
            electricianName: elec.name,
            status: OrderStatus.PENDING,
            priceEstimate: { min: minPrice, max: minPrice + 100 }
         });
         navigate('/user/orders');
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
             <div className="bg-white p-4 sticky top-0 z-10 flex items-center space-x-3 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">预约师傅</h1>
            </div>

            <div className="p-4 space-y-4 pb-32">
                {/* Master Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="relative">
                         <img src={elec.avatar} className="w-16 h-16 rounded-full bg-gray-100 object-cover" alt="avatar"/>
                         <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">{elec.name}</h2>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                            <span className="text-orange-500 font-bold flex items-center"><Star size={10} className="fill-current mr-0.5"/> {elec.rating}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">已认证</span>
                        </div>
                    </div>
                </div>

                {/* Service Type */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">服务类型</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['Repair', 'Install', 'Checkup'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setServiceType(type)}
                                className={`py-2 rounded-xl text-sm font-bold border transition-all ${serviceType === type ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-transparent text-gray-600'}`}
                            >
                                {type === 'Repair' ? '电路急修' : (type === 'Install' ? '上门安装' : '线路检测')}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Details Form */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                      <div onClick={() => setShowAddressPicker(true)} className="flex justify-between items-center py-2 border-b border-gray-50 cursor-pointer active:opacity-70">
                          <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500"><MapPin size={18}/></div>
                              <span className="font-bold text-gray-700 text-sm truncate max-w-[180px]">{selectedLocation.address}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-300"/>
                      </div>

                      <div onClick={() => setShowTimePicker(true)} className="flex justify-between items-center py-2 border-b border-gray-50 cursor-pointer active:opacity-70">
                          <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500"><Clock size={18}/></div>
                              <span className="font-bold text-gray-700 text-sm">{selectedTime}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-300"/>
                      </div>

                      <div>
                          <p className="font-bold text-gray-700 text-sm mb-2">需求描述</p>
                          <textarea 
                              value={desc}
                              onChange={e => setDesc(e.target.value)}
                              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none min-h-[100px]"
                              placeholder="请简要描述您的故障情况或服务需求..."
                          />
                      </div>
                 </div>
            </div>

            {/* Bottom Bar - Full Width */}
             <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                 <div className="max-w-screen-md mx-auto flex items-center justify-between">
                     <div>
                         <p className="text-xs text-gray-400">上门起步价</p>
                         <div className="flex items-baseline text-red-600">
                             <span className="text-xs font-bold">¥</span>
                             <span className="text-2xl font-extrabold mx-1">{minPrice}</span>
                             <span className="text-xs text-gray-500 font-normal">起</span>
                         </div>
                     </div>
                     <button 
                        onClick={handleBooking}
                        className="px-8 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-green-600 hover:bg-green-700"
                     >
                         立即预约
                     </button>
                 </div>
             </div>

            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => {setSelectedTime(t); setShowTimePicker(false);}} />}
            {showAddressPicker && <AddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => {setSelectedLocation(loc); setShowAddressPicker(false);}} />}
        </div>
    );
}
