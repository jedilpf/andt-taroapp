
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Fix: Added missing ShieldCheck and Lock to the lucide-react imports
import { ArrowLeft, Droplet, Key, Sparkles, Hammer, Scan, ShieldAlert, ShieldCheck, CheckCircle, MapPin, Clock, ChevronRight, AlertCircle, Eye, Activity, ThermometerSun, SearchCheck, Wind, Home, Lock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, Location } from '../../../types';
import { AddressSelector, TimeSelector } from '../../../components/user/UserShared';

const SERVICE_CONFIG: any = {
    'pipe': {
        title: '管道内窥检测',
        icon: Eye,
        theme: 'from-blue-500 to-cyan-600',
        bgLight: 'bg-blue-50',
        textLight: 'text-blue-600',
        items: [
            { name: '下水道超声波测漏', price: 120 },
            { name: '管网内窥镜排查', price: 180 },
            { name: '排污口淤积度检测', price: 80 },
            { name: '全屋水路压力评估', price: 150 },
        ]
    },
    'unlock': {
        title: '安防锁具检测',
        icon: Lock,
        theme: 'from-orange-500 to-amber-600',
        bgLight: 'bg-orange-50',
        textLight: 'text-orange-600',
        items: [
            { name: '锁芯安全等级评估', price: 30 },
            { name: '智能锁指纹漏洞检测', price: 50 },
            { name: '入户门闭合强度测试', price: 40 },
            { name: '居家防盗系数综合评估', price: 100 },
        ]
    },
    'cleaning': {
        title: '电器能耗/故障检测',
        icon: Activity,
        theme: 'from-cyan-500 to-teal-600',
        bgLight: 'bg-cyan-50',
        textLight: 'text-cyan-600',
        items: [
            { name: '空调制冷能效测评', price: 60 },
            { name: '洗衣机内桶污染度检测', price: 40 },
            { name: '冰箱密封性/运行音测试', price: 30 },
            { name: '热水器内部积垢评估', price: 50 },
        ]
    },
    'leak': {
        title: '红外渗漏探测',
        icon: ThermometerSun,
        theme: 'from-slate-500 to-gray-600',
        bgLight: 'bg-slate-50',
        textLight: 'text-slate-600',
        items: [
            { name: '墙体含水率红外扫描', price: 200 },
            { name: '楼顶渗水点精准定位', price: 300 },
            { name: '窗框密封/漏风点检测', price: 100 },
            { name: '卫生间防水层完整性评估', price: 150 },
        ]
    },
    'air': {
        title: '居家环境健康检测',
        icon: Wind,
        theme: 'from-emerald-500 to-green-600',
        bgLight: 'bg-emerald-50',
        textLight: 'text-emerald-600',
        items: [
            { name: '甲醛/TVOC精准采样', price: 150 },
            { name: '室内PM2.5/粉尘浓度评估', price: 80 },
            { name: '过敏原/霉菌分布探测', price: 200 },
            { name: '光照/噪音环境宜居度测评', price: 50 },
        ]
    },
    'housekeeping': {
        title: '居家安全综合评估',
        icon: ShieldAlert,
        theme: 'from-pink-500 to-rose-600',
        bgLight: 'bg-pink-50',
        textLight: 'text-pink-600',
        items: [
            { name: '高空坠物隐患排查', price: 50 },
            { name: '家具倾倒风险评估', price: 30 },
            { name: '浴室滑倒风险测评', price: 40 },
            { name: '居家防火逃生路线评估', price: 0 },
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
    
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 0, lng: 0, address: '选择服务地址' });
    const [scheduledTime, setScheduledTime] = useState('尽快上门');

    const handleBooking = () => {
        if (!currentUser) return;
        createOrder({
            type: 'Checkup', 
            title: `专业检测 - ${selectedItem.name}`,
            description: `【检测项目】: ${config.title}\n【子项】: ${selectedItem.name}\n【备注】: ${desc || '无'}`,
            priceEstimate: { min: selectedItem.price, max: selectedItem.price },
            location: selectedLocation,
            scheduledTime: scheduledTime,
            status: OrderStatus.PENDING
        });
        navigate('/user/orders');
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
             <div className={`sticky top-0 z-20 px-4 py-3 flex items-center space-x-3 ${config.bgLight} transition-shadow shadow-sm`}>
                 <button onClick={handleBack} className="p-2 -ml-2 bg-white/60 rounded-full backdrop-blur hover:bg-white/80 active:scale-95 transition-all">
                     <ArrowLeft size={20} className="text-gray-700"/>
                 </button>
                 <h1 className="text-lg font-bold text-gray-800">{config.title}</h1>
             </div>

             <div className={`px-6 pb-6 pt-2 ${config.bgLight}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 mb-1">{selectedItem.name}</h2>
                        <div className="flex items-center text-sm text-gray-500">
                            <CheckCircle size={14} className={`mr-1 ${config.textLight}`}/> 专业仪器
                            <span className="mx-2">•</span>
                            <CheckCircle size={14} className={`mr-1 ${config.textLight}`}/> 权威报告
                        </div>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.theme} flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                        <config.icon size={32} />
                    </div>
                </div>
             </div>

             <div className="px-4 -mt-4 space-y-4 pb-24 relative z-10">
                 <div className="bg-white rounded-2xl p-5 shadow-sm">
                     <h3 className="font-bold text-gray-800 mb-3 text-sm">选择具体探测项</h3>
                     <div className="grid grid-cols-1 gap-2">
                         {config.items.map((item: any, i: number) => (
                             <button 
                                key={i}
                                onClick={() => setSelectedItem(item)}
                                className={`px-4 py-3 rounded-xl text-sm font-bold border flex justify-between items-center transition-all ${selectedItem.name === item.name ? `${config.bgLight} ${config.textLight} border-transparent ring-2 ring-opacity-50 ring-current` : 'bg-gray-50 border-transparent text-gray-600'}`}
                             >
                                 <span>{item.name}</span>
                                 <span className="opacity-80 font-black">¥{item.price}</span>
                             </button>
                         ))}
                     </div>
                 </div>

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
                          <p className="font-bold text-gray-700 text-sm mb-2">补充检测说明</p>
                          <textarea 
                              value={desc}
                              onChange={e => setDesc(e.target.value)}
                              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none min-h-[80px]"
                              placeholder="如有已知异常（如疑似渗水点、锁体异响），请补充描述..."
                          />
                      </div>
                 </div>
                 
                 <div className="bg-blue-50 rounded-2xl p-4 flex items-start space-x-3">
                     <SearchCheck size={16} className="text-blue-500 mt-0.5 shrink-0"/>
                     <div className="text-xs text-blue-700">
                         <p className="font-bold mb-1">专业检测承诺</p>
                         <p className="opacity-80 text-[10px]">所有检测均由持证技师操作，现场出具电子/纸质检测报告。检测不涉及施工，若需整改将另行出具方案。</p>
                     </div>
                 </div>
             </div>

             <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                 <div className="max-w-screen-md mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">检测总费用</p>
                        <div className="flex items-baseline text-red-600">
                            <span className="text-xs font-bold">¥</span>
                            <span className="text-2xl font-extrabold mx-1">{selectedItem.price}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleBooking}
                        className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-gradient-to-r ${config.theme}`}
                    >
                        预约上门检测
                    </button>
                 </div>
             </div>

            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => {setScheduledTime(t); setShowTimePicker(false);}} />}
            {showAddressPicker && <AddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => {setSelectedLocation(loc); setShowAddressPicker(false);}} />}
        </div>
    );
}

