
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, RotateCcw, Check, DollarSign, MapPin, Zap, Bell, Gift, MessageSquare, ChevronLeft, X, ChevronRight, Shield, Truck, Star, Percent } from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

export const SystemConfig = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [configs, setConfigs] = useState({
    // Price settings
    servicePriceMin: 50,
    servicePriceMax: 5000,
    platformFee: 15,
    
    // Distance settings
    distanceBase: 3,
    distanceFree: 5,
    distanceFeePerKm: 2,
    
    // Dispatch settings
    dispatchMode: 'auto' as 'auto' | 'manual' | 'grab',
    autoDispatchRadius: 5,
    
    // Points settings
    pointsPerYuan: 10,
    pointsExchangeRate: 100,
    
    // Message settings
    pushEnabled: true,
    smsEnabled: true,
    messageTemplate: 'default' as 'default' | 'simple' | 'detail',
    
    // Review settings
    reviewRequired: true,
    autoCompleteHours: 24,
  });

  const sections: ConfigSection[] = [
    { id: 'price', title: '价格设置', icon: <DollarSign size={20} />, color: 'blue' },
    { id: 'distance', title: '距离规则', icon: <MapPin size={20} />, color: 'green' },
    { id: 'dispatch', title: '派单策略', icon: <Zap size={20} />, color: 'purple' },
    { id: 'points', title: '积分规则', icon: <Gift size={20} />, color: 'pink' },
    { id: 'message', title: '消息设置', icon: <Bell size={20} />, color: 'amber' },
    { id: 'review', title: '评价设置', icon: <Star size={20} />, color: 'orange' },
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleChange = (key: string, value: any) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      showToast('配置已保存', 'success');
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有配置为默认值吗？')) {
      setConfigs({
        servicePriceMin: 50,
        servicePriceMax: 5000,
        platformFee: 15,
        distanceBase: 3,
        distanceFree: 5,
        distanceFeePerKm: 2,
        dispatchMode: 'auto',
        autoDispatchRadius: 5,
        pointsPerYuan: 10,
        pointsExchangeRate: 100,
        pushEnabled: true,
        smsEnabled: true,
        messageTemplate: 'default',
        reviewRequired: true,
        autoCompleteHours: 24,
      });
      showToast('配置已重置', 'success');
    }
  };

  const getSectionColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    };
    return colors[color] || colors.blue;
  };

  const renderSectionContent = (sectionId: string) => {
    const colors = getSectionColor(sections.find(s => s.id === sectionId)?.color || 'blue');

    switch (sectionId) {
      case 'price':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">最低服务价格 (元)</label>
              <input
                type="number"
                value={configs.servicePriceMin}
                onChange={(e) => handleChange('servicePriceMin', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-2">低于此价格的订单将无法创建</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">最高服务价格 (元)</label>
              <input
                type="number"
                value={configs.servicePriceMax}
                onChange={(e) => handleChange('servicePriceMax', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-2">高于此价格需要平台审核</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">平台服务费 (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={configs.platformFee}
                  onChange={(e) => handleChange('platformFee', parseInt(e.target.value))}
                  className="flex-1 px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-blue-400"
                />
                <span className="text-xl font-bold text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">从每笔订单中抽取的平台服务费比例</p>
            </div>
          </div>
        );

      case 'distance':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">基础距离 (km)</label>
              <input
                type="number"
                value={configs.distanceBase}
                onChange={(e) => handleChange('distanceBase', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400 mt-2">计算距离费用的起始距离</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">免费距离 (km)</label>
              <input
                type="number"
                value={configs.distanceFree}
                onChange={(e) => handleChange('distanceFree', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400 mt-2">在此距离内不收取距离费用</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">超出费用 (元/km)</label>
              <input
                type="number"
                value={configs.distanceFeePerKm}
                onChange={(e) => handleChange('distanceFeePerKm', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400 mt-2">超出免费距离后的每公里费用</p>
            </div>
          </div>
        );

      case 'dispatch':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-3">派单模式</label>
              <div className="space-y-2">
                {[
                  { value: 'auto', label: '自动派单', desc: '系统根据距离和评分自动分配' },
                  { value: 'grab', label: '抢单模式', desc: '电工主动抢单，先到先得' },
                  { value: 'manual', label: '手动派单', desc: '管理员手动分配订单' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('dispatchMode', option.value)}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                      configs.dispatchMode === option.value
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${configs.dispatchMode === option.value ? 'text-purple-700' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                      {configs.dispatchMode === option.value && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {configs.dispatchMode === 'auto' && (
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-sm text-gray-600 block mb-2">自动派单半径 (km)</label>
                <input
                  type="number"
                  value={configs.autoDispatchRadius}
                  onChange={(e) => handleChange('autoDispatchRadius', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-purple-400"
                />
                <p className="text-xs text-gray-400 mt-2">在此范围内寻找合适的电工</p>
              </div>
            )}
          </div>
        );

      case 'points':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">积分获取比例</label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">每消费 1 元</span>
                <input
                  type="number"
                  value={configs.pointsPerYuan}
                  onChange={(e) => handleChange('pointsPerYuan', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white rounded-lg text-center font-bold border border-gray-200"
                />
                <span className="text-sm text-gray-500">积分</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">积分兑换比例</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={configs.pointsExchangeRate}
                  onChange={(e) => handleChange('pointsExchangeRate', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white rounded-lg text-center font-bold border border-gray-200"
                />
                <span className="text-sm text-gray-500">积分 = 1 元</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">积分兑换现金的比例</p>
            </div>
          </div>
        );

      case 'message':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">推送通知</span>
                  <p className="text-xs text-gray-400">开启后用户将收到订单状态推送</p>
                </div>
                <button
                  onClick={() => handleChange('pushEnabled', !configs.pushEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    configs.pushEnabled ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    configs.pushEnabled ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">短信通知</span>
                  <p className="text-xs text-gray-400">开启后发送短信通知用户</p>
                </div>
                <button
                  onClick={() => handleChange('smsEnabled', !configs.smsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    configs.smsEnabled ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    configs.smsEnabled ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-3">消息模板</label>
              <div className="space-y-2">
                {[
                  { value: 'default', label: '默认模板', desc: '标准的消息通知格式' },
                  { value: 'simple', label: '简洁模板', desc: '只显示关键信息' },
                  { value: 'detail', label: '详细模板', desc: '包含完整的订单信息' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('messageTemplate', option.value)}
                    className={`w-full p-3 rounded-xl text-left border-2 transition-all ${
                      configs.messageTemplate === option.value
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <span className={`font-bold text-sm ${configs.messageTemplate === option.value ? 'text-amber-700' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">强制评价</span>
                  <p className="text-xs text-gray-400">完成后必须评价才能下单</p>
                </div>
                <button
                  onClick={() => handleChange('reviewRequired', !configs.reviewRequired)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    configs.reviewRequired ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    configs.reviewRequired ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">自动完成时间 (小时)</label>
              <input
                type="number"
                value={configs.autoCompleteHours}
                onChange={(e) => handleChange('autoCompleteHours', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white rounded-xl text-lg font-bold border border-gray-200 focus:outline-none focus:border-orange-400"
              />
              <p className="text-xs text-gray-400 mt-2">服务完成后多久自动确认</p>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <h1 className="text-lg font-bold text-gray-800">系统配置</h1>
            <p className="text-xs text-gray-400">平台参数设置与管理</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <div className="p-4 space-y-3">
          {sections.map(section => {
            const colors = getSectionColor(section.color);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 active:scale-[0.99] transition-transform"
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                  {section.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800">{section.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">点击配置{section.title}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mx-4 mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
          <h2 className="font-bold mb-3">配置说明</h2>
          <ul className="text-sm text-blue-200 space-y-2">
            <li>• 修改配置后点击保存生效</li>
            <li>• 重置将恢复所有默认设置</li>
            <li>• 部分配置可能影响用户体验</li>
          </ul>
        </div>
      </div>

      {/* Section Modal */}
      {activeSection && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setActiveSection(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${getSectionColor(sections.find(s => s.id === activeSection)?.color || 'blue').bg} ${getSectionColor(sections.find(s => s.id === activeSection)?.color || 'blue').text} flex items-center justify-center`}>
                  {sections.find(s => s.id === activeSection)?.icon}
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
              </div>
              <button onClick={() => setActiveSection(null)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderSectionContent(activeSection)}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setActiveSection(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  handleSave();
                  setActiveSection(null);
                }}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} /> 保存
                  </>
                )}
              </button>
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
