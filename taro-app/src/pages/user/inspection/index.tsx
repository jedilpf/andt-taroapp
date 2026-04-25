import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Tag } from '@nutui/nutui-react-taro';
import { Home, Store, Repairman, Order } from '@nutui/icons-react-taro';
import './index.scss';

interface ServiceType {
  key: string;
  label: string;
  badge?: string;
  desc: string;
  price: string;
  originalPrice?: string;
  icon: React.ReactNode;
}

const SERVICE_TYPES: ServiceType[] = [
  {
    key: 'home',
    label: '家庭电路检测',
    badge: '首次免费',
    desc: '全面检测家庭电路安全隐患，包括漏电、过载、短路等问题',
    price: '¥0',
    originalPrice: '¥199',
    icon: <Home size={32} color="#E60012" />
  },
  {
    key: 'commercial',
    label: '商业电路检测',
    desc: '商铺、写字楼电路安全检测，符合消防规范',
    price: '¥199',
    icon: <Store size={32} color="#E60012" />
  },
  {
    key: 'industrial',
    label: '工业电路检测',
    desc: '工厂、仓库电路安全检测，确保生产安全',
    price: '¥399',
    icon: <Repairman size={32} color="#E60012" />
  },
];

const Inspection = () => {
  const handleBook = (serviceType: string) => {
    Taro.navigateTo({ url: `/pages/user/inspection/book?serviceType=${serviceType}` });
  };

  const handleMyInspections = () => {
    Taro.navigateTo({ url: '/pages/user/inspection/process' });
  };

  return (
    <View className='inspection-page'>
      {/* 头部 Banner */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>一键检测</Text>
          <Text className='subtitle'>专业电路安全检测服务</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      {/* 服务类型卡片 */}
      <View className='services-container'>
        <View className='section-header'>
          <View className='header-line' />
          <Text className='header-title'>选择服务类型</Text>
        </View>

        <View className='service-list'>
          {SERVICE_TYPES.map((svc) => (
            <View className='service-card' key={svc.key}>
              <View className='card-main'>
                <View className='service-icon-wrap'>
                  {svc.icon}
                </View>
                <View className='service-info'>
                  <View className='title-row'>
                    <Text className='card-title'>{svc.label}</Text>
                    {svc.badge && (
                      <Tag type='primary' className='service-badge'>
                        {svc.badge}
                      </Tag>
                    )}
                  </View>
                  <Text className='card-desc'>{svc.desc}</Text>
                </View>
              </View>
              <View className='card-footer'>
                <View className='price-section'>
                  <Text className='price'>{svc.price}</Text>
                  {svc.originalPrice && (
                    <Text className='original-price'>{svc.originalPrice}</Text>
                  )}
                </View>
                <Button
                  type='primary'
                  className='book-btn'
                  onClick={() => handleBook(svc.key)}
                >
                  立即预约
                </Button>
              </View>
            </View>
          ))}
        </View>

        {/* 查看我的检测订单 */}
        <View className='my-orders-section'>
          <View className='my-orders-btn' onClick={handleMyInspections}>
            <Order size={20} color="#E60012" className='btn-icon' />
            <Text className='btn-text'>查看我的检测订单</Text>
            <Text className='btn-arrow'>›</Text>
          </View>
        </View>
      </View>

      {/* 服务流程 */}
      <View className='process-card'>
        <View className='section-header'>
          <View className='header-line' />
          <Text className='header-title'>服务流程</Text>
        </View>
        <View className='process-steps'>
          {[
            { step: '1', title: '在线预约', desc: '选择服务类型' },
            { step: '2', title: '电工上门', desc: '专业检测服务' },
            { step: '3', title: '生成报告', desc: '详细检测结果' },
            { step: '4', title: '整改建议', desc: '专业解决方案' },
          ].map((item, index) => (
            <View key={index} className='process-item'>
              <View className='step-number'>
                <Text className='step-text'>{item.step}</Text>
              </View>
              <Text className='step-title'>{item.title}</Text>
              <Text className='step-desc'>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Inspection;
