
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Power, MapPin } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';

export const WorkStatusToggle = () => {
    const [isOnline, setIsOnline] = useState(true);
    return (
        <div className="flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm">
            <button 
                onClick={() => setIsOnline(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isOnline ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500'}`}
            >
                听单中
            </button>
            <button 
                onClick={() => setIsOnline(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isOnline ? 'bg-gray-500 text-white shadow-sm' : 'text-gray-500'}`}
            >
                休息中
            </button>
        </div>
    )
}

export const TaskHall = () => {
  const { orders, currentUser, updateOrder } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'Recommend' | 'Distance' | 'Price'>('Recommend');
  
  const mockExtraOrders: Order[] = [
      {
          id: 'mock-e1', type: 'Install', title: '写字楼排线改造', description: '企业订单：100平米办公室网络布线',
          images: [], location: { lat: 31.2, lng: 121.5, address: '浦东软件园 3号楼' },
          status: OrderStatus.PENDING, createdAt: Date.now() - 5000, scheduledTime: '明天 09:00',
          priceEstimate: { min: 1200, max: 1500 }, clientId: 'c1', clientName: '科技公司', timeline: []
      },
      {
          id: 'mock-e2', type: 'Repair', title: '商铺跳闸急修', description: '餐饮店后厨总闸跳闸，影响营业',
          images: [], location: { lat: 31.21, lng: 121.48, address: '淮海中路 888号' },
          status: OrderStatus.PENDING, createdAt: Date.now() - 2000, scheduledTime: '尽快',
          priceEstimate: { min: 200, max: 400 }, clientId: 'c2', clientName: '餐饮店主', timeline: []
      }
  ];

  const allOrders = [...orders.filter(o => o.status === OrderStatus.PENDING), ...mockExtraOrders];

  const sortedOrders = [...allOrders].sort((a, b) => {
      if (filter === 'Price') return b.priceEstimate.min - a.priceEstimate.min;
      return 0;
  });

  const handleGrab = (id: string) => {
    const isMock = id.startsWith('mock');
    if (isMock) {
        alert("演示订单，模拟抢单成功");
        return;
    }

    updateOrder(id, { 
      status: OrderStatus.ACCEPTED, 
      electricianId: currentUser?.id,
      electricianName: currentUser?.name 
    });
    setTimeout(() => navigate(`/electrician/task/${id}`), 100);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
      {/* Top Bar */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold text-gray-800">任务大厅</h1>
            <WorkStatusToggle />
          </div>
          {/* Filter Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
              {['Recommend', 'Distance', 'Price'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                      {f === 'Recommend' ? '综合推荐' : (f === 'Distance' ? '距离最近' : '金额最高')}
                  </button>
              ))}
          </div>
      </div>
      
      <div className="p-4 space-y-4">
        {sortedOrders.length === 0 && (
            <div className="text-center mt-20 opacity-50">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Power size={40} className="text-gray-400"/>
                </div>
                <p className="text-gray-500">暂时没有新订单</p>
            </div>
        )}

        {sortedOrders.map(order => (
          <div key={order.id} className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden transition-all active:scale-[0.99] group">
            {/* Urgent / Corporate Tag */}
            {order.description.includes('企业') && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-bl-lg z-10 font-bold">
                    企业订单
                </div>
            )}
            
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${order.type === 'Repair' ? 'bg-red-500' : (order.type === 'Install' ? 'bg-blue-500' : 'bg-indigo-500')}`}>
                                {order.type === 'Repair' ? '急修' : (order.type === 'Install' ? '安装' : '工程')}
                            </span>
                            <h3 className="font-bold text-gray-800 text-lg">{order.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center">
                            <Clock size={12} className="mr-1"/> {order.scheduledTime}
                        </p>
                    </div>
                    <div className="text-right pt-2">
                         <p className="text-2xl font-extrabold text-red-600"><span className="text-sm font-medium text-gray-500">¥</span>{order.priceEstimate.min}</p>
                    </div>
                </div>
                
                <div className="flex items-start space-x-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 font-medium block truncate">{order.location.address}</span>
                        <div className="flex items-center mt-1 space-x-2">
                             <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 rounded">1.2km</span>
                             <span className="text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 rounded">电梯房</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => handleGrab(order.id)}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 group-active:scale-[0.98] transition-all flex justify-center items-center hover:bg-blue-700"
                >
                    立即抢单
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
