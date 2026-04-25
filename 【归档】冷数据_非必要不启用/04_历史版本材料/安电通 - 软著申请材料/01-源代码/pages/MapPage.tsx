
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import L, { DivIcon } from 'leaflet';
import {
  ChevronLeft,
  Search,
  Navigation,
  X,
  Star,
  Phone,
  Shield,
  DollarSign,
  Crosshair,
  MapPin,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Location, OrderStatus } from '../types';
import { AddressSelector as UserAddressSelector, TimeSelector } from '../components/user/UserShared';

// --- 基础坐标配置 ---
const DEFAULT_LAT = 31.1940;
const DEFAULT_LNG = 121.4360;

// --- 数值安全检查函数 ---
function isValidLatLng(lat: any, lng: any): boolean {
    const nLat = Number(lat);
    const nLng = Number(lng);
    return typeof nLat === 'number' && !isNaN(nLat) && isFinite(nLat) &&
           typeof nLng === 'number' && !isNaN(nLng) && isFinite(nLng);
}

function getDistanceFromLatLonInKm(
  lat1: any,
  lon1: any,
  lat2: any,
  lon2: any,
) {
  if (!isValidLatLng(lat1, lon1) || !isValidLatLng(lat2, lon2)) return '0.0km';
  
  const R = 6371; 
  const dLat = deg2rad(Number(lat2) - Number(lat1));
  const dLon = deg2rad(Number(lon2) - Number(lon1));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(Number(lat1))) *
      Math.cos(deg2rad(Number(lat2))) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return isNaN(d) ? '0.0km' : d.toFixed(1) + 'km';
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// --- Map View Updater Component ---
const MapUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && isValidLatLng(center.lat, center.lng)) {
      try {
        map.flyTo([Number(center.lat), Number(center.lng)], 14, {
          animate: true,
          duration: 0.8,
        });
      } catch (e) {
        console.error("Map flyTo failed:", e);
      }
    }
  }, [center.lat, center.lng, map]);

  useEffect(() => {
      const handleResize = () => {
          if (map) {
              setTimeout(() => {
                  map.invalidateSize();
              }, 200);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

// --- Types ---
interface ElecData {
  id: number;
  name: string;
  avatar: string;
  rating: string;
  orders: string;
  tags: string[];
  distance: string;
  price: number;
  priceStr: string;
  status: 'Busy' | 'Idle';
  lat: number;
  lng: number;
}

// --- Booking Form Drawer ---
const BookingDrawer = ({ elec, onClose }: { elec: ElecData; onClose: () => void }) => {
    const { currentUser, createOrder } = useApp();
    const navigate = useNavigate();
    const [desc, setDesc] = useState('');
    const [selectedTime, setSelectedTime] = useState('尽快上门');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(currentUser?.location || { lat: 0, lng: 0, address: '选择服务地址' });
    const [serviceType, setServiceType] = useState('Repair');
    const [loading, setLoading] = useState(false);

    const handleConfirmBooking = () => {
        setLoading(true);
        setTimeout(() => {
            createOrder({
                type: serviceType as any,
                title: `预约服务 - ${elec.name}`,
                description: desc,
                location: selectedLocation,
                scheduledTime: selectedTime,
                electricianId: elec.id.toString(),
                electricianName: elec.name,
                status: OrderStatus.PENDING,
                priceEstimate: { min: elec.price, max: elec.price + 100 }
            });
            setLoading(false);
            onClose();
            navigate('/user/orders');
        }, 800);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9995] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-[430px] bg-[#F8FAFC] rounded-t-[2.5rem] shadow-2xl pointer-events-auto animate-slide-up relative overflow-hidden max-h-[90vh] flex flex-col">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0"></div>
                <div className="px-6 flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">确认预约：{elec.name}</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-32 no-scrollbar">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center space-x-4 shadow-sm">
                        <img 
                            src={elec.avatar} 
                            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${elec.name}`; }}
                            className="w-12 h-12 rounded-full border border-slate-100 object-cover" 
                            alt="" 
                        />
                        <div>
                            <p className="font-black text-slate-800">{elec.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">起步价 {elec.priceStr}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</p>
                        <div className="grid grid-cols-3 gap-3">
                            {['Repair', 'Install', 'Checkup'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setServiceType(type)}
                                    className={`py-2.5 rounded-2xl text-xs font-black border-2 transition-all ${serviceType === type ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                >
                                    {type === 'Repair' ? '电路急修' : (type === 'Install' ? '上门安装' : '线路检测')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
                        <div onClick={() => setShowAddressPicker(true)} className="flex justify-between items-center p-4 border-b border-slate-50 active:bg-slate-50 transition-colors cursor-pointer rounded-t-[1.8rem]">
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mr-3 shrink-0"><MapPin size={18}/></div>
                                <span className="font-black text-slate-700 text-sm truncate">{selectedLocation.address}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 ml-2" />
                        </div>

                        <div onClick={() => setShowTimePicker(true)} className="flex justify-between items-center p-4 active:bg-slate-50 transition-colors cursor-pointer rounded-b-[1.8rem]">
                            <div className="flex items-center">
                                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mr-3 shrink-0"><Clock size={18}/></div>
                                <span className="font-black text-slate-700 text-sm">{selectedTime}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Requirements</p>
                        <textarea 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="w-full p-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:border-blue-500 transition-all min-h-[100px] shadow-sm"
                            placeholder="请描述您的故障情况或具体服务需求..."
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-50 p-6 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Estimated Price</p>
                            <p className="text-2xl font-black text-red-600">¥{elec.price} <span className="text-[10px] text-slate-300 font-bold ml-1">起</span></p>
                        </div>
                        <div className="bg-emerald-50 px-3 py-1 rounded-lg flex items-center">
                            <ShieldCheck size={14} className="text-emerald-500 mr-1.5" />
                            <span className="text-[10px] font-black text-emerald-700">平台安全保障</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2"/> : null}
                        {loading ? '正在提交...' : '确认预约'}
                    </button>
                </div>
            </div>

            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => {setSelectedTime(t); setShowTimePicker(false);}} />}
            {showAddressPicker && <UserAddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => {setSelectedLocation(loc); setShowAddressPicker(false);}} />}
        </div>,
        document.body
    );
};

// --- Address Selector Component ---
const AddressSelector = ({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (location: Location) => void;
}) => {
  const addresses = [
    { label: '家', address: '上海市 · 徐汇区天钥桥路 333 号', name: '李女士', phone: '138****8000', lat: 31.1940, lng: 121.4360, isDefault: true },
    { label: '公司', address: '上海市 · 静安区静安寺 88 号', name: '李经理', phone: '138****8000', lat: 31.223, lng: 121.445, isDefault: false },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto pb-12 safe-area-bottom shadow-2xl pointer-events-auto relative z-10">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2 pb-2">
          <h3 className="text-lg font-bold text-gray-800">切换定位</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="space-y-4 pb-6">
          {addresses.map((addr, idx) => (
            <button
              key={idx}
              onClick={() => onSelect({ address: addr.address, lat: addr.lat, lng: addr.lng })}
              className={`w-full flex items-start space-x-3 p-4 rounded-2xl transition-colors active:scale-[0.98] ${addr.isDefault ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100 hover:bg-gray-50'}`}
            >
              <div className={`mt-1 ${addr.isDefault ? 'text-green-600' : 'text-gray-400'}`}><MapPin size={20} className={addr.isDefault ? 'fill-green-200' : ''} /></div>
              <div className="text-left flex-1">
                <div className="flex items-center mb-1">
                  <span className="font-bold text-gray-800 mr-2">{addr.label}</span>
                  {addr.isDefault && <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded">默认</span>}
                </div>
                <p className="text-sm text-gray-600 leading-tight">{addr.address}</p>
              </div>
            </button>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-medium flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"><Plus size={20} className="mr-2" /> 新增地址</button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// --- Electrician Detail Modal ---
const ElectricianDetailModal = ({ elec, onClose, onStartBooking }: { elec: ElecData; onClose: () => void; onStartBooking: (elec: ElecData) => void }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9990] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
      <div className="w-full max-w-[430px] bg-white rounded-t-[2rem] shadow-2xl pointer-events-auto animate-slide-up relative overflow-hidden max-h-[85vh] overflow-y-auto pb-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur-md rounded-full z-20 hover:bg-white transition-colors shadow-sm"><X size={20} className="text-gray-500" /></button>
        <div className="relative z-10 px-6 pt-10 pb-10">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-white shadow-xl relative z-10">
                <img 
                    src={elec.avatar} 
                    className="w-full h-full rounded-full object-cover" 
                    alt="Avatar" 
                    onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed="+elec.name; }} 
                />
              </div>
              {elec.status === 'Idle' && (
                <span className="absolute bottom-1 right-1 z-20 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold mt-4 text-gray-900">{elec.name}</h2>
            <div className="flex items-center mt-3 space-x-3 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <div className="flex items-center text-orange-500 font-bold text-sm"><Star size={14} className="fill-current mr-1" /> {elec.rating}</div>
              <div className="w-px h-3 bg-gray-300"></div>
              <span className="text-gray-500 text-xs font-medium">已服务 {elec.orders} 单</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-xs mb-1.5 flex items-center font-medium"><Navigation size={14} className="mr-1.5" /> 距离</span>
              <span className="text-gray-900 font-bold text-xl">{elec.distance}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col items-center justify-center">
              <span className="text-red-400 text-xs mb-1.5 flex items-center font-medium"><DollarSign size={14} className="mr-1.5" /> 起步价</span>
              <span className="text-red-600 font-extrabold text-xl">{elec.priceStr}</span>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center text-sm"><Shield size={16} className="mr-2 text-blue-600" /> 擅长服务</h3>
            <div className="flex flex-wrap gap-2">
              {elec.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-xl font-bold border border-blue-100">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-auto">
            <button className="flex-1 py-4 px-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 text-sm"><Phone size={20} className="mr-2 text-gray-400" /> 电话咨询</button>
            <button onClick={() => onStartBooking(elec)} className="flex-[2] py-4 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/30 flex items-center justify-center text-sm active:scale-95 transition-transform">立即预约</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// --- Map Marker Helpers ---
const createPriceMarkerIcon = (elec: ElecData, isSelected: boolean) => {
  const size = isSelected ? 56 : 48;
  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${elec.name}`;
  return new DivIcon({
    className: 'custom-price-marker',
    html: `
      <div class="relative flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110 z-50' : 'scale-100'}">
         <div class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap border border-white">${elec.priceStr}</div>
         <div class="relative">
             <img 
                src="${elec.avatar}" 
                onerror="this.src='${fallbackAvatar}'" 
                class="w-12 h-12 rounded-full border-2 ${isSelected ? 'border-green-500 shadow-green-500/50' : 'border-white'} shadow-lg bg-gray-100 object-cover" 
             />
             ${elec.status === 'Idle' ? '<div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
         </div>
         <div class="mt-1 w-2 h-2 bg-black/20 rounded-full blur-sm"></div>
       </div>
    `,
    iconSize: [size, size + 20],
    iconAnchor: [size / 2, size + 10],
  });
};

const userIcon = new DivIcon({
  className: 'user-location-marker',
  html: `<div class="relative flex items-center justify-center w-12 h-12"><div class="absolute w-full h-full bg-blue-500 opacity-20 rounded-full animate-ping"></div><div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md relative z-10"></div></div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// --- Raw Data ---
const RAW_ELECTRICIANS = [
  { id: 1, name: '王师傅', avatar: '/assets/avatars/p1.png', rating: '4.9', orders: '582', tags: ['电路抢修', '老房改造', '开关插座'], price: 50, priceStr: '¥50起', status: 'Idle', lat: 31.1960, lng: 121.4380 },
  { id: 2, name: '张师傅', avatar: '/assets/avatars/p2.png', rating: '4.8', orders: '129', tags: ['灯具安装', '家电接线', '浴霸安装'], price: 40, priceStr: '¥40起', status: 'Idle', lat: 31.1920, lng: 121.4340 },
  { id: 3, name: '李师傅', avatar: '/assets/avatars/p3.png', rating: '4.9', orders: '340', tags: ['老房翻新', '弱电布线', '监控安装'], price: 50, priceStr: '¥50起', status: 'Busy', lat: 31.1950, lng: 121.4330 },
  { id: 4, name: '赵师傅', avatar: '/assets/avatars/p4.png', rating: '4.7', orders: '88', tags: ['跳闸急修', '漏电检测'], price: 60, priceStr: '¥60起', status: 'Idle', lat: 31.1910, lng: 121.4390 },
  { id: 5, name: '陈师傅', avatar: '/assets/avatars/p5.png', rating: '5.0', orders: '1024', tags: ['智能家居', '全屋定制'], price: 45, priceStr: '¥45起', status: 'Idle', lat: 31.1970, lng: 121.4350 },
];

const MapPage: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  const navigate = useNavigate();
  const { currentUser, updateUserLocation } = useApp();
  const [selectedElec, setSelectedElec] = useState<ElecData | null>(null);
  const [bookingElec, setBookingElec] = useState<ElecData | null>(null);
  const [focusedElecId, setFocusedElecId] = useState<number | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 100);
    }
  }, [isActive, mapInstance]);

  const center = useMemo(() => {
    const loc = currentUser?.location;
    if (loc && isValidLatLng(loc.lat, loc.lng)) {
        return { 
            lat: Number(loc.lat), 
            lng: Number(loc.lng), 
            address: loc.address 
        };
    }
    return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, address: '上海市 · 徐汇区' };
  }, [currentUser?.location]);

  const allElectricians: ElecData[] = useMemo(() => {
    return RAW_ELECTRICIANS.map((elec) => ({
      ...elec,
      status: elec.status as 'Busy' | 'Idle',
      distance: getDistanceFromLatLonInKm(center.lat, center.lng, elec.lat, elec.lng),
    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [center.lat, center.lng]);

  const filteredElectricians = allElectricians.filter(
    (elec) => elec.name.includes(searchQuery) || elec.tags.some((tag) => tag.includes(searchQuery))
  );

  const safeCenter: [number, number] = useMemo(() => {
    const lat = isValidLatLng(center.lat, center.lng) ? Number(center.lat) : DEFAULT_LAT;
    const lng = isValidLatLng(center.lat, center.lng) ? Number(center.lng) : DEFAULT_LNG;
    return [lat, lng];
  }, [center]);

  const handleMarkerClick = (elec: ElecData) => {
    if (!isValidLatLng(elec.lat, elec.lng)) return;
    setFocusedElecId(elec.id);
    if (mapInstance) {
      mapInstance.flyTo([Number(elec.lat), Number(elec.lng)], 15);
    }
    const card = document.getElementById(`elec-card-${elec.id}`);
    if (card && listRef.current) {
      const container = listRef.current;
      const scrollLeft = card.offsetLeft - container.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const startBooking = (elec: ElecData) => {
      setSelectedElec(null);
      setBookingElec(elec);
  };

  return (
    <div className="h-full w-full relative bg-gray-100 flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-[800] flex space-x-3 pointer-events-none">
        <button onClick={() => navigate(-1)} className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/20 pointer-events-auto active:scale-95 transition-transform"><ChevronLeft size={24} className="text-gray-700" /></button>
        <div className="flex-1 bg-white/95 backdrop-blur-sm p-1 pl-4 rounded-full shadow-lg flex items-center border border-white/20 pointer-events-auto">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜名字、技能" className="flex-1 outline-none text-sm bg-transparent py-2 text-gray-800 placeholder-gray-400" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400"><X size={16} /></button>}
        </div>
      </div>

      <div className="absolute top-20 left-0 w-full z-[750] flex justify-center pointer-events-none">
        <button onClick={() => setShowAddressSelector(true)} className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs flex items-center shadow-lg pointer-events-auto border border-white/10 active:scale-95 transition-transform max-w-[90%]">
          <MapPin size={12} className="mr-1.5 text-green-400 shrink-0" />
          <span className="truncate mr-1">{center.address}</span>
          <ChevronRight size={12} className="rotate-90 text-white/60 shrink-0" />
        </button>
      </div>

      {isValidLatLng(safeCenter[0], safeCenter[1]) && (
        <MapContainer center={safeCenter} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false} ref={setMapInstance}>
          <MapUpdater center={center} />
          <TileLayer attribution='&copy; <a href="https://www.amap.com/">高德地图</a>' url="https://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}" />
          <Marker position={safeCenter} icon={userIcon} />
          {filteredElectricians.map((elec) => isValidLatLng(elec.lat, elec.lng) && (
            <Marker key={elec.id} position={[Number(elec.lat), Number(elec.lng)]} icon={createPriceMarkerIcon(elec, focusedElecId === elec.id)} eventHandlers={{ click: () => handleMarkerClick(elec) }} />
          ))}
        </MapContainer>
      )}

      <button onClick={() => mapInstance?.flyTo(safeCenter, 14)} className="absolute bottom-48 right-4 z-[800] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 active:scale-95 transition-transform border border-gray-100 pointer-events-auto"><Crosshair size={24} /></button>

      <div className="absolute bottom-6 w-full z-[800]">
        <div ref={listRef} className="flex overflow-x-auto px-4 space-x-4 pb-4 pt-4 snap-x snap-mandatory no-scrollbar pointer-events-auto" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
          {filteredElectricians.length === 0 ? (
            <div className="w-full bg-white/90 backdrop-blur p-4 rounded-2xl text-center shadow-lg mx-auto"><p className="text-gray-500 text-sm">没有找到匹配的电工</p></div>
          ) : filteredElectricians.map((elec) => (
            <div key={elec.id} id={`elec-card-${elec.id}`} onClick={() => handleMarkerClick(elec)} className={`relative flex-shrink-0 w-[88%] sm:w-[360px] bg-white p-5 rounded-[24px] shadow-2xl snap-center transition-all duration-300 ${focusedElecId === elec.id ? 'border-2 border-green-500 ring-4 ring-green-500/10 scale-100' : 'scale-[0.95] opacity-90'}`}>
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative shrink-0">
                  <img 
                    src={elec.avatar} 
                    className="w-14 h-14 rounded-full bg-gray-50 object-cover border border-gray-100" 
                    alt="Avatar" 
                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${elec.name}`; }} 
                  />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${elec.status === 'Idle' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg truncate leading-tight">{elec.name}</h3>
                      <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                        <span className="text-orange-500 font-bold flex items-center"><Star size={10} className="fill-current mr-0.5" /> {elec.rating}</span>
                        <span className="w-px h-3 bg-gray-300"></span><span>{elec.orders}单</span>
                        <span className="w-px h-3 bg-gray-300"></span><span>{elec.distance}</span>
                      </div>
                    </div>
                    <span className="text-red-500 font-extrabold text-xl">{elec.priceStr}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">{elec.tags.slice(0, 3).map((tag) => <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md font-medium">{tag}</span>)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={(e) => { e.stopPropagation(); setSelectedElec(elec); }} className="flex-1 py-3.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm active:scale-[0.98] transition-all">查看详情</button>
                <button onClick={(e) => { e.stopPropagation(); startBooking(elec); }} className="flex-[2] py-3.5 bg-green-600 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg shadow-green-200">立即预约</button>
              </div>
            </div>
          ))}
          <div className="w-2 flex-shrink-0"></div>
        </div>
      </div>

      {selectedElec && <ElectricianDetailModal elec={selectedElec} onStartBooking={startBooking} onClose={() => setSelectedElec(null)} />}
      {bookingElec && <BookingDrawer elec={bookingElec} onClose={() => setBookingElec(null)} />}
      {showAddressSelector && <AddressSelector onClose={() => setShowAddressSelector(false)} onSelect={(loc) => { updateUserLocation(loc); setShowAddressSelector(false); }} />}
    </div>
  );
};

export default MapPage;
