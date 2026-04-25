
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, FileText, ChevronLeft, X, Clock, User, Shield, 
  AlertCircle, CheckCircle, Info, Terminal, Bug, Eye, Calendar,
  ArrowUpDown, Trash2, Download, RefreshCw
} from 'lucide-react';

type LogType = 'operation' | 'system' | 'error' | 'security';
type LogLevel = 'info' | 'warning' | 'error' | 'debug';
type SortField = 'timestamp' | 'user' | 'type';
type SortOrder = 'asc' | 'desc';

interface LogItem {
  id: string;
  timestamp: string;
  type: LogType;
  level: LogLevel;
  user?: string;
  userId?: string;
  ip?: string;
  action: string;
  description: string;
  result: 'success' | 'failure';
  details?: string;
  params?: Record<string, any>;
}

export const LogManagement = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | LogType>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | LogLevel>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [logs, setLogs] = useState<LogItem[]>([
    { 
      id: 'L001', 
      timestamp: '2026-04-20 14:32:18', 
      type: 'operation', 
      level: 'info',
      user: '管理员',
      userId: 'U006',
      ip: '192.168.1.100',
      action: '用户禁用',
      description: '禁用用户 U004 赵工',
      result: 'success',
      params: { userId: 'U004', reason: '违规操作' }
    },
    { 
      id: 'L002', 
      timestamp: '2026-04-20 14:28:45', 
      type: 'system', 
      level: 'info',
      action: '系统启动',
      description: '安电通后台管理系统启动成功',
      result: 'success'
    },
    { 
      id: 'L003', 
      timestamp: '2026-04-20 14:15:32', 
      type: 'error', 
      level: 'error',
      action: '数据库连接失败',
      description: '无法连接到 MySQL 数据库服务器',
      result: 'failure',
      details: 'Error: Connection timeout after 30000ms\n    at Database.connect (db.js:45:12)\n    at async initConnection (app.js:23:5)'
    },
    { 
      id: 'L004', 
      timestamp: '2026-04-20 13:58:21', 
      type: 'operation', 
      level: 'info',
      user: '管理员',
      userId: 'U006',
      ip: '192.168.1.100',
      action: '订单取消',
      description: '取消订单 ANDT-2026-0420-1003',
      result: 'success',
      params: { orderId: 'ANDT-2026-0420-1003', reason: '用户要求' }
    },
    { 
      id: 'L005', 
      timestamp: '2026-04-20 13:45:09', 
      type: 'security', 
      level: 'warning',
      user: '未知用户',
      ip: '203.0.113.45',
      action: '登录失败',
      description: '多次尝试使用错误密码登录',
      result: 'failure',
      details: '连续5次登录失败，IP已被临时封禁'
    },
    { 
      id: 'L006', 
      timestamp: '2026-04-20 13:30:15', 
      type: 'operation', 
      level: 'info',
      user: '管理员',
      userId: 'U006',
      ip: '192.168.1.100',
      action: '配置修改',
      description: '修改系统配置：平台服务费',
      result: 'success',
      params: { key: 'platformFee', oldValue: 10, newValue: 15 }
    },
    { 
      id: 'L007', 
      timestamp: '2026-04-20 12:58:42', 
      type: 'system', 
      level: 'debug',
      action: '定时任务执行',
      description: '自动清理过期缓存数据',
      result: 'success',
      details: '清理了 128 条过期缓存记录'
    },
    { 
      id: 'L008', 
      timestamp: '2026-04-20 12:15:33', 
      type: 'error', 
      level: 'error',
      action: 'API 请求异常',
      description: '支付接口返回错误',
      result: 'failure',
      details: 'HTTP 500: Internal Server Error\nResponse: {\n  "code": "PAYMENT_FAILED",\n  "message": "Insufficient balance"\n}'
    },
    { 
      id: 'L009', 
      timestamp: '2026-04-20 11:42:18', 
      type: 'operation', 
      level: 'info',
      user: '管理员',
      userId: 'U006',
      ip: '192.168.1.100',
      action: '用户启用',
      description: '启用用户 U008 吴女士',
      result: 'success',
      params: { userId: 'U008' }
    },
    { 
      id: 'L010', 
      timestamp: '2026-04-20 11:20:05', 
      type: 'security', 
      level: 'info',
      user: '管理员',
      userId: 'U006',
      ip: '192.168.1.100',
      action: '权限变更',
      description: '修改用户 U002 权限为电工认证',
      result: 'success',
      params: { userId: 'U002', role: 'electrician' }
    },
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

  const getTypeInfo = (type: LogType) => {
    switch(type) {
      case 'operation': return { 
        label: '操作日志', 
        color: 'bg-blue-500', 
        bgColor: 'bg-blue-50', 
        textColor: 'text-blue-600',
        icon: User 
      };
      case 'system': return { 
        label: '系统日志', 
        color: 'bg-green-500', 
        bgColor: 'bg-green-50', 
        textColor: 'text-green-600',
        icon: Terminal 
      };
      case 'error': return { 
        label: '错误日志', 
        color: 'bg-red-500', 
        bgColor: 'bg-red-50', 
        textColor: 'text-red-600',
        icon: Bug 
      };
      case 'security': return { 
        label: '安全日志', 
        color: 'bg-amber-500', 
        bgColor: 'bg-amber-50', 
        textColor: 'text-amber-600',
        icon: Shield 
      };
    }
  };

  const getLevelInfo = (level: LogLevel) => {
    switch(level) {
      case 'info': return { label: '信息', color: 'bg-blue-100 text-blue-700' };
      case 'warning': return { label: '警告', color: 'bg-amber-100 text-amber-700' };
      case 'error': return { label: '错误', color: 'bg-red-100 text-red-700' };
      case 'debug': return { label: '调试', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchSearch = searchKeyword === '' ||
      log.action.includes(searchKeyword) ||
      log.description.includes(searchKeyword) ||
      log.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (log.user && log.user.includes(searchKeyword));
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    const matchLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchResult = resultFilter === 'all' || log.result === resultFilter;
    return matchSearch && matchType && matchLevel && matchResult;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'timestamp':
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      case 'user':
        comparison = (a.user || '').localeCompare(b.user || '');
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleClearLogs = () => {
    if (confirm('确定要清空所有日志吗？此操作不可恢复。')) {
      setLoading(true);
      setTimeout(() => {
        setLogs([]);
        setLoading(false);
        showToast('日志已清空', 'success');
      }, 800);
    }
  };

  const handleExportLogs = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('日志导出成功', 'success');
    }, 1000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('日志已刷新', 'success');
    }, 800);
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setLevelFilter('all');
    setResultFilter('all');
    setSearchKeyword('');
  };

  const hasActiveFilters = typeFilter !== 'all' || levelFilter !== 'all' || resultFilter !== 'all' || searchKeyword !== '';

  const stats = {
    total: logs.length,
    operation: logs.filter(l => l.type === 'operation').length,
    system: logs.filter(l => l.type === 'system').length,
    error: logs.filter(l => l.type === 'error').length,
    security: logs.filter(l => l.type === 'security').length,
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
            <h1 className="text-lg font-bold text-gray-800">日志管理</h1>
            <p className="text-xs text-gray-400">共 {filteredLogs.length} 条日志</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl"
          >
            <RefreshCw size={20} />
          </button>
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
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              typeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            全部 {stats.total}
          </button>
          <button 
            onClick={() => setTypeFilter('operation')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              typeFilter === 'operation' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            操作 {stats.operation}
          </button>
          <button 
            onClick={() => setTypeFilter('system')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              typeFilter === 'system' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600'
            }`}
          >
            系统 {stats.system}
          </button>
          <button 
            onClick={() => setTypeFilter('error')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              typeFilter === 'error' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'
            }`}
          >
            错误 {stats.error}
          </button>
          <button 
            onClick={() => setTypeFilter('security')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              typeFilter === 'security' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'
            }`}
          >
            安全 {stats.security}
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
              placeholder="搜索操作、描述、用户..."
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

      {/* Log List - Scrollable */}
      <div 
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <div className="p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">未找到符合条件的日志</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 text-sm font-bold">
                清除筛选条件
              </button>
            </div>
          ) : (
            filteredLogs.map(log => {
              const typeInfo = getTypeInfo(log.type);
              const levelInfo = getLevelInfo(log.level);
              const TypeIcon = typeInfo.icon;

              return (
                <div 
                  key={log.id}
                  onClick={() => { setSelectedLog(log); setShowDetailModal(true); }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${typeInfo.bgColor} ${typeInfo.textColor} flex items-center justify-center`}>
                        <TypeIcon size={16} />
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${levelInfo.color}`}>
                          {levelInfo.label}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      log.result === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {log.result === 'success' ? '成功' : '失败'}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-1">{log.action}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{log.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>{log.timestamp}</span>
                    </div>
                    {log.user && (
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{log.user}</span>
                      </div>
                    )}
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
                <h3 className="font-bold text-gray-800 mb-3">日志类型</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'operation', label: '操作日志', color: 'blue' },
                    { value: 'system', label: '系统日志', color: 'green' },
                    { value: 'error', label: '错误日志', color: 'red' },
                    { value: 'security', label: '安全日志', color: 'amber' },
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

              {/* Level Filter */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">日志级别</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'info', label: '信息', color: 'blue' },
                    { value: 'warning', label: '警告', color: 'amber' },
                    { value: 'error', label: '错误', color: 'red' },
                    { value: 'debug', label: '调试', color: 'gray' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setLevelFilter(option.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        levelFilter === option.value
                          ? `bg-${option.color}-100 text-${option.color}-600 border-2 border-${option.color}-200`
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Filter */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">操作结果</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: 'success', label: '成功', color: 'green' },
                    { value: 'failure', label: '失败', color: 'red' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setResultFilter(option.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        resultFilter === option.value
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
                    { field: 'timestamp', label: '时间' },
                    { field: 'user', label: '用户' },
                    { field: 'type', label: '类型' },
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
                确定 ({filteredLogs.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${getTypeInfo(selectedLog.type).bgColor} ${getTypeInfo(selectedLog.type).textColor} flex items-center justify-center`}>
                  {React.createElement(getTypeInfo(selectedLog.type).icon, { size: 20 })}
                </div>
                <h2 className="text-lg font-bold text-gray-800">日志详情</h2>
              </div>
              <button onClick={() => setShowDetailModal(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Log Header */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getTypeInfo(selectedLog.type).color}`}>
                    {getTypeInfo(selectedLog.type).label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getLevelInfo(selectedLog.level).color}`}>
                    {getLevelInfo(selectedLog.level).label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedLog.result === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {selectedLog.result === 'success' ? '成功' : '失败'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{selectedLog.action}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedLog.description}</p>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">时间</p>
                    <p className="font-medium text-gray-800">{selectedLog.timestamp}</p>
                  </div>
                </div>

                {selectedLog.user && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <User size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">操作用户</p>
                      <p className="font-medium text-gray-800">{selectedLog.user}</p>
                      <p className="text-xs text-gray-400">ID: {selectedLog.userId}</p>
                    </div>
                  </div>
                )}

                {selectedLog.ip && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <Shield size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">IP 地址</p>
                      <p className="font-medium text-gray-800">{selectedLog.ip}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Params */}
              {selectedLog.params && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-bold mb-2">请求参数</p>
                  <pre className="text-xs text-blue-800 overflow-x-auto">
                    {JSON.stringify(selectedLog.params, null, 2)}
                  </pre>
                </div>
              )}

              {/* Details */}
              {selectedLog.details && (
                <div className={`rounded-xl p-4 ${
                  selectedLog.level === 'error' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs font-bold mb-2 ${
                    selectedLog.level === 'error' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    详细信息
                  </p>
                  <pre className={`text-xs overflow-x-auto whitespace-pre-wrap ${
                    selectedLog.level === 'error' ? 'text-red-800' : 'text-gray-700'
                  }`}>
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showToast('日志已复制到剪贴板', 'success');
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download size={16} /> 复制日志
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 max-w-md mx-auto">
        <button
          onClick={handleExportLogs}
          disabled={loading || logs.length === 0}
          className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download size={16} /> 导出日志
        </button>
        <button
          onClick={handleClearLogs}
          disabled={loading || logs.length === 0}
          className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Trash2 size={16} /> 清空日志
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
