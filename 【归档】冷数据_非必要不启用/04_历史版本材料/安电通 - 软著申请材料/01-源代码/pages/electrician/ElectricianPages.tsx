
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle, MapPin, Navigation, Clock, FileText, Camera, Shield, Power, User, Briefcase, Wallet, TrendingUp, Building, AlertCircle, ChevronRight, Award, Plus, Sliders, Target, Save, Settings, Lock, Bell, Trash2, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, UserRole } from '../../types';

// --- Sub Components ---
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

// --- Pages ---
export const TaskDetail = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const { orders, updateOrder } = useApp();
    
    const allOrders = [...orders]; 
    const order = allOrders.find(o => o.id === id);
    const [loading, setLoading] = useState(false);

    if (!order) return (
        <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center">
            <FileText size={48} className="text-gray-300 mb-4"/>
            <p className="text-gray-500">订单详情加载中或不存在...</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold">返回上一页</button>
        </div>
    );

    const steps = [
        { status: OrderStatus.ACCEPTED, label: '已接单' },
        { status: OrderStatus.ARRIVED, label: '已上门' },
        { status: OrderStatus.IN_PROGRESS, label: '施工中' },
        { status: OrderStatus.COMPLETED, label: '待支付' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);
    
    const handleNextStep = () => {
        setLoading(true);
        setTimeout(() => {
            let nextStatus = order.status;
            if (order.status === OrderStatus.ACCEPTED) nextStatus = OrderStatus.ARRIVED;
            else if (order.status === OrderStatus.ARRIVED) nextStatus = OrderStatus.IN_PROGRESS;
            else if (order.status === OrderStatus.IN_PROGRESS) nextStatus = OrderStatus.COMPLETED;

            updateOrder(order.id, { status: nextStatus });
            setLoading(false);
            if (nextStatus === OrderStatus.COMPLETED) {
                navigate(-1);
            }
        }, 800);
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24 relative z-50">
            {/* Header */}
            <div className="bg-blue-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-md">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20}/></button>
                <span className="font-bold text-lg">订单详情</span>
                <button onClick={() => window.open('tel:13800000000')} className="p-2 hover:bg-white/10 rounded-full"><Phone size={20}/></button>
            </div>

            {/* Status Bar */}
            <div className="bg-white p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center relative">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        return (
                            <div key={step.status} className="flex flex-col items-center bg-white px-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {isCompleted ? <CheckCircle size={14}/> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Client Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{order.type === 'Repair' ? '电路急修' : order.title}</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1"/> {order.scheduledTime}
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">¥{order.priceEstimate.min}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="mt-1"><MapPin size={18} className="text-blue-600"/></div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm mb-1">{order.location.address}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{order.clientName} (已实名)</p>
                                <button onClick={() => alert("已为您规划最优路线")} className="bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded text-xs font-bold flex items-center shadow-sm active:bg-blue-50">
                                    <Navigation size={12} className="mr-1"/> 导航
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center"><FileText size={16} className="mr-2 text-gray-400"/> 故障描述</h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">{order.description || '用户未填写详细描述，请上门后核实。'}</p>
                    
                    {/* Photo Upload Mock */}
                    <div className="mt-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">现场留底 (施工前/后)</p>
                        <div className="flex gap-3">
                            <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-gray-100 cursor-pointer">
                                <Camera size={20}/>
                                <span className="text-[10px] mt-1">拍照</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start text-sm text-orange-800">
                    <Shield size={16} className="mr-2 mt-0.5 shrink-0"/>
                    <p>作业时请务必切断电源，规范佩戴绝缘手套。遇到高危情况请立即报备平台。</p>
                </div>
            </div>

            {/* Fixed Bottom Action */}
            {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.PAID && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 safe-area-bottom">
                    <button 
                        onClick={handleNextStep} 
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform flex justify-center items-center disabled:opacity-70"
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {order.status === OrderStatus.ACCEPTED ? '我已到达现场' : (
                            order.status === OrderStatus.ARRIVED ? '开始施工' : '完工录入费用'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

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

export const Income = () => {
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => {
            setWithdrawing(false);
            alert("提现申请已提交！");
        }, 1500);
    };

    // Simple CSS Bar Chart
    const ChartBar = ({ height, label, active }: {height: string, label: string, active?: boolean}) => (
        <div className="flex flex-col items-center group">
            <div className="relative h-24 w-3 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className={`w-full rounded-t-full transition-all duration-500 ${active ? 'bg-blue-600' : 'bg-blue-300'}`} style={{ height }}></div>
            </div>
            <span className={`text-[10px] mt-2 ${active ? 'font-bold text-blue-600' : 'text-gray-400'}`}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24">
             <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white px-6 pt-10 pb-24 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
                 <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
                 <div className="absolute -left-10 bottom-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="opacity-80 mb-1 text-sm font-medium flex items-center"><Wallet size={14} className="mr-1"/> 账户余额 (元)</p>
                        <h1 className="text-5xl font-bold tracking-tight">1,250.00</h1>
                    </div>
                    <button 
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold active:bg-white/30 transition-colors disabled:opacity-50"
                    >
                        {withdrawing ? '处理中...' : '提现'}
                    </button>
                 </div>
            </div>

            <div className="-mt-12 mx-4 bg-white rounded-2xl shadow-lg p-6 z-10 relative border border-gray-50">
                <div className="flex justify-around text-center mb-6">
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">今日收入</p>
                        <p className="font-bold text-xl text-green-600">+120</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">本周收入</p>
                        <p className="font-bold text-xl text-gray-800">450</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-medium">待结算</p>
                        <p className="font-bold text-xl text-orange-500">80</p>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-gray-500">近7日收入趋势</h3>
                        <div className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <TrendingUp size={10} className="mr-1"/> +12%
                        </div>
                    </div>
                    <div className="flex justify-between items-end h-32 px-2">
                        <ChartBar height="30%" label="一" />
                        <ChartBar height="45%" label="二" />
                        <ChartBar height="25%" label="三" />
                        <ChartBar height="60%" label="四" />
                        <ChartBar height="80%" label="五" />
                        <ChartBar height="40%" label="六" />
                        <ChartBar height="90%" label="日" active />
                    </div>
                </div>
            </div>

            <div className="p-5 mt-2">
                <h3 className="font-bold text-gray-800 mb-3 text-lg">流水明细</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 font-bold">收</div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">上门维修服务</p>
                                    <p className="text-xs text-gray-400">今日 10:00 • 订单完成</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-800 text-lg">+80.00</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ElecSkills = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([
        { id: 1, name: '电路检修', selected: true },
        { id: 2, name: '灯具安装', selected: true },
        { id: 3, name: '开关插座', selected: true },
        { id: 4, name: '弱电布线', selected: true },
        { id: 5, name: '智能家居', selected: false },
        { id: 6, name: '监控安装', selected: false },
    ]);

    const toggleSkill = (id: number) => {
        setSkills(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
    };

    return (
        <div className="min-h-full pb-10">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">技能与证书</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Certification Status */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
                    <div>
                        <h2 className="font-bold text-lg flex items-center"><Award size={20} className="mr-2"/> 已认证：高级电工</h2>
                        <p className="text-xs opacity-90 mt-1">证书编号：1234****5678</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle size={24}/>
                    </div>
                </div>

                {/* Skills Grid */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">接单技能 (可多选)</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {skills.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => toggleSkill(s.id)}
                                className={`py-3 rounded-xl text-sm font-bold border transition-all ${s.selected ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Certificates */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">证书管理</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[4/3] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=150&fit=crop" className="w-full h-full object-cover rounded-2xl opacity-80" alt="Cert"/>
                        </div>
                         <button className="aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-all">
                            <Plus size={24} className="mb-2"/>
                            <span className="text-xs">上传新证书</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t safe-area-bottom">
                <button onClick={() => navigate(-1)} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                    保存修改
                </button>
            </div>
        </div>
    );
}

export const ElecServiceArea = () => {
    const navigate = useNavigate();
    const [radius, setRadius] = useState(5);

    return (
        <div className="min-h-full pb-10">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">服务区域设置</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Map Preview Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-2xl relative overflow-hidden border border-gray-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-32 h-32 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center animate-pulse">
                             <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                         </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                        上海市 · 静安区
                    </div>
                </div>

                {/* Radius Slider */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center"><Target size={18} className="mr-2 text-blue-600"/> 服务半径</h3>
                        <span className="text-blue-600 font-bold text-lg">{radius} km</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        step="1"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1km</span>
                        <span>10km</span>
                        <span>20km</span>
                    </div>
                </div>

                {/* District Settings */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Sliders size={18} className="mr-2 text-gray-400"/> 偏好区域</h3>
                     <div className="flex flex-wrap gap-2">
                         {['黄浦区', '静安区', '徐汇区', '长宁区', '浦东新区'].map(area => (
                             <button key={area} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-colors">
                                 {area}
                             </button>
                         ))}
                         <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-lg text-sm flex items-center">
                             <Plus size={14} className="mr-1"/> 添加
                         </button>
                     </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t safe-area-bottom">
                <button onClick={() => navigate(-1)} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center">
                    <Save size={18} className="mr-2"/> 保存设置
                </button>
            </div>
        </div>
    );
}

export const ElecSettings = () => {
    const navigate = useNavigate();
    const { logout } = useApp();

    return (
        <div className="min-h-full bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">设置</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Account Security */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Shield size={18} className="text-blue-600"/>
                         <span className="font-bold text-sm text-gray-800">账号安全</span>
                    </div>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">修改登录密码</span>
                        <ChevronRight size={16} className="text-gray-300"/>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">更换绑定手机</span>
                        <span className="text-xs text-gray-400 flex items-center">139****9000 <ChevronRight size={14}/></span>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">实名认证</span>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded flex items-center">已认证 <CheckCircle size={10} className="ml-1"/></span>
                    </button>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Bell size={18} className="text-orange-500"/>
                         <span className="font-bold text-sm text-gray-800">消息通知</span>
                    </div>
                     <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-700">新订单推送</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center border-t border-gray-50">
                        <span className="text-sm text-gray-700">系统公告</span>
                        <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* General */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Settings size={18} className="text-gray-500"/>
                         <span className="font-bold text-sm text-gray-800">通用</span>
                    </div>
                    <button onClick={() => alert("缓存已清除")} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">清除缓存</span>
                        <span className="text-xs text-gray-400">24.5MB</span>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">关于安电通</span>
                        <span className="text-xs text-gray-400">v1.0.0</span>
                    </button>
                </div>

                <button 
                    onClick={() => {logout(); navigate('/');}}
                    className="w-full py-3.5 bg-white text-red-500 text-sm font-bold rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"
                >
                    退出登录
                </button>
            </div>
        </div>
    );
};

export const ElecProfile = () => {
    const { currentUser, switchRole } = useApp();
    const navigate = useNavigate();

    const MenuItem = ({ icon: Icon, color, label, onClick, subText }: any) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={18} className={color.replace('bg-', 'text-')}/>
                </div>
                <span className="text-sm font-bold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center text-gray-400">
                {subText && <span className="text-xs mr-2">{subText}</span>}
                <ChevronRight size={16} className="group-hover:text-gray-600"/>
            </div>
        </button>
    );

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24">
            <div className="bg-gradient-to-br from-blue-800 to-gray-900 text-white px-6 pt-12 pb-20 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                {/* Settings Icon - Top Right */}
                <div className="absolute top-6 right-6 z-20">
                     <button onClick={() => navigate('/electrician/settings')} className="p-2.5 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10 active:scale-95">
                        <Settings size={20} className="text-white opacity-90"/>
                     </button>
                </div>

                <div className="flex items-center space-x-5 relative z-10 mt-4">
                    <div className="relative">
                        <img src={currentUser?.avatar} className="w-20 h-20 rounded-full border-4 border-white/20 bg-gray-800 object-cover" alt="Avatar"/>
                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                        <div className="flex items-center mt-1 space-x-2">
                             <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs rounded font-medium flex items-center">
                                 <Award size={10} className="mr-1"/> 金牌电工
                             </span>
                             <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded font-medium">工龄 5年</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-8 relative z-10 px-2">
                    <div className="text-center">
                        <p className="text-2xl font-bold">4.9</p>
                        <p className="text-xs text-gray-400 mt-0.5">服务评分</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">582</p>
                        <p className="text-xs text-gray-400 mt-0.5">完成单量</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">0%</p>
                        <p className="text-xs text-gray-400 mt-0.5">好评率</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-10 relative z-10 space-y-4">
                {/* Menu Group 1 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <MenuItem 
                        icon={Award} 
                        color="text-blue-600 bg-blue-600" 
                        label="技能与证书" 
                        subText="已认证"
                        onClick={() => navigate('/electrician/skills')}
                    />
                    <MenuItem 
                        icon={Target} 
                        color="text-green-600 bg-green-600" 
                        label="服务区域设置" 
                        subText="5km"
                        onClick={() => navigate('/electrician/area')}
                    />
                     <MenuItem 
                        icon={TrendingUp} 
                        color="text-orange-600 bg-orange-600" 
                        label="接单数据统计" 
                        onClick={() => {}}
                    />
                </div>

                {/* Menu Group 2 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <MenuItem 
                        icon={User} 
                        color="text-purple-600 bg-purple-600" 
                        label="切换到业主版" 
                        onClick={() => {switchRole(UserRole.USER); navigate('/user/home');}}
                    />
                     <MenuItem 
                        icon={Settings} 
                        color="text-gray-600 bg-gray-600" 
                        label="更多设置" 
                        onClick={() => navigate('/electrician/settings')}
                    />
                </div>
            </div>
        </div>
    );
};
