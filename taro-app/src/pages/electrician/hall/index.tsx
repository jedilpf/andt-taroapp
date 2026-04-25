import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Empty } from '@nutui/nutui-react-taro';
import { Location, Clock, Search, Wallet } from '@nutui/icons-react-taro';
import { electricianApi } from '../../../services/api/inspection';
import type { InspectionOrder } from '../../../types/api';
import './index.scss';

const TaskHall = () => {
  const [pendingOrders, setPendingOrders] = useState<InspectionOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await electricianApi.getPendingOrders();
      setPendingOrders(result.list || []);
    } catch (error) {
      console.error('获取待接订单失败:', error);
      Taro.showToast({ title: '获取订单失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  Taro.useDidShow(() => {
    fetchPendingOrders();
  });

  const handleAccept = async (id: number) => {
    try {
      await electricianApi.acceptOrder(id);
      Taro.showToast({ title: '接单成功', icon: 'success' });
      fetchPendingOrders();
    } catch (error) {
      console.error('接单失败:', error);
      Taro.showToast({ title: '接单失败', icon: 'error' });
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      home_inspection: '家庭电路检测',
      commercial_inspection: '商业电路检测',
      repair: '电路维修',
      install: '电路安装',
    };
    return labels[serviceType] || serviceType;
  };

  const formatPrice = (order: InspectionOrder) => {
    return order.isFree ? '¥0' : `¥${order.price.toFixed(2)}`;
  };

  const formatTime = (scheduledTime: string) => {
    if (!scheduledTime) return '';
    const date = new Date(scheduledTime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (isToday) return `今天 ${timeStr}`;
    if (isTomorrow) return `明天 ${timeStr}`;
    return `${date.getMonth() + 1}/${date.getDate()} ${timeStr}`;
  };

  const getAddressText = (order: InspectionOrder) => {
    if (order.address) {
      const { province, city, district, detail } = order.address;
      return `${city}${district}${detail}`;
    }
    return `地址ID: ${order.addressId}`;
  };

  return (
    <View className="hall-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>任务大厅</Text>
          <Text className='subtitle'>抢单赚取更多收益</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      <View className="orders-container">
        {loading && (
          <View className="loading-state">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}

        {!loading && pendingOrders.length === 0 ? (
          <View className='empty-state'>
            <Empty
              title='暂无可接订单'
              description='当前没有待接的检测订单'
              image={<Search size={80} color="#CCCCCC" />}
            />
          </View>
        ) : (
          <View className="orders-list">
            {!loading && pendingOrders.map((order) => (
              <View key={order.id} className="order-card">
                <View className="card-header">
                  <Text className="order-type">{getServiceTypeLabel(order.serviceType)}</Text>
                  <View className="price-wrap">
                    <Wallet size={16} color="#E60012" />
                    <Text className="order-price">{formatPrice(order)}</Text>
                  </View>
                </View>
                <View className="order-info">
                  <View className="info-row">
                    <Location size={14} color="#999999" />
                    <Text className="info-text">{getAddressText(order)}</Text>
                  </View>
                  <View className="info-row">
                    <Clock size={14} color="#999999" />
                    <Text className="info-text">{formatTime(order.scheduledTime)}</Text>
                  </View>
                </View>
                <View className="card-actions">
                  <Button type="primary" className="accept-btn" onClick={() => handleAccept(order.id)}>
                    立即接单
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default TaskHall;
