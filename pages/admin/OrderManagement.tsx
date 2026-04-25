
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, ChevronLeft, X, MapPin, Phone, User, Shield, Clock, CheckCircle, AlertCircle, Ban, ArrowUpDown, MoreVertical } from 'lucide-react';

type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
type ServiceType = 'repair' | 'install' | 'inspection';
type SortField = 'createTime' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

interface OrderItem {
  id: string;
  orderId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  userName: string;
  userPhone: string;
  electricianName?: string;
  electricianPhone?: string;
  address: string;
  amount: number;
  status: OrderStatus;
  createTime: string;
  scheduledTime: string;
}

export const OrderManagement = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ServiceType>('all');
  const [sortField, setSortField] = useState<SortField>('createTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'O001', orderId: 'ANDT-2026-0420-1001', serviceType: 'repair', title: '电路跳闸维修', description: '全屋跳闸，无法合闸', userName: '张三', userPhone: '138****1234', electricianName: '李师傅', electricianPhone: '139****5678', address: '浦东新区浦电路57号', amount: 120, status: 'completed', createTime: '2026-04-20 10:30', scheduledTime: '尽快' },
    { id: 'O002', orderId: 'ANDT-2026-0420-1002', serviceType: 'install', title: '开关安装服务', description: '客厅开关更换', userName: '王五', userPhone: '137****9012', electricianName: '周师傅', electricianPhone: '133****6789', address: '黄浦区淮海中路888号', amount: 85, status: 'in_progress', createTime: '2026-04-20 09:15', scheduledTime: '今天 14:00' },
    { id: 'O003', orderId: 'ANDT-2026-0420-1003', serviceType: 'inspection', title: '电路安全检测', description: '老房电路检测', userName: '钱总', userPhone: '135****7890', address: '徐汇区建国西路256号', amount: 150, status: 'pending', createTime: '2026-04-20 08:45', scheduledTime: '明天 10:00' },
    { id: 'O004', orderId: 'ANDT-2026-0419-0956', serviceType: 'repair', title: '插座更换', description: '厨房插座进水', userName: '赵先生', userPhone: '136****3456', electricianName: '李师傅', electricianPhone: '139****5678', address: '静安区胶州路11弄', amount: 60, status: 'completed', createTime: '2026-04-19 16:20', scheduledTime: '昨天' },
    { id: 'O005', orderId: 'ANDT-2026-0419-0957', serviceType: 'install', title: '灯具安装', description: '卧室吊灯安装', userName: '孙女士', userPhone: '132****0123', address: '长宁区中山公园5号', amount: 200, status: 'cancelled', createTime: '2026-04-19 14:00', scheduledTime: '取消' },
    { id: 'O006', orderId: 'ANDT-2026-0418-0891', serviceType: 'repair', title: '电线短路维修', description: '线路老化短路', userName: '周先生', userPhone: '131****4567', electricianName: '张师傅', electricianPhone: '138****9876', address: '普陀区长寿路100号', amount: 180, status: 'accepted', createTime: '2026-04-18 11:30', scheduledTime: '今天 16:00' },
    { id: 'O007', orderId: 'ANDT-2026-0418-0892', serviceType: 'inspection', title: '全屋电路检查', description: '新房验收检测', userName: '吴女士', userPhone: '130****7890', address: '虹口区四川北路200号', amount: 299, status: 'pending', createTime: '2026-04-18 09:00', scheduledTime: '后天 09:00' },
  ]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return { label: '待接单', color: 'bg-amber-100 text-amber-700', icon: Clock, bgColor: 'bg-amber-50' };
      case 'accepted': return { label: '已接单', color: 'bg-blue-100 text-blue-700', icon: CheckCircle, bgColor: 'bg-blue-50' };
      case 'in_progress': return { label: '服务中', color: 'bg-purple-100 text-purple-700', icon: AlertCircle, bgColor: 'bg-purple-50' };
      case 'completed': return { label: '已完成', color: 'bg-green-100 text-green-700', icon: CheckCircle, bgColor: 'bg-green-50' };
      case 'cancelled': return { label: '已取消', color: 'bg-red-50 text-red-500', icon: Ban, bgColor: 'bg-red-50' };
    }
  };

  const getTypeInfo = (type: ServiceType) => {
    switch(type) {
      case 'repair': return { label: '急修', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-600' };
      case 'install': return { label: '安装', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'inspection': return { label: '检测', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-600' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = searchKeyword === '' ||
      order.orderId.includes(searchKeyword) ||
      order.title.includes(searchKeyword) ||
      order.userName.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchType = typeFilter === 'all' || order.serviceType === typeFilter;
    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'createTime':
        comparison = new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleCancelOrder = (order: OrderItem) => {
    setLoading(true);
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled' as OrderStatus } : o));
      showToast('订单已取消', 'success');
      setLoading(false);
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...order, status: 'cancelled' });
      }
    }, 500);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchKeyword('');
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchKeyword !== '';

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress' || o.status === 'accepted').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">订单管理</h1>
            <p className="text-xs text-gray-400">共 {filteredOrders.length} 个订单</p>
          </div>
          <button 
            onClick={() => setShowFilterPanel(true)}
            className={`p-2 rounded-xl ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            全部 {stats.total}
          </button>
          <button 
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              statusFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'
            }`}
          >
            待接单 {stats.pending}
          </button>
          <button 
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              statusFilter === 'in_progress' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600'
            }`}
          >
            进行中 {stats.inProgress}
          </button>
          <button 
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600'
            }`}
          >
            已完成 {stats.completed}
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索订单号、服务内容..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-blue-400"
            />
            {searchKeyword && (
              <button 
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order List - Scrollable */}
      <div 
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <div className="p-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">未找到符合条件的订单</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 text-sm font-bold">
                清除筛选条件
              </button>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              const typeInfo = getTypeInfo(order.serviceType);
              const StatusIcon = statusInfo.icon;

              return (
                <div 
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">{order.orderId}</span>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusInfo.color}`}>
                      <StatusIcon size={10} />
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2">{order.title}</h3>

                  <div className="flex items-start gap-2 mb-3">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 line-clamp-1">{order.address}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={10} /> {order.userName}
                    </span>
                    {order.electricianName && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Shield size={10} /> {order.electricianName}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{order.createTime}</span>
                    <span className="text-lg font-bold text-red-600">¥{order.amount}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilterPanel(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">筛选条件</h2>
              <button onClick={() => setShowFilterPanel(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">服务类型</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'repair', label: '急修', color: 'red' },
                    { value: 'install', label: '安装', color: 'blue' },
                    { value: 'inspection', label: '检测', color: 'green' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTypeFilter(option.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        typeFilter === option.value
                          ? `bg-${option.color}-100 text-${option.color}-600 border-2 border-${option.color}-200`
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">订单状态</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'pending', label: '待接单', color: 'amber' },
                    { value: 'accepted', label: '已接单', color: 'blue' },
                    { value: 'in_progress', label: '服务中', color: 'purple' },
                    { value: 'completed', label: '已完成', color: 'green' },
                    { value: 'cancelled', label: '已取消', color: 'red' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        statusFilter === option.value
                          ? `bg-${option.color}-100 text-${option.color}-600 border-2 border-${option.color}-200`
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">排序方式</h3>
                <div className="space-y-2">
                  {[
                    { field: 'createTime', label: '创建时间' },
                    { field: 'amount', label: '订单金额' },
                    { field: 'status', label: '订单状态' },
                  ].map(option => (
                    <button
                      key={option.field}
                      onClick={() => handleSort(option.field as SortField)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        sortField === option.field
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      {sortField === option.field && (
                        <ArrowUpDown size={16} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm"
              >
                确定 ({filteredOrders.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">订单详情</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Order Header */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getTypeInfo(selectedOrder.serviceType).color}`}>
                        {getTypeInfo(selectedOrder.serviceType).label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{selectedOrder.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">¥{selectedOrder.amount}</p>
                    <p className="text-xs text-gray-400">订单金额</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded inline-block">{selectedOrder.orderId}</p>
              </div>

              {/* Description */}
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-sm text-amber-800">{selectedOrder.description}</p>
              </div>

              {/* Info List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">服务地址</p>
                    <p className="font-medium text-gray-800">{selectedOrder.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <User size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">用户信息</p>
                    <p className="font-medium text-gray-800">{selectedOrder.userName} {selectedOrder.userPhone}</p>
                  </div>
                </div>

                {selectedOrder.electricianName && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <Shield size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">电工信息</p>
                      <p className="font-medium text-gray-800">{selectedOrder.electricianName} {selectedOrder.electricianPhone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">预约时间</p>
                    <p className="font-medium text-gray-800">{selectedOrder.scheduledTime}</p>
                    <p className="text-xs text-gray-400 mt-1">创建: {selectedOrder.createTime}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder);
                      setShowDetailModal(false);
                    }}
                    disabled={loading}
                    className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Ban size={18} /> 取消订单
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
