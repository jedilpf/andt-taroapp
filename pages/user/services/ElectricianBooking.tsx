
import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus, Location } from '../../../types';
import { TimeSelector, AddressSelector } from '../../../components/user/UserShared';

export const ElectricianBookingPage = () => {
    const { elecId } = useParams<{ elecId: string }>();
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
        name: '王师傅',
        // Updated fallback avatar to Unsplash
        avatar: '/assets/avatars/p1.png',
        rating: '5.0',
        priceStr: '¥40起',
        tags: ['专业电工'],
        identity: 'PARTY' // Mock Identity: 'PARTY' | 'VERIFIED' | 'NONE'
    };

    const minPrice = parseInt(elec.priceStr?.replace(/\D/g, '') || '40');

    // Identity Styling Helpers
    const isPartyMember = elec.identity === 'PARTY';
    const isVerified = elec.identity === 'VERIFIED';

    const cardBgClass = isPartyMember ? 'bg-gradient-to-r from-red-50 to-white border-red-100' : (isVerified ? 'bg-gradient-to-r from-blue-50 to-white border-blue-100' : 'bg-white border-gray-100');
    const avatarBorderClass = isPartyMember ? 'border-red-500' : (isVerified ? 'border-blue-500' : 'border-white');

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
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"><ArrowLeft size={24} /></button>
                <h1 className="text-lg font-bold">预约师傅</h1>
            </div>

            <div className="p-4 space-y-4 pb-32">
                {/* Master Card */}
                <div className={`p-4 rounded-2xl shadow-sm border flex items-center space-x-4 relative overflow-hidden ${cardBgClass}`}>
                    {/* Background Decoration for Party Member */}
                    {isPartyMember && <div className="absolute top-0 right-0 opacity-10"><img src="/assets/party_logo.png" className="w-24 h-24 -mr-4 -mt-4 opacity-50 grayscale-0" alt="" onError={(e) => e.currentTarget.style.display = 'none'} /></div>}

                    <div className="relative z-10">
                        <div className={`p-0.5 rounded-full border-2 ${avatarBorderClass}`}>
                            <img src={elec.avatar} className="w-16 h-16 rounded-full bg-gray-100 object-cover" alt="avatar" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${isPartyMember ? 'bg-red-500' : 'bg-green-500'}`}>
                            {isPartyMember ? <Star size={10} className="text-yellow-300 fill-current" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                    </div>
                    <div className="z-10">
                        <div className="flex items-center space-x-2">
                            <h2 className={`font-black text-xl ${isPartyMember ? 'text-red-900' : 'text-gray-900'}`}>{elec.name}</h2>
                            {isPartyMember && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm flex items-center"><Star size={8} className="mr-0.5 fill-current text-yellow-300" />党员</span>}
                            {isVerified && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">平台认证</span>}
                        </div>
                        <div className="flex items-center space-x-2 text-xs mt-1.5">
                            <span className="text-orange-500 font-bold flex items-center text-sm"><Star size={12} className="fill-current mr-0.5" /> {elec.rating}</span>
                            <span className="text-gray-300">|</span>
                            {isPartyMember ? <span className="text-red-800/70 font-medium">先锋模范 · 服务标兵</span> : <span className="text-gray-500">实名认证 · 技能考核</span>}
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
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500"><MapPin size={18} /></div>
                            <span className="font-bold text-gray-700 text-sm truncate max-w-[180px]">{selectedLocation.address}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>

                    <div onClick={() => setShowTimePicker(true)} className="flex justify-between items-center py-2 border-b border-gray-50 cursor-pointer active:opacity-70">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500"><Clock size={18} /></div>
                            <span className="font-bold text-gray-700 text-sm">{selectedTime}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
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

            {showTimePicker && <TimeSelector onClose={() => setShowTimePicker(false)} onSelect={(t) => { setSelectedTime(t); setShowTimePicker(false); }} />}
            {showAddressPicker && <AddressSelector onClose={() => setShowAddressPicker(false)} onSelect={(loc) => { setSelectedLocation(loc); setShowAddressPicker(false); }} />}
        </div>
    );
}
