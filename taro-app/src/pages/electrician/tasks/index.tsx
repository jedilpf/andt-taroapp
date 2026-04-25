import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Empty, Tag } from '@nutui/nutui-react-taro';
import { Location, User, Phone, Search, Success } from '@nutui/icons-react-taro';
import { electricianApi } from '../../../services/api/inspection';
import type { InspectionOrder, OrderStatus } from '../../../types/api';
import './index.scss';

const statusConfig: Record<OrderStatus, { text: string; type: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  PENDING: { text: '待接单', type: 'default' },
  ACCEPTED: { text: '已接单', type: 'warning' },
  ARRIVED: { text: '已到达', type: 'primary' },
  IN_PROGRESS: { text: '检测中', type: 'danger' },
  COMPLETED: { text: '已完成', type: 'success' },
  PAID: { text: '已支付', type: 'success' },
  CANCELLED: { text: '已取消', type: 'default' },
};

const Tasks = () => {
  const [myTasks, setMyTasks] = useState<InspectionOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const result = await electricianApi.getMyTasks();
      setMyTasks(result.list || []);
    } catch (error) {
      console.error('获取我的任务失败:', error);
      Taro.showToast({ title: '获取任务失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  Taro.useDidShow(() => {
    fetchMyTasks();
  });

  const handleArrive = async (id: number) => {
    try {
      await electricianApi.arriveOrder(id);
      Taro.showToast({ title: '已确认到达', icon: 'success' });
      fetchMyTasks();
    } catch (error) {
      console.error('确认到达失败:', error);
      Taro.showToast({ title: '操作失败', icon: 'error' });
    }
  };

  const handleStartInspection = async (id: number) => {
    try {
      await electricianApi.startInspection(id);
      Taro.showToast({ title: '开始检测', icon: 'success' });
      fetchMyTasks();
    } catch (error) {
      console.error('开始检测失败:', error);
      Taro.showToast({ title: '操作失败', icon: 'error' });
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

  const getAddressText = (order: InspectionOrder) => {
    if (order.address) {
      const { city, district, detail } = order.address;
      return `${city}${district}${detail}`;
    }
    return `地址ID: ${order.addressId}`;
  };

  const getContactInfo = (order: InspectionOrder) => {
    if (order.address) {
      return {
        contact: order.address.contactName || '未知',
        phone: order.address.contactPhone || '未知',
      };
    }
    return { contact: '未知', phone: '未知' };
  };

  const renderActionButton = (task: InspectionOrder) => {
    switch (task.status) {
      case 'ACCEPTED':
        return (
          <Button type="primary" className="action-btn" onClick={() => handleArrive(task.id)}>
            确认到达
          </Button>
        );
      case 'ARRIVED':
        return (
          <Button type="primary" className="action-btn" onClick={() => handleStartInspection(task.id)}>
            开始检测
          </Button>
        );
      case 'IN_PROGRESS':
        return (
          <Button type="primary" className="action-btn" onClick={() => {
            Taro.navigateTo({ url: `/pages/electrician/report/index?orderId=${task.id}` });
          }}>
            <Success size={14} color="#FFFFFF" />
            提交报告
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <View className="tasks-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>我的任务</Text>
          <Text className='subtitle'>管理和处理您的检测任务</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      <View className="tasks-container">
        {loading && (
          <View className="loading-state">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}

        {!loading && myTasks.length === 0 ? (
          <View className='empty-state'>
            <Empty
              title='暂无任务'
              description='您还没有接取任何任务'
              image={<Search size={80} color="#CCCCCC" />}
            />
          </View>
        ) : (
          <View className="tasks-list">
            {!loading && myTasks.map((task) => {
              const config = statusConfig[task.status] || { text: task.status, type: 'default' };
              const contactInfo = getContactInfo(task);
              return (
                <View key={task.id} className="task-card">
                  <View className="card-header">
                    <View className="service-info">
                      <Text className="task-type">{getServiceTypeLabel(task.serviceType)}</Text>
                      <Text className="task-id">订单号：{task.orderNo}</Text>
                    </View>
                    <Tag type={config.type} className="status-tag">
                      {config.text}
                    </Tag>
                  </View>

                  <View className="task-info">
                    <View className="info-row">
                      <Location size={14} color="#999999" />
                      <Text className="info-text">{getAddressText(task)}</Text>
                    </View>
                    <View className="info-row">
                      <User size={14} color="#999999" />
                      <Text className="info-text">联系人：{contactInfo.contact}</Text>
                    </View>
                    <View className="info-row">
                      <Phone size={14} color="#999999" />
                      <Text className="info-text">电话：{contactInfo.phone}</Text>
                    </View>
                  </View>

                  {renderActionButton(task) && (
                    <View className="card-actions">
                      {renderActionButton(task)}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Tasks;
