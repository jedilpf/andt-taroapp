
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User, Shield, Eye, Ban, CheckCircle, ChevronLeft, X, Phone, Calendar, MoreVertical, ArrowUpDown } from 'lucide-react';

type UserRole = 'user' | 'electrician' | 'admin';
type UserStatus = 'active' | 'disabled';
type SortField = 'registerTime' | 'lastLogin' | 'username';
type SortOrder = 'asc' | 'desc';

interface UserItem {
  id: string;
  username: string;
  role: UserRole;
  phone: string;
  email?: string;
  registerTime: string;
  lastLogin?: string;
  status: UserStatus;
  orderCount: number;
}

export const UserManagement = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [sortField, setSortField] = useState<SortField>('registerTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [users, setUsers] = useState<UserItem[]>([
    { id: 'U001', username: '张三', role: 'user', phone: '138****1234', registerTime: '2026-01-15', lastLogin: '2026-04-20', status: 'active', orderCount: 12 },
    { id: 'U002', username: '李师傅', role: 'electrician', phone: '139****5678', registerTime: '2026-02-01', lastLogin: '2026-04-19', status: 'active', orderCount: 89 },
    { id: 'U003', username: '王五', role: 'user', phone: '137****9012', registerTime: '2026-02-20', lastLogin: '2026-04-18', status: 'active', orderCount: 5 },
    { id: 'U004', username: '赵工', role: 'electrician', phone: '136****3456', registerTime: '2026-03-05', lastLogin: '2026-04-17', status: 'disabled', orderCount: 45 },
    { id: 'U005', username: '钱总', role: 'user', phone: '135****7890', registerTime: '2026-03-10', lastLogin: '2026-04-15', status: 'active', orderCount: 23 },
    { id: 'U006', username: '孙管', role: 'admin', phone: '134****2345', registerTime: '2026-01-01', lastLogin: '2026-04-20', status: 'active', orderCount: 0 },
    { id: 'U007', username: '周师傅', role: 'electrician', phone: '133****6789', registerTime: '2026-03-15', lastLogin: '2026-04-14', status: 'active', orderCount: 67 },
    { id: 'U008', username: '吴女士', role: 'user', phone: '132****0123', registerTime: '2026-03-20', lastLogin: '2026-04-12', status: 'disabled', orderCount: 3 },
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

  const filteredUsers = users.filter(user => {
    const matchSearch = searchKeyword === '' ||
      user.username.includes(searchKeyword) ||
      user.phone.includes(searchKeyword) ||
      user.id.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'username':
        comparison = a.username.localeCompare(b.username);
        break;
      case 'registerTime':
        comparison = new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime();
        break;
      case 'lastLogin':
        const aTime = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bTime = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        comparison = aTime - bTime;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleToggleStatus = (user: UserItem) => {
    setLoading(true);
    setTimeout(() => {
      const newStatus = user.status === 'active' ? 'disabled' : 'active';
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      showToast(`${user.username} 已${newStatus === 'active' ? '启用' : '禁用'}`, 'success');
      setLoading(false);
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...user, status: newStatus });
      }
    }, 500);
  };

  const handleViewDetail = (user: UserItem) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'user': return { label: '普通用户', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50' };
      case 'electrician': return { label: '电工', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50' };
      case 'admin': return { label: '管理员', color: 'bg-purple-100 text-purple-700', bgColor: 'bg-purple-50' };
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    return status === 'active'
      ? { label: '正常', color: 'text-green-600', bgColor: 'bg-green-50', dot: 'bg-green-500' }
      : { label: '已禁用', color: 'text-red-600', bgColor: 'bg-red-50', dot: 'bg-red-500' };
  };

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchKeyword('');
  };

  const hasActiveFilters = roleFilter !== 'all' || statusFilter !== 'all' || searchKeyword !== '';

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
            <h1 className="text-lg font-bold text-gray-800">用户管理</h1>
            <p className="text-xs text-gray-400">共 {filteredUsers.length} 位用户</p>
          </div>
          <button 
            onClick={() => setShowFilterPanel(true)}
            className={`p-2 rounded-xl ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Filter size={20} />
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
              placeholder="搜索用户名、手机号..."
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

        {/* Filter Tags */}
        {hasActiveFilters && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {roleFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full whitespace-nowrap">
                {getRoleLabel(roleFilter).label}
                <button onClick={() => setRoleFilter('all')}><X size={12} /></button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                {statusFilter === 'active' ? '正常' : '已禁用'}
                <button onClick={() => setStatusFilter('all')}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-gray-400 px-2">
              清除全部
            </button>
          </div>
        )}
      </div>

      {/* User List - Scrollable */}
      <div 
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <div className="p-4 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">未找到符合条件的用户</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 text-sm font-bold">
                清除筛选条件
              </button>
            </div>
          ) : (
            filteredUsers.map(user => {
              const roleInfo = getRoleLabel(user.role);
              const statusInfo = getStatusLabel(user.status);

              return (
                <div 
                  key={user.id} 
                  onClick={() => handleViewDetail(user)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800">{user.username}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {user.registerTime}
                      </span>
                      {user.role === 'electrician' && (
                        <span className="text-blue-600">{user.orderCount}单</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(user); }}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active' ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={16} />
                      </button>
                    </div>
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
              {/* Role Filter */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">用户角色</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'user', label: '普通用户', color: 'blue' },
                    { value: 'electrician', label: '电工', color: 'green' },
                    { value: 'admin', label: '管理员', color: 'purple' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setRoleFilter(option.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        roleFilter === option.value
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
                <h3 className="font-bold text-gray-800 mb-3">账号状态</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'active', label: '正常', color: 'green' },
                    { value: 'disabled', label: '已禁用', color: 'red' },
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
                    { field: 'registerTime', label: '注册时间' },
                    { field: 'lastLogin', label: '最后登录' },
                    { field: 'username', label: '用户名' },
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
                确定 ({filteredUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">用户详情</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* User Header */}
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3">
                  {selectedUser.username.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{selectedUser.username}</h3>
                <p className="text-sm text-gray-400 mt-1">ID: {selectedUser.id}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleLabel(selectedUser.role).color}`}>
                    {getRoleLabel(selectedUser.role).label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusLabel(selectedUser.status).bgColor} ${getStatusLabel(selectedUser.status).color}`}>
                    {getStatusLabel(selectedUser.status).label}
                  </span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone size={16} /> 手机号
                  </span>
                  <span className="font-medium text-gray-800">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={16} /> 注册时间
                  </span>
                  <span className="font-medium text-gray-800">{selectedUser.registerTime}</span>
                </div>
                {selectedUser.lastLogin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={16} /> 最后登录
                    </span>
                    <span className="font-medium text-gray-800">{selectedUser.lastLogin}</span>
                  </div>
                )}
                {selectedUser.role === 'electrician' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Shield size={16} /> 完成订单
                    </span>
                    <span className="font-medium text-blue-600">{selectedUser.orderCount} 单</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleToggleStatus(selectedUser);
                    setShowDetailModal(false);
                  }}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    selectedUser.status === 'active'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {selectedUser.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                      {selectedUser.status === 'active' ? '禁用账号' : '启用账号'}
                    </>
                  )}
                </button>
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