export const LocalServicesPage = () => {
    const navigate = useNavigate();
    const categories = [
        { id: "pipe", name: "管道内窥检测", icon: Eye, color: "text-blue-500 bg-blue-50" },
        { id: "unlock", name: "安防锁具检测", icon: ShieldCheck, color: "text-orange-500 bg-orange-50" },
        { id: "cleaning", name: "电器性能评估", icon: Activity, color: "text-cyan-500 bg-cyan-50" },
        { id: "leak", name: "红外渗漏扫描", icon: ThermometerSun, color: "text-slate-500 bg-slate-50" },
        { id: "air", name: "环境健康检测", icon: Wind, color: "text-emerald-500 bg-emerald-50" },
        { id: "housekeeping", name: "居家安全综合评估", icon: Home, color: "text-pink-500 bg-pink-50" },
    ];

    const handleBack = () => navigate('/user/home');

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-20">
             <div className="bg-white p-4 sticky top-0 z-10 flex items-center space-x-3 shadow-sm">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">专业检测大厅</h1>
            </div>
            
            <div className="p-4">
                <div className="bg-blue-600 rounded-2xl p-5 text-white mb-6 shadow-lg shadow-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-1">专业仪器 · 数据驱动</h3>
                        <p className="text-xs opacity-80">引进 FLUKE、FLIR 等国际尖端检测设备</p>
                    </div>
                    <SearchCheck size={100} className="absolute -right-4 -bottom-6 opacity-10 rotate-12" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat, i) => (
                        <div key={i} onClick={() => navigate(`/user/local/${cat.id}`)} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center h-32 active:scale-[0.98] transition-all shadow-sm cursor-pointer hover:border-blue-200 group">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${cat.color} group-hover:scale-110 transition-transform`}>
                                 <cat.icon size={24}/>
                             </div>
                             <span className="font-bold text-gray-700 text-sm text-center">{cat.name}</span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center">
                    <AlertCircle size={16} className="text-orange-500 mr-2 shrink-0"/>
                    <p className="text-[10px] text-orange-700 font-bold leading-relaxed">温馨提示：本频道提供的仅为专业检测与评估服务，若需维修施工建议咨询平台电工或对应厂家。</p>
                </div>
            </div>
        </div>
    )
}
