
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, MapPin } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const UserAddresses = () => {
    const navigate = useNavigate();
    const { addresses, updateUserLocation, deleteAddress } = useApp();

    const handleSelectAddress = (addr: any) => {
        // 使用明确的、有效的经纬度数值，防止 NaN 产生
        updateUserLocation({
            lat: 31.1940, 
            lng: 121.4360,
            address: addr.address + (addr.detail ? ' ' + addr.detail : '')
        });
        navigate('/user/home');
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        navigate(`/user/address-edit/${id}`);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('确定要删除这个地址吗？')) {
            deleteAddress(id);
        }
    };

    return (
        <div className="h-full bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-50 shrink-0">
                <button 
                    onClick={() => navigate('/user/profile')} 
                    className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-all"
                >
                    <ArrowLeft size={24} className="text-gray-800"/>
                </button>
                <h1 className="text-lg font-bold text-gray-800">我的地址</h1>
                <button 
                    onClick={() => navigate('/user/address-add')} 
                    className="text-gray-800 text-sm font-bold px-2 py-1 active:opacity-60"
                >
                    新增地址
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-32 opacity-30 grayscale text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <MapPin size={40} className="text-gray-300" />
                        </div>
                        <p className="font-bold text-gray-400">暂无地址信息</p>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div 
                            key={addr.id} 
                            className="p-4 border-b border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors"
                            onClick={() => handleSelectAddress(addr)}
                        >
                            <div className="flex-1 pr-4 min-w-0">
                                <div className="flex items-start mb-1.5">
                                    {addr.tag && (
                                        <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded mr-2 font-bold mt-0.5 ${
                                            addr.tag === '公司' ? 'bg-blue-50 text-blue-500' : 
                                            addr.tag === '学校' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                                        }`}>
                                            {addr.tag}
                                        </span>
                                    )}
                                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug break-words">
                                        {addr.address} {addr.detail}
                                    </h3>
                                </div>
                                <div className="flex items-center text-[13px] text-gray-400 space-x-2 font-medium">
                                    <span>{addr.name} {addr.gender}</span>
                                    <span className="font-mono">{addr.phone}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 shrink-0">
                                <button 
                                    onClick={(e) => handleEdit(e, addr.id)} 
                                    className="p-3 text-gray-300 active:text-gray-600 transition-colors"
                                >
                                    <Edit2 size={20} strokeWidth={1.2} />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, addr.id)} 
                                    className="p-3 text-gray-300 active:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} strokeWidth={1.2} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
