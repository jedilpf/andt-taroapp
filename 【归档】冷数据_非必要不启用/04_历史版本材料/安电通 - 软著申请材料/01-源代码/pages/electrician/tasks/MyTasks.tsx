
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Clock, Phone, Navigation, MapPin } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';

export const MyTasks = () => {
  const { orders, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Ongoing' | 'History'>('Ongoing');

  const mockHistoryOrders: Order[] = [
      {
          id: 'h1', type: 'Install', title: '吊灯安装', description: '客厅水晶灯安装，层高3米',
          images: [], location: { lat: 31.2, lng: 121.5, address: '黄浦区新天地 2号楼' },
          status: OrderStatus.COMPLETED, createdAt: Date.now() - 86400000 * 2, scheduledTime: '2天前',
          priceEstimate: { min: 150, max: 150, final: 150 }, clientId: 'c1', clientName: '赵先生', timeline: []
      },
      {
          id: 'h2', type: 'Checkup', title: '老房线路检测', description: '全屋线路老化排查',
          images: [], location: { lat: 31.2, lng: 121.5, address: '静安区胶州路 11弄' },
          status: OrderStatus.PAID, createdAt: Date.now() - 86400000 * 5, scheduledTime: '5天前',
          priceEstimate: { min: 299, max: 299, final: 299 }, clientId: 'c2', clientName: '钱女士', timeline: []
      },
       {
          id: 'h3', type: 'Repair', title: '浴室插座更换', description: '插座进水损坏',
          images: [], location: { lat: 31.2, lng: 121.5, address: '徐汇区天钥桥路' },
          status: OrderStatus.CANCELLED, createdAt: Date.now() - 86400000 * 10, scheduledTime: '10天前',
          priceEstimate: { min: 50, max: 50 }, clientId: 'c3', clientName: '孙先生', timeline: []
      }
  ];

  const mockOngoingOrder: Order = {
      id: 'demo-ongoing-1', type: 'Repair', title: '跳闸紧急处理', description: '全屋没电，无法合闸，急需上门',
      images: [], location: { lat: 31.2, lng: 121.5, address: '长宁区中山公园 5号' },
      status: OrderStatus.ACCEPTED, createdAt: Date.now(), scheduledTime: '尽快',
      priceEstimate: { min: 100, max: 200 }, clientId: 'c4', clientName: '周小姐', timeline: []
  };

  const realOngoing = orders.filter(o => o.electricianId === currentUser?.id && o.status !== OrderStatus.PENDING && o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.PAID && o.status !== OrderStatus.CANCELLED);
  
  const ongoingOrders = realOngoing.length > 0 ? realOngoing : [mockOngoingOrder];
  const historyOrders = mockHistoryOrders; 

  const displayOrders = activeTab === 'Ongoing' ? ongoingOrders : historyOrders;

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case OrderStatus.ACCEPTED: return 'bg-blue-100 text-blue-700';
          case OrderStatus.ARRIVED: return 'bg-purple-100 text-purple-700';
          case OrderStatus.IN_PROGRESS: return 'bg-orange-100 text-orange-700';
          case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
          case OrderStatus.PAID: return 'bg-gray-100 text-gray-600';
          case OrderStatus.CANCELLED: return 'bg-red-50 text-red-500';
          default: return 'bg-gray-100 text-gray-500';
      }
  };

  const getStatusLabel = (status: OrderStatus) => {
      switch(status) {
          case OrderStatus.ACCEPTED: return '赶往途中';
          case OrderStatus.ARRIVED: return '已上门';
          case OrderStatus.IN_PROGRESS: return '施工中';
          case OrderStatus.COMPLETED: return '待支付';
          case OrderStatus.PAID: return '已完成';
          case OrderStatus.CANCELLED: return '已取消';
          default: return '未知';
      }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
       <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
            <div className="p-4 text-center">
                <h1 className="text-lg font-bold">我的任务</h1>
            </div>
            <div className="flex px-4 pb-3 space-x-4">
                <button 
                    onClick={() => setActiveTab('Ongoing')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === 'Ongoing' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    进行中
                    {ongoingOrders.length > 0 && <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
                <button 
                    onClick={() => setActiveTab('History')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'History' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    历史订单
                </button>
            </div>
       </div>

      <div className="p-4 space-y-4">
        {displayOrders.length === 0 && (
            <div className="text-center mt-20 opacity-50 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={32} className="text-gray-300"/>
                </div>
                <p className="text-gray-400 text-sm">暂无{activeTab === 'Ongoing' ? '进行中' : '历史'}任务</p>
                {activeTab === 'Ongoing' && <button onClick={() => navigate('/electrician/hall')} className="mt-4 text-blue-600 text-sm font-bold">去大厅接单</button>}
            </div>
        )}

        {displayOrders.map(order => (
           <div key={order.id} onClick={() => navigate(order.id.startsWith('demo') || order.id.startsWith('h') ? '#' : `/electrician/task/${order.id}`)} className={`bg-white p-5 rounded-2xl shadow-sm border active:bg-gray-50 transition-colors cursor-pointer group ${order.type === 'Repair' && activeTab === 'Ongoing' ? 'border-red-100 ring-1 ring-red-50' : 'border-gray-100'}`}>
             <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${order.type === 'Repair' ? 'bg-red-500' : (order.type === 'Install' ? 'bg-blue-500' : 'bg-green-500')}`}>
                        {order.type === 'Repair' ? '急' : (order.type === 'Install' ? '装' : '检')}
                    </span>
                    <h3 className="font-bold text-gray-800 truncate max-w-[160px]">{order.title}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                </span>
             </div>
             
             <div className="text-sm text-gray-600 mb-3 flex items-start">
                 <MapPin size={14} className="mr-1.5 mt-1 shrink-0 text-gray-400"/>
                 <span className="line-clamp-1 font-medium">{order.location.address}</span>
             </div>

             <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                <div className="text-xs text-gray-400 flex items-center">
                    <User size={12} className="mr-1"/> {order.clientName}
                    {activeTab === 'Ongoing' && (
                        <>
                             <span className="mx-2 text-gray-200">|</span>
                             <span className="text-blue-600 font-medium flex items-center"><Clock size={10} className="mr-1"/> 尽快上门</span>
                        </>
                    )}
                </div>
                
                {activeTab === 'Ongoing' ? (
                    <div className="flex space-x-2">
                         <button className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100" onClick={(e) => {e.stopPropagation(); alert('拨打电话')}}>
                             <Phone size={14}/>
                         </button>
                         <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100" onClick={(e) => {e.stopPropagation(); alert('开始导航')}}>
                             <Navigation size={14}/>
                         </button>
                    </div>
                ) : (
                    <span className="font-bold text-gray-800">¥{order.priceEstimate.final || order.priceEstimate.min}</span>
                )}
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};
