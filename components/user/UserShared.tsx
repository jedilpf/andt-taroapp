
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Plus, Clock, ChevronRight, ChevronLeft, Bell, HeartHandshake, ShieldCheck, ShoppingBag, Brain, Coins, Check, Search, Map } from 'lucide-react';
import { Location } from '../../types';
import { useApp } from '../../context/AppContext';

export const AddressSelector = ({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (location: Location) => void;
}) => {
  const navigate = useNavigate();
  const { addresses, currentUser } = useApp();
  const [searchVal, setSearchVal] = useState('');

  const handleManageAddresses = () => {
    onClose();
    navigate('/user/addresses');
  };

  const handlePickOnMap = () => {
    onClose();
    // 跳转到地址增加页面，进入地图选择模式
    navigate('/user/address-add');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
      <div className="w-full max-w-[430px] bg-[#F8FAFC] rounded-t-[2.5rem] p-6 animate-slide-up max-h-[90vh] overflow-y-auto pb-12 safe-area-bottom shadow-2xl pointer-events-auto relative z-10" onClick={(e) => e.stopPropagation()}>
        {/* 顶部标题栏 */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#F8FAFC] z-10 pt-2 pb-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">切换服务位置</h3>
          <button onClick={onClose} className="p-2 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* 模拟搜索框 */}
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search size={18} />
            </div>
            <input 
                type="text" 
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="搜索写字楼 / 小区 / 学校" 
                className="w-full bg-white border border-slate-100 h-12 pl-12 pr-4 rounded-2xl outline-none font-bold text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-300 transition-all"
            />
        </div>

        <div className="space-y-4 pb-6">
          {/* 地图点选入口 */}
          <button 
            onClick={handlePickOnMap}
            className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white border-2 border-blue-50 shadow-sm active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Map size={22} />
                </div>
                <div className="text-left">
                    <p className="font-black text-slate-800">在地图上挑选</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">手动拖拽地图精准定位</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          {/* 地址列表标题 */}
          <div className="flex items-center px-1 pt-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">我的收货地址</span>
          </div>

          {/* 渲染地址列表 */}
          {addresses.map((addr) => {
            const fullAddressString = addr.address + (addr.detail ? ' ' + addr.detail : '');
            const isCurrent = currentUser?.location?.address === fullAddressString;
            
            return (
              <button
                key={addr.id}
                onClick={() => onSelect({ address: fullAddressString, lat: 31.1940, lng: 121.4360 })}
                className={`w-full flex items-start space-x-4 p-5 rounded-[1.5rem] transition-all border-2 ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-500 shadow-md ring-4 ring-blue-500/5' 
                    : 'bg-white border-transparent shadow-sm hover:border-slate-200'
                }`}
              >
                <div className={`mt-1 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                    <MapPin size={22} className={isCurrent ? 'fill-blue-100' : ''} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="font-black text-slate-800 mr-2">{addr.tag || '其他'}</span>
                    {addr.isDefault && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black mr-2">默认</span>}
                    {isCurrent && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">当前选择</span>}
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-tight truncate">{addr.address} {addr.detail}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{addr.name} {addr.gender} {addr.phone}</p>
                </div>
                {isCurrent && (
                    <div className="self-center bg-blue-600 text-white p-1 rounded-full shrink-0">
                        <Check size={14} strokeWidth={4} />
                    </div>
                )}
              </button>
            );
          })}

          <button 
            onClick={handleManageAddresses} 
            className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-white text-slate-400 font-black flex items-center justify-center active:scale-[0.95] transition-all hover:bg-slate-50"
          >
            <Plus size={20} className="mr-2" /> 管理收货地址
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const TimeSelector = ({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (time: string) => void;
}) => {
  const times = [
    '尽快上门',
    '今天 10:00-12:00',
    '今天 14:00-16:00',
    '今天 16:00-18:00',
    '明天 09:00-11:00',
    '明天 14:00-16:00',
    '明天 16:00-18:00',
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto pb-12 safe-area-bottom shadow-2xl pointer-events-auto relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2 pb-2">
          <h3 className="text-lg font-bold text-gray-800">选择上门时间</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="space-y-3 pb-6">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => onSelect(time)}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-50 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-100 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors">
                    <Clock size={18} className="text-gray-400 group-hover:text-white" />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-green-600">{time}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const UserHeader = () => {
  const { currentUser, updateUserLocation, addresses } = useApp();
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
      {
          id: 'safety',
          image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
          bg: 'bg-emerald-600',
          icon: ShieldCheck,
          title: '社区安全公益行',
          subtitle: '消除隐患 · 免费检测 · 守护家园',
          btnText: '免费预约',
          btnColor: 'text-emerald-800 bg-white',
          action: () => navigate('/user/inspection'),
      },
      {
          id: 'store',
          image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1000&q=80',
          bg: 'bg-teal-600',
          icon: ShoppingBag,
          title: '邻里便民驿站',
          subtitle: '国标耗材 · 社区补贴价 · 假一赔十',
          btnText: '查看补贴',
          btnColor: 'text-teal-900 bg-white',
          action: () => navigate('/user/store'),
      },
      {
          id: 'deepseek',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
          bg: 'bg-indigo-600',
          icon: Brain,
          title: 'AI 智能生活顾问',
          subtitle: '用电咨询 · 故障分析 · 生活百科',
          btnText: '免费咨询',
          btnColor: 'text-indigo-900 bg-white',
          action: () => window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { model: 'deepseek' } })),
      },
      {
          id: 'points',
          image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
          bg: 'bg-orange-600',
          icon: Coins,
          title: '消费赚积分',
          subtitle: '积分当钱花 · 首次消费获得额外1000积分',
          btnText: '去赚积分',
          btnColor: 'text-orange-900 bg-white',
          action: () => navigate('/user/points-mall'),
      },
  ];

  useEffect(() => {
      const timer = setInterval(() => {
          setActiveSlide(curr => (curr + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(curr => (curr - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(curr => (curr + 1) % slides.length);
  };

  // --- 核心显示逻辑：匹配当前地址 ---
  const currentAddrStr = currentUser?.location?.address;
  const matchedAddr = addresses.find(a => (a.address + (a.detail ? ' ' + a.detail : '')) === currentAddrStr);
  
  // 格式化首页显示的地址
  const displayAddress = currentAddrStr 
    ? (matchedAddr 
        ? `${matchedAddr.tag}: ${matchedAddr.address.replace('上海市', '').trim().replace(/^[·\s]+/, '')}`
        : (currentAddrStr.startsWith('上海市') 
            ? currentAddrStr.replace('上海市', '').trim().replace(/^[·\s]+/, '')
            : currentAddrStr))
    : '选择服务地址';

  return (
    <div className="relative rounded-b-[2.5rem] overflow-hidden shadow-lg h-[260px] mb-6 group touch-pan-y bg-gray-900 shrink-0">
        <div className="absolute inset-0">
            {slides.map((slide, idx) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className={`w-full h-full ${slide.bg} relative overflow-hidden`}>
                        <div className="absolute inset-0 animate-[subtle-zoom_15s_infinite_alternate]">
                            <img src={slide.image} className="w-full h-full object-cover opacity-60" alt={slide.title} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
                        
                        <div className="absolute bottom-12 left-6 right-6 z-20">
                            <div className="flex items-center space-x-2 mb-2 animate-slide-up">
                                <slide.icon size={20} className="text-white/90" />
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 text-white/90 backdrop-blur-sm bg-white/10`}>
                                    {slide.id === 'deepseek' ? '智能助手' : (slide.id === 'store' ? '便民福利' : (slide.id === 'points' ? '积分福利' : '公益活动'))}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-1 tracking-tight drop-shadow-lg animate-slide-up">
                                {slide.title}
                            </h2>
                            <p className="text-white/90 text-sm font-medium mb-4 animate-slide-up">
                                {slide.subtitle}
                            </p>
                            <button 
                                onClick={slide.action}
                                className={`px-5 py-2 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center animate-slide-up ${slide.btnColor}`}
                            >
                                {slide.btnText} <ChevronRight size={14} className="ml-1"/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 手动导航按钮 */}
        <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
        >
            <ChevronLeft size={20} />
        </button>
        <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
        >
            <ChevronRight size={20} />
        </button>

        {/* 顶部导航与地址选择 */}
        <div className="absolute top-0 left-0 w-full z-30 p-4 pt-safe flex items-center justify-between pointer-events-none">
             <button 
                onClick={() => setShowAddressSelector(true)}
                className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white active:bg-black/60 transition-all max-w-[70%] pointer-events-auto shadow-lg"
            >
                <MapPin size={14} className="text-blue-300 shrink-0" fill="currentColor" />
                <span className="font-bold text-[13px] truncate tracking-wide">
                    {displayAddress}
                </span>
                <ChevronRight size={12} className="text-white/80 rotate-90 shrink-0" />
            </button>
            
            <div className="flex items-center space-x-3 pointer-events-auto">
                <button onClick={() => navigate('/user/care')} className="bg-[#E65100] text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg border border-white/20 flex items-center animate-pulse">
                    <HeartHandshake size={14} className="mr-1" /> 关怀版
                </button>
                <div className="relative" onClick={() => navigate('/user/profile')}>
                    <div className="bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 active:scale-90 cursor-pointer">
                        <Bell size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-4 left-6 z-30 flex space-x-1.5">
            {slides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}></div>
            ))}
        </div>

        {showAddressSelector && (
            <AddressSelector 
                onClose={() => setShowAddressSelector(false)} 
                onSelect={(loc) => { updateUserLocation(loc); setShowAddressSelector(false); }} 
            />
        )}
    </div>
  );
};
