
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Search, MapPin, ChevronRight, X, Loader2, Navigation, Target } from 'lucide-react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useApp } from '../../../context/AppContext';

// --- 虚拟瓦片地图点选弹窗 ---
const MapPickerModal = ({ onSelect, onClose, initialAddr }: { onSelect: (addr: string) => void, onClose: () => void, initialAddr?: string }) => {
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [centerAddr, setCenterAddr] = useState(initialAddr || '定位中...');
    
    // 模拟不同坐标下的地址列表
    const mockNearby = [
        { name: '上海市徐汇区天钥桥路 333 号', sub: '徐汇区 · 天钥桥路', dist: '当前位置', lat: 31.1940, lng: 121.4360 },
        { name: '万科华尔兹花园', sub: '徐汇区 · 天钥桥路 333 弄', dist: '50m', lat: 31.1945, lng: 121.4355 },
        { name: '腾飞大厦', sub: '徐汇区 · 天钥桥路 333 号', dist: '120m', lat: 31.1935, lng: 121.4365 },
        { name: '星游城', sub: '徐汇区 · 天钥桥路 580 号', dist: '450m', lat: 31.1910, lng: 121.4370 },
        { name: '上海体育场', sub: '徐汇区 · 零陵路 800 号', dist: '620m', lat: 31.1950, lng: 121.4420 },
    ];

    // 地图事件处理组件
    const MapEvents = () => {
        useMapEvents({
            dragend: (e) => {
                setSearching(true);
                // 模拟根据新坐标反查地址
                setTimeout(() => {
                    const randomIdx = Math.floor(Math.random() * mockNearby.length);
                    setCenterAddr(mockNearby[randomIdx].name);
                    setSearching(false);
                }, 600);
            },
        });
        return null;
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex flex-col bg-white animate-fade-in pointer-events-auto">
            {/* Header */}
            <div className="bg-white p-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-800" />
                    </button>
                    <h2 className="font-black text-lg">选择收货地址</h2>
                    <div className="w-10"></div>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Search size={18}/></div>
                    <input 
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="搜索写字楼 / 小区 / 学校"
                        className="w-full bg-slate-100 h-12 pl-12 pr-4 rounded-2xl outline-none font-bold text-slate-800 placeholder:text-slate-400 border border-transparent focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-100 z-10 overflow-hidden min-h-[300px]">
                <MapContainer 
                    center={[31.1940, 121.4360]} 
                    zoom={16} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer 
                        url="https://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}" 
                        attribution='&copy; AMap'
                    />
                    <MapEvents />
                </MapContainer>

                {/* 中心十字准星 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mb-4 pointer-events-none z-20">
                    <div className="relative flex flex-col items-center">
                        <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md mb-2 whitespace-nowrap font-black shadow-lg animate-bounce">
                            {searching ? '正在获取位置...' : '设为收货地址'}
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center">
                             <MapPin size={32} className="text-red-500 drop-shadow-lg fill-red-500/20" />
                        </div>
                        <div className="w-2 h-2 bg-black/20 rounded-full blur-[2px] mt-1"></div>
                    </div>
                </div>

                <button className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 border border-slate-100 active:scale-90 transition-transform">
                    <Target size={24} />
                </button>
            </div>

            {/* Address List Area */}
            <div className="h-[45vh] bg-white rounded-t-[2.5rem] -mt-10 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0"></div>
                <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2 no-scrollbar">
                    {mockNearby.map((poi, i) => (
                        <button 
                            key={i} 
                            onClick={() => onSelect(poi.name)}
                            className="w-full bg-white p-4 rounded-3xl flex items-center justify-between border-2 border-transparent hover:border-blue-100 active:scale-[0.98] transition-all group text-left"
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`mt-1 p-2 rounded-xl transition-colors ${i === 0 ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-400 group-hover:text-blue-500'}`}>
                                    <MapPin size={18} fill={i === 0 ? "currentColor" : "none"} className={i===0 ? "opacity-20" : ""}/>
                                </div>
                                <div className="min-w-0">
                                    <h4 className={`font-black text-sm truncate ${i === 0 ? 'text-blue-600' : 'text-slate-800'}`}>{poi.name}</h4>
                                    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{poi.sub}</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-300 font-black ml-4 shrink-0 uppercase">{poi.dist}</span>
                        </button>
                    ))}
                </div>
                
                <div className="p-4 bg-white border-t border-slate-50 shadow-inner">
                    <button 
                        onClick={() => onSelect(centerAddr)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl"
                    >
                        确认选择该点
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const UserAddressEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addresses, addAddress, updateAddress } = useApp();
    
    const isEdit = !!id;
    const existingAddr = isEdit ? addresses.find(a => a.id === id) : null;

    const [tag, setTag] = useState(existingAddr?.tag || '家');
    const [gender, setGender] = useState(existingAddr?.gender || '先生');
    const [showMapPicker, setShowMapPicker] = useState(false);
    
    const [formData, setFormData] = useState({
        address: existingAddr?.address || '',
        door: existingAddr?.detail || '',
        contact: existingAddr?.name || '',
        phone: existingAddr?.phone || ''
    });

    const tags = ['家', '公司', '学校', '其他'];
    const genders = ['先生', '女士'];

    const handleSave = () => {
        if (!formData.address || !formData.door || !formData.contact || !formData.phone) {
            alert('请完善地址信息');
            return;
        }

        const data = {
            tag,
            address: formData.address,
            detail: formData.door,
            name: formData.contact,
            gender: gender,
            phone: formData.phone,
            isDefault: existingAddr?.isDefault || addresses.length === 0
        };

        if (isEdit && id) {
            updateAddress(id, data);
        } else {
            addAddress(data);
        }
        
        navigate('/user/addresses', { replace: true });
    };

    return (
        <div className="h-full bg-white flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 shrink-0 border-b border-gray-100 relative z-10 bg-white">
                <button onClick={() => navigate('/user/addresses')} className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-all">
                    <ArrowLeft size={24} className="text-gray-800"/>
                </button>
                <h1 className="text-lg font-black text-gray-800">{isEdit ? '修改地址' : '新增收货地址'}</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 px-5 space-y-1 overflow-y-auto no-scrollbar pb-24 relative">
                {/* 1. 位置选择 */}
                <div className="py-6 border-b border-gray-100">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-0.5">Delivery Location</label>
                    <div 
                        onClick={() => setShowMapPicker(true)}
                        className={`flex items-center p-5 h-14 bg-slate-50 rounded-[1.5rem] border-2 transition-all cursor-pointer ${formData.address ? 'border-transparent' : 'border-red-100 bg-red-50/10 animate-pulse'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${formData.address ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-500'}`}>
                            <MapPin size={22} fill={formData.address ? "currentColor" : "none"} className={formData.address ? "opacity-20" : ""}/>
                        </div>
                        <div className="flex-1 min-w-0">
                            {formData.address ? (
                                <p className="text-[15px] font-black text-slate-800 truncate leading-none">{formData.address}</p>
                            ) : (
                                <p className="text-[15px] font-black text-red-400 leading-none">点击选择收货地址</p>
                            )}
                        </div>
                        <ChevronRight size={20} className="text-slate-300 ml-2 shrink-0" />
                    </div>
                </div>

                {/* 2. 门牌号 */}
                <div className="flex items-center h-14 border-b border-gray-100">
                    <span className="w-24 text-[15px] text-gray-800 font-black shrink-0">详细地址</span>
                    <input 
                        className="flex-1 text-[15px] outline-none placeholder:text-slate-300 font-black text-slate-800 p-0 h-full leading-none"
                        placeholder="例：1号楼 602室"
                        value={formData.door}
                        onChange={e => setFormData({...formData, door: e.target.value})}
                    />
                </div>

                {/* 3. 标签 */}
                <div className="flex items-center h-14 border-b border-gray-100">
                    <span className="w-24 text-[15px] text-gray-800 font-black shrink-0">地址标签</span>
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar h-full items-center">
                        {tags.map(t => (
                            <button
                                key={t}
                                onClick={() => setTag(t)}
                                className={`px-4 py-1.5 rounded-xl text-[12px] border-2 transition-all whitespace-nowrap ${
                                    tag === t 
                                    ? 'bg-slate-900 border-slate-900 text-white font-black' 
                                    : 'bg-white border-slate-100 text-slate-400 font-bold'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. 联系人 */}
                <div className="flex items-center h-14 border-b border-gray-100">
                    <span className="w-24 text-[15px] text-gray-800 font-black shrink-0">收货姓名</span>
                    <input 
                        className="flex-1 text-[15px] outline-none placeholder:text-slate-300 font-black text-slate-800 p-0 h-full leading-none"
                        placeholder="请填写收货姓名"
                        value={formData.contact}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                    />
                </div>

                {/* 5. 性别选择 */}
                <div className="flex items-center h-14 border-b border-gray-100">
                    <span className="w-24 shrink-0"></span>
                    <div className="flex items-center space-x-10">
                        {genders.map(g => (
                            <button 
                                key={g} 
                                onClick={() => setGender(g)}
                                className="flex items-center space-x-2 text-[14px] text-slate-700 font-black"
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    gender === g ? 'border-[#FFD101] bg-[#FFD101]' : 'border-slate-200'
                                }`}>
                                    {gender === g && <Check size={12} className="text-yellow-900" strokeWidth={4} />}
                                </div>
                                <span className={gender === g ? 'text-slate-900' : 'text-slate-400'}>{g}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 6. 手机号 */}
                <div className="flex items-center h-14 border-b border-gray-100">
                    <span className="w-24 text-[15px] text-gray-800 font-black shrink-0">联系手机</span>
                    <input 
                        type="tel"
                        className="flex-1 text-[15px] outline-none placeholder:text-slate-300 font-black text-slate-800 p-0 h-full leading-none tracking-wider"
                        placeholder="11 位手机号码"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>

                <div className="pt-10">
                    <button 
                        onClick={handleSave}
                        className="w-full py-5 bg-[#FFD101] text-yellow-950 rounded-[1.5rem] font-black text-xl shadow-xl active:scale-[0.98] transition-all"
                    >
                        保存并使用
                    </button>
                </div>
            </div>

            {showMapPicker && (
                <MapPickerModal 
                    initialAddr={formData.address}
                    onClose={() => setShowMapPicker(false)}
                    onSelect={(addr) => {
                        setFormData({ ...formData, address: addr });
                        setShowMapPicker(false);
                    }}
                />
            )}
        </div>
    );
};
