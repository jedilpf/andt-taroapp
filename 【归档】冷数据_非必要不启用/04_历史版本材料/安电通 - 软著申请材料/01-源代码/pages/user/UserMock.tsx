
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Video, Zap, Key, Camera, Box, Headphones, MessageCircle, PhoneCall, Droplet, Sparkles, Hammer, Scan, ShoppingBag, ChevronRight, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Location } from '../../types';
import { AddressSelector, TimeSelector } from '../../components/user/UserShared';

// --- Safety Academy ---
export const SafetyAcademyPage = () => {
  const navigate = useNavigate();
  const articles = [
    { id: 1, title: "冬季家庭用电“十不准”", category: "必读", views: "10w+", image: "https://images.unsplash.com/photo-1473221326025-c4337b756488?w=150&h=150&fit=crop" },
    { id: 2, title: "漏电保护器每月自检指南", category: "科普", views: "5.2w+", image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=150&h=150&fit=crop" },
    { id: 3, title: "家中突然跳闸？电工教你三步排查", category: "急救", views: "8.9w+", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&h=150&fit=crop" },
    { id: 4, title: "电动车充电火灾隐患大盘点", category: "警示", views: "12w+", image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=150&h=150&fit=crop" },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-white pb-20">
       <div className="bg-white p-4 sticky top-0 z-10 flex items-center space-x-3 border-b border-gray-100 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
          <h1 className="text-lg font-bold">安全学院</h1>
      </div>
      <div className="p-4 space-y-4">
          {/* Featured Video */}
          <div className="relative rounded-2xl overflow-hidden h-48 bg-black group cursor-pointer">
             <img src="https://images.unsplash.com/photo-1615811361269-669249293d80?w=600&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" alt="Video"/>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                    <Video size={24} className="fill-white text-white ml-1"/>
                </div>
                <span className="font-bold text-lg">3分钟看懂家庭电路</span>
             </div>
          </div>

          <div className="space-y-3">
             {articles.map(art => (
                 <div key={art.id} className="flex space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100 active:scale-[0.99] transition-transform">
                     <div className="w-24 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                         <img src={art.image} className="w-full h-full object-cover" alt="Thumb"/>
                     </div>
                     <div className="flex flex-col justify-between flex-1 py-0.5">
                         <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{art.title}</h3>
                         <div className="flex justify-between items-center text-xs text-gray-400">
                             <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">{art.category}</span>
                             <span>{art.views} 阅读</span>
                         </div>
                     </div>
                 </div>
             ))}
          </div>
      </div>
    </div>
  );
}

// --- Smart Home ---
export const SmartHomePage = () => {
    const navigate = useNavigate();
    const services = [
        { id: 1, title: "全屋智能灯光改造", price: "1999", unit: "起", desc: "含网关+智能开关+安装调试", icon: Zap, color: "text-yellow-500 bg-yellow-50" },
        { id: 2, title: "智能门锁上门安装", price: "200", unit: "起", desc: "适配99%防盗门，不含锁具", icon: Key, color: "text-blue-500 bg-blue-50" },
        { id: 3, title: "监控安防布线", price: "300", unit: "起/点", desc: "专业走线，美观隐形", icon: Camera, color: "text-green-500 bg-green-50" },
        { id: 4, title: "电动窗帘轨道安装", price: "150", unit: "起/米", desc: "支持双轨/L型轨道", icon: Box, color: "text-purple-500 bg-purple-50" },
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-indigo-50 pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 flex items-center space-x-3 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">智慧家居</h1>
            </div>
            <div className="p-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                    <h2 className="text-2xl font-bold mb-1">让家更懂你</h2>
                    <p className="opacity-80 text-sm mb-4">专业师傅上门，定制您的未来生活</p>
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-full text-xs font-bold">免费预约方案设计</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {services.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center space-x-4 border border-white/50">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.desc}</p>
                                <div className="flex items-baseline mt-1 text-red-500">
                                    <span className="text-xs">¥</span>
                                    <span className="text-lg font-bold mx-0.5">{item.price}</span>
                                    <span className="text-xs text-gray-400">{item.unit}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/user/repair')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">预约</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// --- Online Support ---
export const OnlineSupportPage = () => {
    const navigate = useNavigate();
    const faqs = ["收费标准是什么？", "师傅接单后多久上门？", "修不好收费吗？", "如何申请售后？"];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-20 flex flex-col">
             <div className="bg-green-600 p-4 pb-12 text-white relative shrink-0">
                 <div className="flex items-center space-x-3 relative z-10">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-green-500/50 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-bold">在线客服</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-50 rounded-t-3xl"></div>
             </div>
             
             <div className="flex-1 px-4 -mt-4 z-10">
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                         <Headphones size={32}/>
                     </div>
                     <h2 className="font-bold text-gray-800 text-lg">很高兴为您服务</h2>
                     <p className="text-gray-400 text-xs mt-1">服务时间：09:00 - 22:00</p>
                     
                     <div className="flex gap-3 mt-6">
                         <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center shadow-lg shadow-green-500/30">
                             <MessageCircle size={18} className="mr-2"/> 在线咨询
                         </button>
                         <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center">
                             <PhoneCall size={18} className="mr-2"/> 电话客服
                         </button>
                     </div>
                 </div>

                 <h3 className="font-bold text-gray-800 mb-3 ml-1">常见问题</h3>
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                     {faqs.map((q, i) => (
                         <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
                             <span className="text-sm text-gray-700">{q}</span>
                             <ChevronRight size={16} className="text-gray-300"/>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    )
}

// --- Local Service Detail Page (Dynamic) ---
const SERVICE_CONFIG: any = {
    'pipe': {
        title: '管道疏通',
        icon: Droplet,
        theme: 'from-blue-500 to-cyan-600',
        bgLight: 'bg-blue-50',
        textLight: 'text-blue-600',
        items: [
            { name: '马桶疏通', price: 80 },
            { name: '下水道疏通', price: 100 },
            { name: '洗菜盆疏通', price: 60 },
            { name: '主管道疏通', price: 200 },
        ]
    },
    'unlock': {
        title: '开锁换锁',
        icon: Key,
        theme: 'from-orange-500 to-amber-600',
        bgLight: 'bg-orange-50',
        textLight: 'text-orange-600',
        items: [
            { name: '防盗门开锁', price: 100 },
            { name: '更换锁芯', price: 150 },
            { name: '汽车开锁', price: 200 },
            { name: '智能锁安装', price: 180 },
        ]
    },
    'cleaning': {
        title: '家电清洗',
        icon: Sparkles,
        theme: 'from-cyan-500 to-teal-600',
        bgLight: 'bg-cyan-50',
        textLight: 'text-cyan-600',
        items: [
            { name: '空调清洗', price: 98 },
            { name: '油烟机清洗', price: 158 },
            { name: '洗衣机清洗', price: 108 },
            { name: '冰箱清洗', price: 128 },
        ]
    },
    'leak': {
        title: '房屋补漏',
        icon: Hammer,
        theme: 'from-slate-500 to-gray-600',
        bgLight: 'bg-slate-50',
        textLight: 'text-slate-600',
        items: [
            { name: '卫生间防水', price: 300 },
            { name: '屋顶补漏', price: 500 },
            { name: '阳台防水', price: 280 },
            { name: '外墙修补', price: 400 },
        ]
    },
    'air': {
        title: '甲醛检测',
        icon: Scan,
        theme: 'from-emerald-500 to-green-600',
        bgLight: 'bg-emerald-50',
        textLight: 'text-emerald-600',
        items: [
            { name: 'CMA标准检测', price: 150 },
            { name: '甲醛治理', price: 30 },
            { name: '空气净化', price: 200 },
        ]
    },
    'housekeeping': {
        title: '家庭保洁',
        icon: ShoppingBag,
        theme: 'from-pink-500 to-rose-600',
        bgLight: 'bg-pink-50',
        textLight: 'text-pink-600',
        items: [
            { name: '日常保洁 (2h)', price: 100 },
            { name: '深度保洁', price: 300 },
            { name: '擦窗服务', price: 150 },
            { name: '开荒保洁', price: 400 },
        ]
    }
};

export const LocalServiceDetail = () => {
    const { serviceId } = useParams<{serviceId: string}>();
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    
    const config = SERVICE_CONFIG[serviceId || ''] || SERVICE_CONFIG['pipe'];
    const [selectedItem, setSelectedItem] = useState<any>(config.items[0]);
    const [desc, setDesc] = useState('');
    
    // Location & Time State
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 0, lng: 0, address: '选择服务地址' });
    const [scheduledTime, setScheduledTime] = useState('尽快上门');

    const handleBooking = () => {
        if (!currentUser) return;
        createOrder({
            type: 'Install', // Generic service type
            title: `${config.title} - ${selectedItem.name}`,
            description: desc,
            priceEstimate: { min: selectedItem.price, max: selectedItem.price * 1.5 },
            location: selectedLocation,
            scheduledTime: scheduledTime,
            status: OrderStatus.PENDING
        });
        navigate('/user/orders');
    };

    // Explicitly go back to local services list to avoid navigation loop/failure
    const handleBack = () => navigate('/user/local');

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
             {/* Sticky Header - Now a direct child of scroll container so it sticks properly */}
             <div className={`sticky top-0 z-20 px-4 py-3 flex items-center space-x-3 ${config.bgLight} transition-shadow shadow-sm`}>
                 <button onClick={handleBack} className="p-2 -ml-2 bg-white/60 rounded-full backdrop-blur hover:bg-white/80 active:scale-95 transition-all">
                     <ArrowLeft size={20} className="text-gray-700"/>
                 </button>
                 <h1 className="text-lg font-bold text-gray-800">{config.title}</h1>
             </div>

             {/* Banner Content */}
             <div className={`px-6 pb-6 pt-2 ${config.bgLight}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 mb-1">{selectedItem.name}</h2>
                        <div className="flex items-center text-sm text-gray-500">
                            <CheckCircle size={14} className={`mr-1 ${config.textLight}`}/> 专业师傅
                            <span className="mx-2">•</span>
                            <CheckCircle size={14} className={`mr-1 ${config.textLight}`}/> 售后无忧
                        </div>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.theme} flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                        <config.icon size={32} />
                    </div>
                </div>
             </div>

             {/* Content */}
             <div className="px-4 -mt-4 space-y-4 pb-24 relative z-10">
                 {/* Service Items */}
                 <div className="bg-white rounded-2xl p-5 shadow-sm">
                     <h3 className="font-bold text-gray-800 mb-3 text-sm">选择服务项目</h3>
                     <div className="flex flex-wrap gap-3">
                         {config.items.map((item: any, i: number) => (
                             <button 
                                key={i}
                                onClick={() => setSelectedItem(item)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedItem.name === item.name ? `${config.bgLight} ${config.textLight} border-transparent ring-2 ring-opacity-50 ring-current` : 'bg-gray-50 border-transparent text-gray-600'}`}
                             >
                                 {item.name}
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
                              <span className="font-bold text-gray-700 text-sm">{scheduledTime}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-300"/>
                      </div>

                      <div>
                          <p className="font-bold text-gray-700 text-sm mb-2">需求备注</p>
                          <textarea 
                              value={desc}
                              onChange={e => setDesc(e.target.value)}
                              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none min-h-[80px]"
                              placeholder="请简要描述您的需求..."
                          />
                      </div>
                 </div>
                 
                 {/* Price & Tips */}
                 <div className="bg-orange-50 rounded-2xl p-4 flex items-start space-x-3">
                     <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0"/>
                     <div className="text-xs text-orange-700">
                         <p className="font-bold mb-1">温馨提示</p>
                         <p className="opacity-80">实际价格可能因现场施工难度有所浮动，以上价格仅供参考。师傅上门后会先报价，您确认后再施工。</p>
                     </div>
                 </div>
             </div>

             {/* Bottom Bar - Full Width */}
             <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                 <div className="max-w-screen-md mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400">预估费用</p>
                        <div className="flex items-baseline text-red-600">
                            <span className="text-xs font-bold">¥</span>
                            <span className="text-2xl font-extrabold mx-1">{selectedItem.price}</span>
                            <span className="text-xs text-gray-500 font-normal">起</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleBooking}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-gradient-to-r ${config.theme}`}
                    >
                        立即预约
                    </button>
                 </div>
             </div>

            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => {setScheduledTime(t); setShowTimePicker(false);}} />}
            {showAddressPicker && <AddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => {setSelectedLocation(loc); setShowAddressPicker(false);}} />}
        </div>
    );
}

// --- Local Services Hub Page ---
export const LocalServicesPage = () => {
    const navigate = useNavigate();
    const categories = [
        { id: "pipe", name: "管道疏通", icon: Droplet, color: "text-blue-500 bg-blue-50" },
        { id: "unlock", name: "开锁换锁", icon: Key, color: "text-orange-500 bg-orange-50" },
        { id: "cleaning", name: "家电清洗", icon: Sparkles, color: "text-cyan-500 bg-cyan-50" },
        { id: "leak", name: "房屋补漏", icon: Hammer, color: "text-slate-500 bg-slate-50" },
        { id: "air", name: "甲醛检测", icon: Scan, color: "text-emerald-500 bg-emerald-50" },
        { id: "housekeeping", name: "家庭保洁", icon: ShoppingBag, color: "text-pink-500 bg-pink-50" },
    ];

    // Explicitly go back to Home to avoid navigation failure
    const handleBack = () => navigate('/user/home');

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-20">
             <div className="bg-white p-4 sticky top-0 z-10 flex items-center space-x-3 shadow-sm">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">本地服务</h1>
            </div>
            
            <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat, i) => (
                        <div key={i} onClick={() => navigate(`/user/local/${cat.id}`)} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center h-32 active:scale-[0.98] transition-all shadow-sm cursor-pointer hover:border-green-200">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${cat.color}`}>
                                 <cat.icon size={24}/>
                             </div>
                             <span className="font-bold text-gray-700">{cat.name}</span>
                        </div>
                    ))}
                </div>
                
                <p className="text-center text-xs text-gray-400 mt-8">更多服务接入中...</p>
            </div>
        </div>
    )
}
