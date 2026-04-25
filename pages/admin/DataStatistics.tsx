
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingCart, Wallet, Download, ChevronLeft, Calendar, ArrowUpDown, BarChart3, PieChart, Activity } from 'lucide-react';

type TimeRange = 'day' | 'week' | 'month' | 'year';
type ChartType = 'trend' | 'distribution' | 'revenue';

interface ChartData {
  label: string;
  value: number;
  subValue?: string;
}

export const DataStatistics = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartType, setChartType] = useState<ChartType>('trend');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const statsOverview = {
    totalUsers: 1258,
    userGrowth: 12.5,
    totalOrders: 4856,
    orderGrowth: 8.3,
    totalRevenue: 896500,
    revenueGrowth: 15.2,
    avgRating: 4.8,
    completionRate: 94.5,
  };

  const userGrowthData: ChartData[] = [
    { label: '周一', value: 120 },
    { label: '周二', value: 135 },
    { label: '周三', value: 98 },
    { label: '周四', value: 156 },
    { label: '周五', value: 178 },
    { label: '周六', value: 245 },
    { label: '周日', value: 198 },
  ];

  const orderTrendData: ChartData[] = [
    { label: '周一', value: 45 },
    { label: '周二', value: 52 },
    { label: '周三', value: 38 },
    { label: '周四', value: 65 },
    { label: '周五', value: 78 },
    { label: '周六', value: 92 },
    { label: '周日', value: 68 },
  ];

  const serviceTypeData: ChartData[] = [
    { label: '急修', value: 45, subValue: '2,185单' },
    { label: '安装', value: 30, subValue: '1,457单' },
    { label: '检测', value: 25, subValue: '1,214单' },
  ];

  const revenueData: ChartData[] = [
    { label: '服务收入', value: 75, subValue: '¥67.2万' },
    { label: '平台奖励', value: 15, subValue: '¥13.4万' },
    { label: '其他收入', value: 10, subValue: '¥9.0万' },
  ];

  const weeklyRevenue: ChartData[] = [
    { label: '周一', value: 12500 },
    { label: '周二', value: 15200 },
    { label: '周三', value: 11800 },
    { label: '周四', value: 18500 },
    { label: '周五', value: 22100 },
    { label: '周六', value: 26800 },
    { label: '周日', value: 19800 },
  ];

  const maxUserGrowth = Math.max(...userGrowthData.map(d => d.value));
  const maxOrderTrend = Math.max(...orderTrendData.map(d => d.value));
  const maxWeeklyRevenue = Math.max(...weeklyRevenue.map(d => d.value));

  const timeRangeLabels: Record<TimeRange, string> = {
    day: '今日',
    week: '本周',
    month: '本月',
    year: '本年',
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    alert(`正在导出${format === 'excel' ? 'Excel' : 'PDF'}报表...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/admin')} className="p-2 -ml-2 hover:bg-white/10 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">数据统计</h1>
            <p className="text-blue-200 text-sm">平台运营数据分析</p>
          </div>
          <button 
            onClick={() => setShowTimePicker(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-sm"
          >
            <Calendar size={14} />
            {timeRangeLabels[timeRange]}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-200" />
              <span className="text-blue-200 text-xs">用户总数</span>
            </div>
            <p className="text-2xl font-bold">{statsOverview.totalUsers.toLocaleString()}</p>
            <span className="text-green-300 text-xs">+{statsOverview.userGrowth}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart size={16} className="text-blue-200" />
              <span className="text-blue-200 text-xs">订单总数</span>
            </div>
            <p className="text-2xl font-bold">{statsOverview.totalOrders.toLocaleString()}</p>
            <span className="text-green-300 text-xs">+{statsOverview.orderGrowth}%</span>
          </div>
        </div>
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTimePicker(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">选择时间范围</h2>
              <button onClick={() => setShowTimePicker(false)}>
                <span className="text-gray-500">关闭</span>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {(Object.keys(timeRangeLabels) as TimeRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => { setTimeRange(range); setShowTimePicker(false); }}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className="p-4 space-y-4">
          {/* Secondary Stats */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 mb-1">总收入</p>
                <p className="text-xl font-bold text-gray-800">¥{(statsOverview.totalRevenue / 10000).toFixed(1)}万</p>
                <span className="text-xs text-green-500">+{statsOverview.revenueGrowth}%</span>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-600 mb-1">平均评分</p>
                <p className="text-xl font-bold text-gray-800">{statsOverview.avgRating}</p>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Chart Type Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex gap-1">
              {[
                { key: 'trend', label: '趋势', icon: Activity },
                { key: 'distribution', label: '分布', icon: PieChart },
                { key: 'revenue', label: '收入', icon: BarChart3 },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setChartType(item.key as ChartType)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      chartType === item.key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trend Chart */}
          {chartType === 'trend' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">用户增长趋势</h2>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">+12.5%</span>
              </div>
              <div className="flex items-end justify-between h-40 px-2">
                {userGrowthData.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all"
                        style={{ height: `${(d.value / maxUserGrowth) * 120}px` }}
                      />
                      <span className="absolute -top-5 text-[10px] text-gray-500">{d.value}</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distribution Chart */}
          {chartType === 'distribution' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">服务类型分布</h2>
              <div className="space-y-4">
                {serviceTypeData.map((d, idx) => {
                  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500'];
                  const bgColors = ['bg-red-50', 'bg-blue-50', 'bg-green-50'];
                  const textColors = ['text-red-600', 'text-blue-600', 'text-green-600'];
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700 font-medium">{d.label}</span>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${textColors[idx]}`}>{d.value}%</span>
                          <span className="text-xs text-gray-400 ml-2">{d.subValue}</span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[idx]} rounded-full transition-all duration-500`}
                          style={{ width: `${d.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Revenue Chart */}
          {chartType === 'revenue' && (
            <>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">收入构成</h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20"
                        strokeDasharray={`${75 * 2.51} 251`} strokeDashoffset="0"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20"
                        strokeDasharray={`${15 * 2.51} 251`} strokeDashoffset={`${-75 * 2.51}`}/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20"
                        strokeDasharray={`${10 * 2.51} 251`} strokeDashoffset={`${-90 * 2.51}`}/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">¥89.6万</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {revenueData.map((d, idx) => {
                      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${colors[idx]}`}></div>
                          <span className="text-sm text-gray-600 flex-1">{d.label}</span>
                          <span className="text-sm font-bold text-gray-800">{d.subValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">本周收入趋势</h2>
                <div className="flex items-end justify-between h-32 px-2">
                  {weeklyRevenue.map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-5 bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all"
                          style={{ height: `${(d.value / maxWeeklyRevenue) * 80}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Export Buttons */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3">导出报表</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleExport('excel')}
                className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
              >
                <Download size={18} className="text-green-600" />
                <span className="text-sm font-medium text-green-700">导出Excel</span>
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="flex items-center justify-center gap-2 py-3 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Download size={18} className="text-red-600" />
                <span className="text-sm font-medium text-red-700">导出PDF</span>
              </button>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <h2 className="font-bold mb-4">核心指标</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs">完单率</p>
                <p className="text-xl font-bold mt-1">{statsOverview.completionRate}%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs">客单价</p>
                <p className="text-xl font-bold mt-1">¥184.5</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs">复购率</p>
                <p className="text-xl font-bold mt-1">32.8%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs">投诉率</p>
                <p className="text-xl font-bold mt-1">0.3%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
