
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, BarChart3, Settings, TrendingUp, Shield, AlertCircle, CheckCircle, Wallet, ChevronRight, Menu, X, Home, FileText } from 'lucide-react';

const menuItems = [
  { path: '/admin', label: '首页概览', icon: Home },
  { path: '/admin/users', label: '用户管理', icon: Users },
  { path: '/admin/orders', label: '订单管理', icon: ShoppingCart },
  { path: '/admin/stats', label: '数据统计', icon: BarChart3 },
  { path: '/admin/config', label: '系统配置', icon: Settings },
  { path: '/admin/logs', label: '日志管理', icon: FileText },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { title: '用户总数', value: '1,258', trend: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: '认证电工', value: '86', trend: '+8', icon: Shield, color: 'from-green-500 to-green-600' },
    { title: '今日订单', value: '48', trend: '+15%', icon: ShoppingCart, color: 'from-purple-500 to-purple-600' },
    { title: '今日收益', value: '¥8,560', trend: '+8%', icon: Wallet, color: 'from-amber-500 to-amber-600' },
  ];

  const pendingItems = [
    { type: '电工认证', count: 5, time: '2小时前', icon: Shield },
    { type: '资质审核', count: 3, time: '5小时前', icon: CheckCircle },
    { type: '投诉处理', count: 2, time: '1小时前', icon: AlertCircle },
  ];

  const recentOrders = [
    { id: 'ANDT-2026-0420-1001', user: '张三', electrician: '李师傅', amount: 120, status: 'completed' },
    { id: 'ANDT-2026-0420-1002', user: '王五', electrician: '周师傅', amount: 85, status: 'pending' },
    { id: 'ANDT-2026-0420-1003', user: '钱总', electrician: '-', amount: 200, status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">管理后台</h1>
            <p className="text-blue-200 text-sm">欢迎回来，管理员</p>
          </div>
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-xl"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.slice(0, 2).map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-white/80" />
                  <span className="text-white/80 text-xs">{stat.title}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <span className="text-white/60 text-xs">{stat.trend}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">菜单</h2>
              <button onClick={() => setMenuOpen(false)} className="p-2">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <nav className="p-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="px-4 -mt-4">
        {/* Secondary Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(2).map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Icon size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{stat.title}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  <span className="text-xs text-green-500">{stat.trend}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Entry */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-gray-800 mb-3">快捷入口</h2>
          <div className="grid grid-cols-4 gap-2">
            {menuItems.slice(1).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <Icon size={20} className="text-blue-600" />
                  <span className="text-[10px] text-gray-600">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">待处理事项</h2>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-xs text-blue-600 font-bold"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {pendingItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.type}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">近期订单</h2>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-blue-600 font-bold"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.user} → {order.electrician}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">¥{order.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status === 'completed' ? '已完成' : '进行中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
