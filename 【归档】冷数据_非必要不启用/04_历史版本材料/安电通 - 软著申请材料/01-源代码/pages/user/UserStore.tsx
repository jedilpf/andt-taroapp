
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    Search, ShoppingCart, ChevronRight, Coins, Filter,
    RotateCcw, ShoppingBasket, Plus, MapPin,
    Sparkles, ShoppingBag, Zap, Flame, Utensils, Smartphone,
    Home, Wrench, Package, X, Minus, Trash2, CheckCircle2, ShieldCheck, Truck, CreditCard, Loader2, ChevronLeft, Calendar, CheckCircle, Check, Wallet,
    CircleDollarSign, Ticket, Crown, LayoutGrid, Pill, Plane, Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

// --- 全局回退图片 ---
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=600&q=80";

// --- 商品详情弹出层 ---
const ProductDetailModal = ({
    product,
    onClose,
    onAddToCart,
    onBuyNow
}: {
    product: any,
    onClose: () => void,
    onAddToCart: (p: any, q: number) => void,
    onBuyNow: (p: any, q: number) => void
}) => {
    const [quantity, setQuantity] = useState(1);

    return createPortal(
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] relative z-10 animate-slide-up flex flex-col max-h-[90vh]">
                <div className="absolute top-4 right-4 z-20">
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="aspect-square bg-slate-50 relative">
                        <img
                            src={product.image}
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>

                    <div className="p-6">
                        <div className="flex items-baseline space-x-2 mb-2">
                            <span className="text-red-600 font-black text-3xl tracking-tighter">¥{product.price}</span>
                            <span className="text-sm text-slate-400 line-through font-bold">¥{product.originalPrice}</span>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-3 flex items-center mb-4 border border-amber-100/50">
                            <Coins size={16} className="text-amber-500 mr-2" />
                            <span className="text-xs font-black text-amber-700">会员尊享：本商品最高可使用积分抵扣 ¥{product.maxDeduct}</span>
                        </div>

                        <h2 className="text-xl font-black text-slate-900 leading-tight mb-4">{product.title}</h2>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {['社区自营', '极速配送', '7天无理由'].map(t => (
                                <span key={t} className="flex items-center text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                    <CheckCircle2 size={10} className="mr-1 text-emerald-500" /> {t}
                                </span>
                            ))}
                        </div>

                        <div className="h-px bg-slate-100 mb-6"></div>

                        <div className="flex justify-between items-center">
                            <span className="font-black text-slate-800">购买数量</span>
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-slate-400 active:text-slate-900"><Minus size={16} /></button>
                                <span className="w-10 text-center font-black text-slate-800">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-900 active:scale-125 transition-transform"><Plus size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pb-safe border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex space-x-3">
                    <button
                        onClick={() => { onAddToCart(product, quantity); onClose(); }}
                        className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-base active:scale-95 transition-transform"
                    >
                        加入购物车
                    </button>
                    <button
                        onClick={() => { onBuyNow(product, quantity); onClose(); }}
                        className="flex-[1.2] py-4 bg-slate-900 text-white rounded-2xl font-black text-base shadow-xl shadow-slate-200 active:scale-95 transition-transform"
                    >
                        立即购买
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 支付详情确认弹窗 ---
const PaymentDetailModal = ({
    total,
    items,
    onClose,
    onConfirm
}: {
    total: number,
    items: any[],
    onClose: () => void,
    onConfirm: (method: string) => void
}) => {
    const { currentUser } = useApp();
    const [method, setMethod] = useState('wechat');

    return createPortal(
        <div className="fixed inset-0 z-[3000] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-md bg-[#F8FAFC] rounded-t-[3rem] p-8 animate-slide-up pointer-events-auto relative z-10 pb-safe shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">支付详情</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="text-center py-6 mb-6">
                    <p className="text-sm text-slate-400 font-bold mb-1">支付剩余时间 14:59</p>
                    <div className="flex items-baseline justify-center text-slate-900">
                        <span className="text-2xl font-black mr-1">¥</span>
                        <span className="text-5xl font-black tracking-tighter">{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 mb-8 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400 font-bold">订单内容</span>
                        <span className="text-sm text-slate-800 font-black truncate max-w-[200px] text-right">
                            {items.length > 1 ? `${items[0].title} 等${items.length} 件` : items[0]?.title}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400 font-bold">收货地址</span>
                        <span className="text-sm text-slate-800 font-black truncate max-w-[200px] text-right">{currentUser?.location?.address}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">选择支付方式</p>

                    <button
                        onClick={() => setMethod('wechat')}
                        className={`w - full p - 4 rounded - 2xl flex items - center justify - between border - 2 transition - all ${method === 'wechat' ? 'border-emerald-500 bg-emerald-50/30' : 'border-white bg-white'} `}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#07C160] rounded-xl flex items-center justify-center text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 13.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm7 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm.707-10.457c-4.832 0-8.75 3.518-8.75 7.857 0 2.348 1.152 4.453 2.969 5.86l-.766 2.296 2.664-1.332c.609.18 1.258.281 1.883.281 4.832 0 8.75-3.518 8.75-7.857 0-4.339-3.918-7.857-8.75-7.857zm-11.233 4.286c-4.142 0-7.5 3.015-7.5 6.735 0 2.012.986 3.816 2.544 5.023l-.656 1.968 2.284-1.142c.523.155 1.078.241 1.614.241 4.142 0 7.5-3.015 7.5-6.735 0-3.72-3.358-6.735-7.5-6.735z" /></svg>
                            </div>
                            <span className="font-black text-slate-800">微信支付</span>
                        </div>
                        {method === 'wechat' && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm"><CheckCircle2 size={16} /></div>}
                    </button>

                    <button
                        onClick={() => setMethod('alipay')}
                        className={`w - full p - 4 rounded - 2xl flex items - center justify - between border - 2 transition - all ${method === 'alipay' ? 'border-blue-500 bg-blue-50/30' : 'border-white bg-white'} `}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#1677FF] rounded-xl flex items-center justify-center text-white">
                                <CreditCard size={20} />
                            </div>
                            <span className="font-black text-slate-800">支付宝支付</span>
                        </div>
                        {method === 'alipay' && <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm"><CheckCircle2 size={16} /></div>}
                    </button>
                </div>

                <button
                    onClick={() => onConfirm(method)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl active:scale-[0.98] transition-transform"
                >
                    确认支付
                </button>
            </div>
        </div>,
        document.body
    );
};

// --- 购物车结算侧滑层 ---
const CartDrawer = ({ items, onClose, onUpdate, onCheckout }: { items: any[], onClose: () => void, onUpdate: (id: number, delta: number) => void, onCheckout: () => void }) => {
    const { currentUser } = useApp();
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return createPortal(
        <div className="fixed inset-0 z-[2001] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="w-[85%] max-w-sm bg-[#F8FAFC] h-full relative z-10 animate-slide-left shadow-2xl flex flex-col">
                <div className="p-6 pt-safe bg-white flex justify-between items-center border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-800">购物车 ({items.length})</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                            <ShoppingBasket size={80} />
                            <p className="mt-4 font-black">购物车空空如也</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="bg-white rounded-[1.8rem] p-4 flex space-x-3 shadow-sm border border-slate-50">
                                <img
                                    src={item.image}
                                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                                    alt=""
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-black text-slate-800 truncate mb-1">{item.title}</h4>
                                    <p className="text-red-600 font-black text-sm">¥{item.price}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                                            <button onClick={() => onUpdate(item.id, -1)} className="p-1 text-slate-400"><Minus size={12} /></button>
                                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                            <button onClick={() => onUpdate(item.id, 1)} className="p-1 text-slate-900"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => onUpdate(item.id, -item.quantity)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100 pb-safe">
                    <div className="flex items-center space-x-2 mb-4 bg-blue-50 p-3 rounded-2xl border border-blue-100/50">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-800 truncate">配送至：{currentUser?.location?.address || '天钥桥社区服务站'}</span>
                    </div>

                    <div className="flex justify-between items-end mb-6 px-1">
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">合计金额</p>
                            <div className="flex items-baseline text-red-600">
                                <span className="text-sm font-black mr-0.5">¥</span>
                                <span className="text-3xl font-black tracking-tighter">{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={items.length === 0}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center disabled:bg-slate-200"
                    >
                        <CreditCard size={20} className="mr-2" />
                        结算当前商品
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 商品数据 ---
// 在这里修改商品图片路径
const ALL_PRODUCTS = [
    { id: 101, title: "智利进口车厘子 JJ级 250g", price: 39.9, originalPrice: 68, points: 400, maxDeduct: 3.9, image: "/assets/products/item1.png", label: "产地直发", category: "生鲜水果", sales: 2300 },
    { id: 102, title: "澳洲谷饲原切眼肉牛排 200g", price: 58.0, originalPrice: 88, points: 580, maxDeduct: 5.8, image: "/assets/products/item2.png", label: "社区严选", category: "生鲜水果", sales: 430 },
    { id: 201, title: "小米 (MI) 磁吸无线充电宝 10k", price: 129.0, originalPrice: 159, points: 1290, maxDeduct: 12.9, image: "/assets/products/item3.png", label: "数码补贴", category: "电子数码", sales: 620 },
    { id: 202, title: "华为 FreeBuds Pro 3 耳机", price: 1099.0, originalPrice: 1199, points: 10990, maxDeduct: 109.9, image: "/assets/products/item4.png", label: "旗舰新品", category: "电子数码", sales: 150 },
    { id: 301, title: "立白 大师香氛洗衣凝珠 50颗", price: 49.9, originalPrice: 79, points: 499, maxDeduct: 4.9, image: "/assets/products/item5.png", label: "超值", category: "日用百货", sales: 3200 },
    { id: 401, title: "苏泊尔 (SUPOR) 空气炸锅 5L", price: 299.0, originalPrice: 499, points: 2990, maxDeduct: 29.9, image: "/assets/products/item6.png", label: "以旧换新", category: "家居家电", sales: 890 },
    { id: 1, title: "施耐德 1P+N 32A 断路器", price: 42.5, originalPrice: 58, points: 425, maxDeduct: 4.2, image: "/assets/products/item7.png", label: "官方补贴", category: "五金建材", sales: 1200 },
];

export const UserStore = () => {
    const navigate = useNavigate();
    const { currentUser, createOrder, earnPoints } = useApp();
    const [activeTab, setActiveTab] = useState('推荐');
    const [scrolled, setScrolled] = useState(false);

    // 交互状态
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    // 支付确认详情状态
    const [showPaymentDetail, setShowPaymentDetail] = useState(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<{ total: number, items: any[] }>({ total: 0, items: [] });

    // 支付处理中状态机
    const [payState, setPayState] = useState<'none' | 'processing' | 'success'>('none');

    // Banner 轮播数据
    const [currentBanner, setCurrentBanner] = useState(0);
    const banners = [
        {
            title: "全屋开关换新",
            subtitle: "政府补贴 7.5折",
            tag: "Official",
            desc: "生活商城焕新特惠",
            btn: "立即抢购",
            color: "bg-[#0F172A]",
            accent: "text-[#00DFA2]",
            icon: Package,
            path: "/user/store/activity/renewal"
        },
        {
            title: "冬季取暖节",
            subtitle: "电热毯 ¥49 起",
            tag: "Special",
            desc: "社区集采 温暖到家",
            btn: "领券购买",
            color: "bg-[#451A03]",
            accent: "text-[#FB923C]",
            icon: Flame,
            path: "/user/store/activity/warmth"
        },
        {
            title: "生鲜直供中心",
            subtitle: "车厘子 ¥39.9",
            tag: "Fresh",
            desc: "产地直送 极速配送",
            btn: "去下单",
            color: "bg-[#064E3B]",
            accent: "text-[#FDE047]",
            icon: ShoppingBasket,
            path: "/user/store/activity/fresh"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const switchBanner = (index: number) => {
        setCurrentBanner(index);
    };

    const nextBanner = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentBanner(prev => (prev + 1) % banners.length);
    };

    const prevBanner = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
    };

    // --- 逻辑处理 ---
    const addToCart = (product: any, qty: number = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
            }
            return [...prev, { ...product, quantity: qty }];
        });
    };

    const handleBuyNow = (product: any, qty: number) => {
        setCurrentPaymentData({
            total: product.price * qty,
            items: [{ ...product, quantity: qty }]
        });
        setShowPaymentDetail(true);
    };

    const handleCheckout = () => {
        const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
        setCurrentPaymentData({
            total,
            items: [...cartItems]
        });
        setIsCartOpen(false);
        setShowPaymentDetail(true);
    };

    const executePayment = (method: string) => {
        setShowPaymentDetail(false);
        setPayState('processing');

        const { total, items } = currentPaymentData;

        setTimeout(() => {
            if (currentUser) {
                createOrder({
                    type: 'Install',
                    title: items.length > 1 ? '生活商城合并订单' : `生活商城订单 - ${items[0].title} `,
                    description: `支付方式: ${method === 'wechat' ? '微信' : method === 'alipay' ? '支付宝' : '其他'} \n购买商品: ${items.map(i => i.title).join('、')} `,
                    priceEstimate: { min: total, max: total, final: total },
                    location: currentUser.location,
                    status: OrderStatus.PAID,
                    items: items.map(i => ({ name: i.title, qty: i.quantity, price: i.price })),
                    pointsReward: Math.floor(total),
                    scheduledTime: '预计1小时内送达'
                });
                earnPoints(Math.floor(total));
            }

            setPayState('success');
            setCartItems([]);

            setTimeout(() => {
                setPayState('none');
                navigate('/user/orders', { state: { initialTab: '待收货/使用' } });
            }, 1500);
        }, 2000);
    };

    const updateCartQuantity = (id: number, delta: number) => {
        setCartItems(prev => {
            return prev.map(i => {
                if (i.id === id) {
                    const newQty = i.quantity + delta;
                    return newQty > 0 ? { ...i, quantity: newQty } : null;
                }
                return i;
            }).filter(Boolean);
        });
    };

    const categories = [
        { id: '推荐', icon: Flame, color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-200' },
        { id: '生鲜水果', icon: Utensils, color: 'from-emerald-400 to-green-600', shadow: 'shadow-emerald-200' },
        { id: '电子数码', icon: Smartphone, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200' },
        { id: '日用百货', icon: ShoppingBag, color: 'from-rose-400 to-pink-600', shadow: 'shadow-rose-200' },
        { id: '家居家电', icon: Home, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' },
        { id: '五金建材', icon: Wrench, color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-300' },
    ];

    const quickLinks = [
        { label: '领积分', icon: Coins, color: 'bg-amber-100 text-amber-600', path: '/user/points-mall' },
        { label: '以旧换新', icon: RotateCcw, color: 'bg-blue-100 text-blue-600', path: '/user/store/trade-in' },
        { label: '便民驿站', icon: MapPin, color: 'bg-emerald-100 text-emerald-600', path: '/user/convenience-station' },
        { label: '金牌安装', icon: Wrench, color: 'bg-rose-100 text-rose-600', path: '/user/store/gold-install' },
        { label: '社区团购', icon: ShoppingBasket, color: 'bg-orange-100 text-orange-600', path: '/user/store/group-buy' },
    ];

    const filteredProducts = useMemo(() => {
        if (activeTab === '推荐') return ALL_PRODUCTS;
        return ALL_PRODUCTS.filter(p => p.category === activeTab);
    }, [activeTab]);

    return (
        <div className="h-full bg-[#F6F6F6] flex flex-col relative overflow-hidden font-sans">
            {/* --- JD Style Header --- */}
            <div className={`sticky top - 0 z - [100] transition - all duration - 300 ${scrolled ? 'bg-white shadow-sm' : 'bg-[#F6F6F6]'} pt - safe`}>
                <div className="px-3 pt-2 pb-2 flex items-center space-x-3">
                    <div className="flex-1 relative">
                        {/* Search Bar - JD Red Icon style */}
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-[#F23030]" strokeWidth={2.5} />
                            <div className="w-px h-3 bg-gray-300 mx-2"></div>
                            <span className="text-xs text-gray-400">大闸蟹</span>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-white rounded-full py-2 pl-20 pr-10 text-sm text-gray-800 outline-none border border-red-500/30 focus:border-red-500 shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-1 flex items-center">
                            <button className="bg-[#F23030] text-white rounded-full px-3 py-1 text-xs font-bold">搜索</button>
                        </div>
                    </div>
                    <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800">
                        <ShoppingCart size={24} strokeWidth={1.5} />
                        {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F23030] text-white text-[9px] rounded-full flex items-center justify-center border border-white">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>}
                    </button>
                </div>
            </div>

            {/* Scroll Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar" onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 10)}>

                {/* --- JD King Kong Area (10 Icons, 2 Rows) --- */}
                <div className="bg-[#F6F6F6] px-3 pt-2 pb-2">
                    <div className="grid grid-cols-5 gap-y-3">
                        {/* Row 1 */}
                        {[
                            { l: '安电超市', i: ShoppingBasket, c: 'text-[#F23030]', id: 'supermarket' },
                            { l: '数码电器', i: Smartphone, c: 'text-blue-500', id: 'digital' },
                            { l: '社区生鲜', i: Utensils, c: 'text-green-500', id: 'fresh' },
                            { l: '社区药房', i: Pill, c: 'text-cyan-500', id: 'medicine' },
                            { l: '充值中心', i: Zap, c: 'text-yellow-500', id: 'recharge' },
                            /* Row 2 */
                            { l: '领优惠券', i: Ticket, c: 'text-orange-400', id: 'coupon' },
                            { l: '尊享会员', i: Crown, c: 'text-[#ECDBA9] bg-black rounded-lg p-0.5', id: 'vip' },
                            { l: '品牌特卖', i: ShoppingBag, c: 'text-pink-500', id: 'brand' },
                            { l: '全部', i: LayoutGrid, c: 'text-gray-600', id: 'all' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center space-y-1 active:scale-90 transition-transform cursor-pointer"
                                onClick={() => navigate(`/user/store/activity/${item.id}`)}
                            >
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <item.i size={28} className={item.c} strokeWidth={1.5} />
                                </div>
                                <span className="text-[10px] text-gray-600 font-medium">{item.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-3 pb-3 space-y-2">
                    {/* Top Row: Subsidy vs Quality */}
                    <div className="flex space-x-2 h-44">
                        {/* Left: National Subsidy */}
                        <div
                            className="flex-1 bg-white rounded-xl p-3 flex flex-col relative overflow-hidden active:scale-95 transition-transform"
                            onClick={() => navigate('/user/store/activity/subsidy')}
                        >
                            <h4 className="font-black text-base text-gray-900 flex items-center">
                                国家补贴 <span className="ml-1 text-[10px] bg-black text-[#ECDBA9] px-1 rounded-sm">百亿补贴</span>
                            </h4>
                            <div className="flex-1 flex items-end justify-between mt-2 z-10">
                                <div className="text-center">
                                    <img src="/assets/products/item3.png" className="w-14 h-14 object-contain mx-auto mb-1" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                                    <div className="text-[#F23030] font-bold text-xs">¥296.7</div>
                                    <div className="text-[9px] text-[#F23030] bg-red-50">补贴价</div>
                                </div>
                                <div className="text-center">
                                    <img src="/assets/products/item6.png" className="w-16 h-10 object-contain mx-auto mb-5" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                                    <div className="text-[#F23030] font-bold text-xs">¥9.9</div>
                                    <div className="text-[9px] text-[#F23030] bg-red-50">补贴价</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quality Life */}
                        <div className="flex-1 bg-white rounded-xl p-3 bg-gradient-to-b from-blue-50/50 to-white">
                            <h4 className="font-black text-base text-gray-900 mb-2">品质生活</h4>
                            <div className="grid grid-cols-2 gap-2">

                                <div className="text-center active:scale-90 transition-transform" onClick={() => navigate('/user/store/activity/medicine')}>
                                    <div className="w-8 h-8 rounded-full bg-green-100 mx-auto mb-1 flex items-center justify-center"><Pill size={14} className="text-green-500" /></div>
                                    <span className="text-[10px] text-gray-500">买药秒送</span>
                                </div>
                                <div className="text-center active:scale-90 transition-transform" onClick={() => navigate('/user/store/activity/takeout')}>
                                    <div className="w-8 h-8 rounded-full bg-orange-100 mx-auto mb-1 flex items-center justify-center"><Utensils size={14} className="text-orange-500" /></div>
                                    <span className="text-[10px] text-gray-500">外卖</span>
                                </div>
                                <div className="text-center active:scale-90 transition-transform" onClick={() => navigate('/user/store/activity/travel')}>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto mb-1 flex items-center justify-center"><Plane size={14} className="text-blue-500" /></div>
                                    <span className="text-[10px] text-gray-500">社区出行</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: 9.9, Live, etc */}
                    <div className="flex space-x-2 h-32">

                        {/* Live Low Price */}
                        <div className="flex-1 bg-white rounded-xl p-2 flex flex-col">
                            <h4 className="font-bold text-sm text-gray-900 mb-1 flex items-center"><Video size={12} className="mr-1 text-red-500" />直播低价</h4>
                            <span className="text-[10px] text-gray-400 mb-1 invisible">Space</span>
                            <div className="flex-1 flex items-center justify-center">
                                <img src="/assets/products/item3.png" className="w-12 h-12 object-contain" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                            </div>
                            <div className="text-center text-[#F23030] font-bold text-xs mt-1">¥7.38</div>
                        </div>
                        {/* Hot Pot */}
                        <div className="flex-1 bg-white rounded-xl p-2 flex flex-col relative overflow-hidden">
                            <h4 className="font-bold text-sm text-gray-900 z-10">爆品好价</h4>
                            <div className="text-[10px] text-white bg-[#F23030] w-fit px-1 rounded-sm z-10 mb-1">6折吃火锅</div>
                            <div className="absolute right-0 bottom-0 w-16 h-16 opacity-80">
                                <img src="/assets/products/item5.png" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                            </div>
                            <div className="mt-auto z-10 text-[#F23030] font-bold text-xs">真便宜</div>
                        </div>
                    </div>
                </div>

                {/* --- Sticky Categories --- */}
                <div className={`sticky top-[3.2rem] z-40 bg-[#F6F6F6] pb-2 px-3 pt-2`}>
                    <div className="flex items-end space-x-5 overflow-x-auto no-scrollbar pr-4">
                        {['推荐', '黑色星期五', '礼遇季', '学生专区', '国补直降', '3毛抢鸡蛋', '大牌抽免单'].map((cat, i) => (
                            <div key={i} className={`flex-col flex items-center flex-shrink-0 ${i === 0 ? 'font-black text-gray-900' : 'font-normal text-gray-500'}`}>
                                <span className={`text-sm whitespace-nowrap ${i === 0 ? 'text-base' : ''}`}>{cat}</span>
                                {i === 0 && <div className="w-5 h-1 bg-[#F23030] rounded-full mt-1"></div>}
                                {i !== 0 && <div className="text-[9px] text-gray-400 mt-0.5 whitespace-nowrap border-l border-transparent px-1">{i % 2 === 0 ? '热卖' : '精选'}</div>}
                            </div>
                        ))}
                    </div>
                </div>


                {/* --- Waterfalls Flow Product List --- */}
                <div className="px-3 pb-32">
                    <div className="columns-2 gap-2 space-y-2">
                        {filteredProducts.map((p) => (
                            <div key={p.id} onClick={() => setSelectedProduct(p)} className="break-inside-avoid bg-white rounded-lg overflow-hidden pb-2 mb-2">
                                <div className="w-full aspect-[4/4] bg-gray-100 relative">
                                    <img
                                        src={p.image}
                                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                                        className="w-full h-full object-cover"
                                        alt={p.title}
                                    />
                                </div>
                                <div className="p-2">
                                    <h4 className="text-[13px] text-gray-900 leading-snug line-clamp-2 mb-2 h-9">{p.title}</h4>
                                    <div className="flex items-center space-x-1 mb-1">
                                        <div className="text-[9px] text-[#F23030] border border-[#F23030] px-1 rounded-[2px]">百亿补贴</div>
                                        <div className="text-[9px] text-gray-400 border border-gray-200 px-1 rounded-[2px]">包邮</div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-[#F23030] font-bold text-base">
                                            <span className="text-xs">¥</span>{p.price}
                                        </div>
                                        <div className="text-[10px] text-gray-400">已售{p.sales > 1000 ? (p.sales / 1000).toFixed(1) + 'k' : p.sales}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Extra Mock Cards to fill space */}
                        <div className="break-inside-avoid bg-white rounded-lg overflow-hidden pb-2 mb-2">
                            <div className="w-full h-32 bg-blue-50 flex items-center justify-center text-blue-200 font-black text-2xl">AD</div>
                            <div className="p-2">
                                <h4 className="text-xs text-gray-900">埃安 UT Super 限时补贴4.79万起</h4>
                                <div className="mt-2 text-[#F23030] font-bold">¥58900</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 弹出交互层 (保持原有逻辑) */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                />
            )}

            {isCartOpen && <CartDrawer items={cartItems} onClose={() => setIsCartOpen(false)} onUpdate={updateCartQuantity} onCheckout={handleCheckout} />}

            {showPaymentDetail && (
                <PaymentDetailModal
                    total={currentPaymentData.total}
                    items={currentPaymentData.items}
                    onClose={() => setShowPaymentDetail(false)}
                    onConfirm={executePayment}
                />
            )}

            {/* 全局支付状态 - 简化版 */}
            {payState !== 'none' && createPortal(
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60">
                    <div className="bg-white p-6 rounded-xl flex flex-col items-center animate-scale-in w-40">
                        {payState === 'processing' ? <Loader2 size={32} className="animate-spin text-[#F23030] mb-2" /> : <CheckCircle size={32} className="text-green-500 mb-2" />}
                        <span className="text-sm font-bold">{payState === 'processing' ? '支付中...' : '支付成功'}</span>
                    </div>
                </div>,
                document.body
            )}

            <style>{`.pt - safe { padding - top: env(safe - area - inset - top); } `}</style>
        </div>
    );
};

export default UserStore;
