import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Empty, Tag } from '@nutui/nutui-react-taro';
import { Search, Order } from '@nutui/icons-react-taro';
import { useInspectionStore } from '../../../store/inspectionStore';
import './process.scss';

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待接单',
  ACCEPTED: '已接单',
  ARRIVED: '已到达',
  IN_PROGRESS: '检测中',
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
};

const STATUS_TYPES: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  PENDING: 'warning',
  ACCEPTED: 'primary',
  ARRIVED: 'success',
  IN_PROGRESS: 'danger',
  COMPLETED: 'success',
  PAID: 'primary',
  CANCELLED: 'default',
};

const STEP_ORDER = ['PENDING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
const STEP_LABELS = ['预约成功', '已接单', '已到达', '检测中', '已完成'];

const getStepIndex = (status: string): number => {
  const idx = STEP_ORDER.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  home: '家庭电路检测',
  commercial: '商业电路检测',
  industrial: '工业电路检测',
};

const Process = () => {
  const { orderList, fetchOrderList } = useInspectionStore();

  Taro.useDidShow(() => {
    Taro.showLoading({ title: '加载中...' });
    fetchOrderList(1).finally(() => {
      Taro.hideLoading();
    });
  });

  const handleViewReport = (id: number) => {
    Taro.navigateTo({ url: `/pages/user/inspection/report?id=${id}` });
  };

  return (
    <View className="process-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>检测进度</Text>
          <Text className='subtitle'>实时跟踪您的检测订单</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      <View className="process-container">
        {orderList.length === 0 ? (
          <View className='empty-state'>
            <Empty
              title='暂无订单'
              description='您还没有检测订单'
              image={<Search size={80} color="#CCCCCC" />}
            />
          </View>
        ) : (
          <View className="process-list">
            {orderList.map((order) => {
              const step = getStepIndex(order.status);
              const isCancelled = order.status === 'CANCELLED';
              const statusType = STATUS_TYPES[order.status] || 'default';
              return (
                <View key={order.id} className="process-card">
                  <View className="card-header">
                    <View className="service-info">
                      <Text className="type">{SERVICE_TYPE_LABELS[order.serviceType] || order.serviceType}</Text>
                      <Text className="order-no">订单号：{order.orderNo}</Text>
                    </View>
                    <Tag type={statusType} className="status-tag">
                      {STATUS_LABELS[order.status] || order.status}
                    </Tag>
                  </View>

                  {!isCancelled && (
                    <View className="progress-section">
                      {STEP_LABELS.map((label, index) => (
                        <View key={label} className={`progress-item ${step >= index ? 'active' : ''}`}>
                          <View className="dot-wrap">
                            <View className="dot"></View>
                            {index < STEP_LABELS.length - 1 && <View className="line"></View>}
                          </View>
                          <Text className="dot-text">{label}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View className="card-info">
                    <View className="info-row">
                      <Text className="info-label">预约时间</Text>
                      <Text className="info-value">{order.scheduledTime}</Text>
                    </View>
                    <View className="info-row">
                      <Text className="info-label">费用</Text>
                      <Text className="info-value price">{order.isFree ? '免费' : `¥${order.price}`}</Text>
                    </View>
                  </View>

                  {(order.status === 'COMPLETED' || order.status === 'PAID') && (
                    <Button 
                      type="primary" 
                      className="report-btn"
                      onClick={() => handleViewReport(order.id)}
                    >
                      <Order size={16} color="#FFFFFF" />
                      查看报告
                    </Button>
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

export default Process;
