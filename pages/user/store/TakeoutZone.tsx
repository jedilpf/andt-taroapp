import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Search, Star, MapPin,
    Plus, Minus, ShoppingBag, CheckCircle,
    Filter, ChevronDown, Coffee, Pizza,
    Sandwich, Soup, UtensilsCrossed,
    IceCream, Sparkles, Flame
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

// Mock Data
const BANNERS = [
    { id: 1, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', title: '限时五折', sub: '大牌美食' },
    { id: 2, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', title: '0元配送', sub: '新客专享' },
    { id: 3, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', title: '下午茶', sub: '甜蜜一夏' },
];

const CATEGORIES = [
    { name: '全部', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600' },
    { name: '快餐便当', icon: Sandwich, color: 'bg-blue-100 text-blue-600' },
    { name: '汉堡披萨', icon: Pizza, color: 'bg-yellow-100 text-yellow-600' },
    { name: '地方菜系', icon: Flame, color: 'bg-red-100 text-red-600' },
    { name: '甜点饮品', icon: Coffee, color: 'bg-pink-100 text-pink-600' },
    { name: '夏日冰品', icon: IceCream, color: 'bg-purple-100 text-purple-600' },
    { name: '养生汤粥', icon: Soup, color: 'bg-green-100 text-green-600' },
    { name: '品质优选', icon: Sparkles, color: 'bg-slate-100 text-slate-600' },
];

const RESTAURANTS = [
    {
        id: 'r1',
        name: '老张家手工水饺 (天钥桥店)',
        rating: 4.8,
        sales: 2311,
        time: '30分钟',
        distance: '0.8km',
        minPrice: 20,
        delivery: 0,
        tags: ['现包现煮', '放心吃'],
        promos: ['满25减3', '新客立减1'],
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=300&q=80',
        menu: [
            { id: 'm1', name: '玉米鲜肉水饺 (12个)', price: 18, image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=200&q=80', sales: 100 },
            { id: 'm2', name: '酸辣汤', price: 8, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80', sales: 50 },
            { id: 'm3', name: '凉拌土豆丝', price: 12, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=200&q=80', sales: 80 }
        ]
    },
    {
        id: 'r2',
        name: '麦肯基炸鸡汉堡 (社区店)',
        rating: 4.6,
        sales: 4500,
        time: '25分钟',
        distance: '1.2km',
        minPrice: 30,
        delivery: 3,
        tags: ['美式风味', '可乐必点'],
        promos: ['满60减8', '特价套餐'],
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=300&q=80',
        menu: [
            { id: 'm4', name: '香辣鸡腿堡', price: 19.9, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=200&q=80', sales: 300 },
            { id: 'm5', name: '大薯条', price: 12, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=200&q=80', sales: 150 },
            { id: 'm6', name: '冰可乐', price: 8, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80', sales: 500 }
        ]
    },
    {
        id: 'r3',
        name: '湘味小厨·农家小炒肉',
        rating: 4.5,
        sales: 1200,
        time: '45分钟',
        distance: '2.5km',
        minPrice: 40,
        delivery: 5,
        tags: ['下饭神器', '地道辣味'],
        promos: ['首单红包'],
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=300&q=80',
        menu: [
            { id: 'm7', name: '农家小炒肉', price: 28, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=200&q=80', sales: 200 },
            { id: 'm8', name: '麻婆豆腐', price: 18, image: 'https://images.unsplash.com/photo-1606502973842-f64bc2f6d00a?auto=format&fit=crop&w=200&q=80', sales: 120 },
            { id: 'm9', name: '五常大米饭', price: 2, image: 'https://images.unsplash.com/photo-1586521995568-39d1949411f9?auto=format&fit=crop&w=200&q=80', sales: 1000 }
        ]
    },
    {
        id: 'r4',
        name: 'CoCo都可 (徐家汇店)',
        rating: 4.9,
        sales: 8800,
        time: '35分钟',
        distance: '1.5km',
        minPrice: 15,
        delivery: 2,
        tags: ['奶茶果汁', '人气必喝'],
        promos: ['第二杯半价', '会员9折'],
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=300&q=80',
        menu: [
            { id: 'm10', name: '珍珠奶茶', price: 12, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=200&q=80', sales: 2000 },
            { id: 'm11', name: '百香果双响炮', price: 16, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=80', sales: 1500 }
        ]
    },
    {
        id: 'r5',
        name: '正新鸡排 (社区快取点)',
        rating: 4.4,
        sales: 3200,
        time: '20分钟',
        distance: '0.5km',
        minPrice: 15,
        delivery: 0,
        tags: ['炸鸡烧烤', '夜宵'],
        promos: ['满20减5'],
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80',
        menu: [
            { id: 'm12', name: '香辣鸡排', price: 13, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80', sales: 1000 },
            { id: 'm13', name: '烤肠', price: 5, image: 'https://images.unsplash.com/photo-1594221708779-9e801c0c27b9?auto=format&fit=crop&w=200&q=80', sales: 500 }
        ]
    }
];

const TakeoutZone = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [activeCategory, setActiveCategory] = useState('全部');
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [showCart, setShowCart] = useState(false);
    const [orderStep, setOrderStep] = useState<'browsing' | 'ordering' | 'success'>('browsing');
    const [processing, setProcessing] = useState(false);

    // Cart Logic
    const addToCart = (itemId: string) => {
        setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            const newCount = (prev[itemId] || 0) - 1;
            if (newCount <= 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newCount };
        });
    };

    const getCartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
    const getCartTotal = () => {
        if (!selectedRestaurant) return 0;
        return selectedRestaurant.menu.reduce((total: number, item: any) => {
            return total + (item.price * (cart[item.id] || 0));
        }, 0);
    };

    const handleCheckout = () => {
        if (!selectedRestaurant) return;
        setProcessing(true);
        setTimeout(() => {
            const total = getCartTotal();
            const items = selectedRestaurant.menu
                .filter((item: any) => cart[item.id])
                .map((item: any) => ({
                    name: item.name,
                    qty: cart[item.id],
                    price: item.price
                }));

            createOrder({
                type: 'Takeout',
                title: `${selectedRestaurant.name} 的外卖订单`,
                description: `包含 ${items.map((i: any) => i.name).join(', ')}`,
                priceEstimate: { min: total, max: total, final: total },
                location: currentUser?.location,
                status: OrderStatus.COMPLETED,
                scheduledTime: '预计30分钟内送达'
            });

            setProcessing(false);
            setOrderStep('success');
            setCart({});
        }, 2000);
    };

    // Component: Success View
    if (orderStep === 'success') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in bg-white h-screen fixed inset-0 z-50">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <CheckCircle size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">接单成功</h2>
                <p className="text-sm text-slate-400 font-bold mb-10">商家已接单，骑手正在赶往店铺。</p>
                <div className="space-y-3 w-full max-w-xs">
                    <button onClick={() => navigate('/user/orders')} className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-bold active:scale-95 transition-transform">
                        查看订单
                    </button>
                    <button onClick={() => { setOrderStep('browsing'); setSelectedRestaurant(null); }} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-transform">
                        返回首页
                    </button>
                </div>
            </div>
        );
    }

    // Component: Restaurant Menu View
    if (selectedRestaurant) {
        return (
            <div className="h-full bg-slate-50 relative flex flex-col">
                {/* Header Image */}
                <div className="h-40 relative shrink-0">
                    <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <button onClick={() => setSelectedRestaurant(null)} className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur rounded-full text-white">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                        <div className="flex justify-between items-start">
                            <h1 className="text-xl font-black mb-1 flex-1 mr-4">{selectedRestaurant.name}</h1>
                            <div className="w-12 h-12 bg-white rounded-lg p-1">
                                <img src={selectedRestaurant.image} className="w-full h-full object-cover rounded" />
                            </div>
                        </div>
                        <div className="flex items-center text-[10px] opacity-90 space-x-2 mt-1">
                            <span>配送约{selectedRestaurant.time}</span>
                            <span>|</span>
                            <span>{selectedRestaurant.sales}月售</span>
                            <span>|</span>
                            <span>公告：欢迎光临，用餐愉快！</span>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className="flex-1 overflow-y-auto pb-32 flex">
                    {/* Sidebar Categories (Mock) */}
                    <div className="w-20 bg-slate-100 h-full overflow-y-auto no-scrollbar pb-20 sticky top-0">
                        {['热销', '折扣', '主食', '小吃', '饮料'].map((c, i) => (
                            <div key={c} className={`py-4 text-center text-xs font-bold ${i === 0 ? 'bg-white text-slate-900 border-l-4 border-orange-500' : 'text-slate-500'}`}>
                                {c}
                            </div>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 p-3 space-y-3 bg-white">
                        <h3 className="font-bold text-slate-800 text-xs mb-2">热销榜</h3>
                        {selectedRestaurant.menu.map((item: any) => (
                            <div key={item.id} className="flex space-x-2">
                                <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5">月售 {item.sales}+</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-red-500 font-black text-base">¥{item.price}</span>
                                        {cart[item.id] ? (
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-500"><Minus size={12} /></button>
                                                <span className="text-sm font-bold">{cart[item.id]}</span>
                                                <button onClick={() => addToCart(item.id)} className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center"><Plus size={12} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => addToCart(item.id)} className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                                                <Plus size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="h-10"></div>
                    </div>
                </div>

                {/* Bottom Cart Bar */}
                {getCartCount() > 0 && (
                    <div className="fixed bottom-0 left-0 w-full z-[60] p-4 pb-safe animate-slide-up">
                        <div className="bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center justify-between p-2 pr-6 relative overflow-visible">
                            <div className="flex items-center" onClick={() => setShowCart(!showCart)}>
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center relative shadow-lg border-4 border-slate-900 transform -translate-y-4 ml-2">
                                    <ShoppingBag size={20} className={getCartCount() > 0 ? "text-orange-500" : "text-slate-500"} />
                                    {getCartCount() > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">{getCartCount()}</span>}
                                </div>
                                <div className="ml-2">
                                    <p className="text-lg font-black">¥{getCartTotal().toFixed(1)}</p>
                                    <p className="text-[10px] text-slate-400">预估配送费 ¥{selectedRestaurant.delivery}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={processing}
                                className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                            >
                                {processing ? '...' : '去结算'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default: Restaurant List View
    return (
        <div className="min-h-screen bg-[#F5F5F5] pb-safe">
            {/* Header Area */}
            <div className="sticky top-0 bg-white z-30 pt-safe pb-2">
                <div className="px-4 flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1" onClick={() => navigate(-1)}>
                        <ChevronLeft className="text-slate-800 w-6 h-6 -ml-2" />
                        <div className="flex flex-col">
                            <div className="flex items-center font-black text-slate-800 text-sm">
                                <MapPin size={12} className="mr-1" /> 天钥桥社区... <ChevronDown size={12} />
                            </div>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">24℃ 晴</span>
                </div>

                <div className="px-4 mb-3">
                    <div className="bg-slate-100 rounded-2xl h-9 flex items-center px-4">
                        <Search className="text-slate-400 w-4 h-4 mr-2" />
                        <span className="text-slate-400 text-xs">茶百道 满15减3</span>
                        <div className="ml-auto px-3 py-1 bg-orange-500 text-white text-xs rounded-lg font-bold">搜索</div>
                    </div>
                </div>

                {/* Categories - Grid Styled */}
                <div className="px-4 overflow-x-auto no-scrollbar pb-1">
                    <div className="flex space-x-6">
                        {CATEGORIES.map((cat, i) => (
                            <div key={i} className="flex flex-col items-center shrink-0 space-y-1" onClick={() => setActiveCategory(cat.name)}>
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${cat.color} ${activeCategory === cat.name ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}>
                                    <cat.icon size={18} />
                                </div>
                                <span className={`text-[10px] font-bold ${activeCategory === cat.name ? 'text-slate-900' : 'text-slate-500'}`}>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banners */}
            <div className="px-3 mt-3 overflow-hidden">
                <div className="flex space-x-3 overflow-x-auto no-scrollbar snap-x">
                    {BANNERS.map(b => (
                        <div key={b.id} className="snap-center shrink-0 w-[85%] h-24 rounded-xl overflow-hidden relative">
                            <img src={b.img} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-4">
                                <p className="text-orange-400 font-black text-lg">{b.title}</p>
                                <p className="text-white text-xs font-bold">{b.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="sticky top-[148px] bg-[#F5F5F5] z-20 flex items-center justify-between px-6 py-3 text-xs font-bold text-slate-500">
                <span className="text-slate-900 font-black">综合排序</span>
                <span>销量优先</span>
                <span>速度最快</span>
                <span className="flex items-center">筛选 <Filter size={10} className="ml-1" /></span>
            </div>

            {/* Restaurant List */}
            <div className="px-3 space-y-2 pb-20">
                {RESTAURANTS.map(res => (
                    <div
                        key={res.id}
                        onClick={() => setSelectedRestaurant(res)}
                        className="bg-white rounded-xl p-3 flex space-x-3 active:scale-[0.99] transition-transform"
                    >
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative shrink-0 border border-slate-100">
                            <img src={res.image} className="w-full h-full object-cover" />
                            {res.tags[0] === '现包现煮' || res.tags[0] === '奶茶果汁' ? <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-br-lg font-bold">推荐</div> : null}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <h3 className="font-black text-slate-800 text-base leading-tight">{res.name}</h3>
                                <div className="flex items-center text-[10px] text-slate-500 mt-1.5 space-x-2">
                                    <span className="flex items-center text-orange-500 font-black text-xs">{res.rating}分</span>
                                    <span>月售{res.sales}+</span>
                                    <span className="ml-auto font-medium">{res.time} {res.distance}</span>
                                </div>
                                <div className="flex items-center text-[10px] text-slate-400 mt-1 space-x-2">
                                    <span>起送 ¥{res.minPrice}</span>
                                    <span>配送 ¥{res.delivery}</span>
                                    <span className="bg-transparent border border-orange-200 text-orange-500 px-1 rounded text-[9px]">人均 ¥25</span>
                                </div>
                            </div>

                            {/* Tags/Promos */}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {res.promos.map(p => (
                                    <span key={p} className="text-[9px] border border-red-200 text-red-500 px-1 rounded flex items-center">
                                        {p}
                                    </span>
                                ))}
                                {res.tags.map(t => (
                                    <span key={t} className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded flex items-center">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TakeoutZone;
