
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Clock, Phone, Navigation, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';

type TaskTab = 'Pending' | 'InProgress' | 'Confirm' | 'Completed';

export const MyTasks = () => {
  const { orders, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TaskTab>('Pending');

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

  const realOngoing = orders.filter(o => o.electricianId === currentUser?.id && o.status !== OrderStatus.PENDING);
  const ongoingOrders = realOngoing.length > 0 ? realOngoing : [mockOngoingOrder];

  const getOrdersByStatus = (status: TaskTab): Order[] => {
    switch(status) {
      case 'Pending':
        return ongoingOrders.filter(o => o.status === OrderStatus.ACCEPTED);
      case 'InProgress':
        return ongoingOrders.filter(o => o.status === OrderStatus.ARRIVED || o.status === OrderStatus.IN_PROGRESS);
      case 'Confirm':
        return ongoingOrders.filter(o => o.status === OrderStatus.COMPLETED);
      case 'Completed':
        return mockHistoryOrders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.PAID);
      default:
        return [];
    }
  };

  const displayOrders = getOrdersByStatus(activeTab);

  const tabConfig: { key: TaskTab; label: string; icon: React.ReactNode }[] = [
    { key: 'Pending', label: '待服务', icon: <Clock size={14} /> },
    { key: 'InProgress', label: '服务中', icon: <AlertCircle size={14} /> },
    { key: 'Confirm', label: '待确认', icon: <CheckCircle size={14} /> },
    { key: 'Completed', label: '已完成', icon: <Briefcase size={14} /> },
  ];

  const getTabCount = (tab: TaskTab) => getOrdersByStatus(tab).length;

  const getStatusDisplay = (order: Order) => {
    switch(order.status) {
      case OrderStatus.ACCEPTED:
        return { label: '待服务', color: 'bg-amber-100 text-amber-700', text: '等待上门' };
      case OrderStatus.ARRIVED:
        return { label: '服务中', color: 'bg-blue-100 text-blue-700', text: '已到达现场' };
      case OrderStatus.IN_PROGRESS:
        return { label: '服务中', color: 'bg-orange-100 text-orange-700', text: '施工中' };
      case OrderStatus.COMPLETED:
        return { label: '待确认', color: 'bg-purple-100 text-purple-700', text: '待用户支付' };
      case OrderStatus.PAID:
        return { label: '已完成', color: 'bg-green-100 text-green-700', text: '已结算' };
      case OrderStatus.CANCELLED:
        return { label: '已取消', color: 'bg-red-50 text-red-500', text: '已取消' };
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-500', text: '' };
    }
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.open(`tel:${phone}`);
  };

  const handleNavigate = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    window.open(`https://maps.google.com?q=${encodeURIComponent(address)}`);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
       <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
            <div className="p-4 text-center">
                <h1 className="text-lg font-bold text-gray-800">我的任务</h1>
                <p className="text-xs text-gray-400 mt-1">任务管理与执行工作台</p>
            </div>
            <div className="flex px-2 pb-3 gap-1">
                {tabConfig.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {getTabCount(tab.key) > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {getTabCount(tab.key)}
                            </span>
                        )}
                    </button>
                ))}
            </div>
       </div>

      <div className="p-4 space-y-3">
        {displayOrders.length === 0 && (
            <div className="text-center mt-20 opacity-50 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={32} className="text-gray-300"/>
                </div>
                <p className="text-gray-400 text-sm">暂无{tabConfig.find(t => t.key === activeTab)?.label}任务</p>
                {activeTab === 'Pending' && <button onClick={() => navigate('/electrician/hall')} className="mt-4 text-blue-600 text-sm font-bold">去大厅接单</button>}
            </div>
        )}

        {displayOrders.map(order => {
          const statusInfo = getStatusDisplay(order);
          return (
           <div
             key={order.id}
             onClick={() => navigate(order.id.startsWith('demo') || order.id.startsWith('h') ? '#' : `/electrician/task/${order.id}`)}
             className={`bg-white p-4 rounded-2xl shadow-sm border active:bg-gray-50 transition-colors cursor-pointer group ${
               order.type === 'Repair' ? 'border-red-100 ring-1 ring-red-50' : 'border-gray-100'
             }`}
           >
             <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      order.type === 'Repair' ? 'bg-red-500' : (order.type === 'Install' ? 'bg-blue-500' : 'bg-green-500')
                    }`}>
                        {order.type === 'Repair' ? '急修' : (order.type === 'Install' ? '安装' : '检测')}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{order.id}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusInfo.color}`}>
                    {statusInfo.label}
                </span>
             </div>

             <h3 className="font-bold text-gray-800 mb-2">{order.title}</h3>

             <div className="text-sm text-gray-600 mb-3 flex items-start">
                 <MapPin size={14} className="mr-1.5 mt-1 shrink-0 text-gray-400"/>
                 <span className="line-clamp-1 font-medium">{order.location.address}</span>
             </div>

             <div className="flex items-center text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
                 <User size={12} className="mr-1.5"/> {order.clientName}
                 <span className="mx-2 text-gray-200">|</span>
                 <Clock size={12} className="mr-1"/> {order.scheduledTime}
             </div>

             <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <span className="text-sm font-bold text-gray-800">
                  ¥{order.priceEstimate.final || order.priceEstimate.min}
                  {order.priceEstimate.final && <span className="text-xs text-gray-400 ml-1">已结算</span>}
                </span>

                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                    <div className="flex space-x-1.5">
                         <button
                           className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 active:scale-95 transition-all"
                           onClick={(e) => handleCall(e, '13800000000')}
                         >
                             <Phone size={14}/>
                         </button>
                         <button
                           className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 active:scale-95 transition-all"
                           onClick={(e) => handleNavigate(e, order.location.address)}
                         >
                             <Navigation size={14}/>
                         </button>
                    </div>
                </div>
             </div>
           </div>
          );
        })}
      </div>
    </div>
  );
};
