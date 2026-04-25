import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Empty, Tag } from '@nutui/nutui-react-taro';
import { Home, Store, Repairman, Search } from '@nutui/icons-react-taro';
import { useInspectionStore } from '../../../store/inspectionStore';
import './index.scss';

// 订单状态枚举
enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

// 状态标签映射
const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '待接单',
  [OrderStatus.ACCEPTED]: '已接单',
  [OrderStatus.ARRIVED]: '已到达',
  [OrderStatus.IN_PROGRESS]: '进行中',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.CANCELLED]: '已取消',
};

// 状态样式映射
const STATUS_TYPES: Record<OrderStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.ACCEPTED]: 'primary',
  [OrderStatus.ARRIVED]: 'success',
  [OrderStatus.IN_PROGRESS]: 'danger',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.PAID]: 'primary',
  [OrderStatus.CANCELLED]: 'default',
};

// 服务类型映射
const SERVICE_TYPE_LABELS: Record<string, string> = {
  home: '家庭电路检测',
  commercial: '商业电路检测',
  industrial: '工业电路检测',
};

// 服务图标映射
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  home: <Home size={24} color="#E60012" />,
  commercial: <Store size={24} color="#E60012" />,
  industrial: <Repairman size={24} color="#E60012" />,
};

interface Order {
  id: number;
  serviceType: string;
  status: OrderStatus;
  scheduledTime: string;
  price: number;
  isFree: boolean;
}

const Orders = () => {
  const { orderList, fetchOrderList } = useInspectionStore();

  Taro.useDidShow(() => {
    Taro.showLoading({ title: '加载中...' });
    fetchOrderList(1).finally(() => {
      Taro.hideLoading();
    });
  });

  const handleViewDetail = (id: number) => {
    Taro.navigateTo({ url: `/pages/user/orders/detail?id=${id}` });
  };

  const handleBook = () => {
    Taro.navigateTo({ url: '/pages/user/inspection/index' });
  };

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return '¥0';
    return `¥${price}`;
  };

  return (
    <View className='orders-page'>
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>我的订单</Text>
          <Text className='subtitle'>查看您的检测服务订单</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      {/* 订单列表 */}
      <View className='orders-container'>
        {orderList.length === 0 ? (
          <View className='empty-state'>
            <Empty
              title='暂无订单'
              description='您还没有预约任何检测服务'
              image={<Search size={80} color="#CCCCCC" />}
            />
            <Button
              type='primary'
              className='empty-btn'
              onClick={handleBook}
            >
              去预约
            </Button>
          </View>
        ) : (
          <View className='orders-list'>
            {orderList.map((order: Order) => {
              const statusType = STATUS_TYPES[order.status] || 'default';
              return (
                <View
                  key={order.id}
                  className='order-card'
                  onClick={() => handleViewDetail(order.id)}
                >
                  <View className='card-header'>
                    <View className='service-info'>
                      <View className='service-icon-wrap'>
                        {SERVICE_ICONS[order.serviceType] || SERVICE_ICONS.home}
                      </View>
                      <View className='service-meta'>
                        <Text className='service-type'>
                          {SERVICE_TYPE_LABELS[order.serviceType] || order.serviceType}
                        </Text>
                        <Text className='order-time'>{order.scheduledTime}</Text>
                      </View>
                    </View>
                    <Tag type={statusType} className='status-tag'>
                      {STATUS_LABELS[order.status] || order.status}
                    </Tag>
                  </View>

                  <View className='card-footer'>
                    <Text className='price'>
                      {formatPrice(order.price, order.isFree)}
                    </Text>
                    <Text className='view-detail'>查看详情 ›</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Orders;
