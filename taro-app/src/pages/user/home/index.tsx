import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Grid, GridItem } from '@nutui/nutui-react-taro';
import { Search, Order, Success, Service, ShieldCheck, Clock, User } from '@nutui/icons-react-taro';
import { useEffect } from 'react';
import { useUserStore, selectIsLogin } from '../../../store';
import './index.scss';

const Home = () => {
  const isLogin = useUserStore(selectIsLogin);
  const userInfo = useUserStore((state) => state.userInfo);
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  useEffect(() => {
    if (!isLogin) {
      Taro.redirectTo({ url: '/pages/auth/login' });
      return;
    }
    if (!userInfo) {
      fetchUserInfo();
    }
  }, [isLogin]);

  const handleInspection = () => {
    Taro.navigateTo({ url: '/pages/user/inspection/index' });
  };

  const handleOrders = () => {
    Taro.switchTab({ url: '/pages/user/orders/index' });
  };

  const handleReports = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleService = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const menuItems = [
    { icon: <Search size={28} color="#E60012" />, text: '一键检测', onClick: handleInspection },
    { icon: <Order size={28} color="#E60012" />, text: '我的订单', onClick: handleOrders },
    { icon: <Success size={28} color="#E60012" />, text: '检测报告', onClick: handleReports },
    { icon: <Service size={28} color="#E60012" />, text: '联系客服', onClick: handleService },
  ];

  const serviceAdvantages = [
    { icon: <User size={24} color="#E60012" />, title: '专业认证电工', desc: '持证上岗，经验丰富' },
    { icon: <ShieldCheck size={24} color="#E60012" />, title: '全面安全检测', desc: '涵盖电路各项指标' },
    { icon: <Clock size={24} color="#E60012" />, title: '快速上门服务', desc: '预约后24小时内上门' },
  ];

  return (
    <View className='home-page'>
      {/* 顶部 Banner */}
      <View className='banner-section'>
        <View className='banner-bg' />
        <View className='banner-content'>
          <Text className='greeting-text'>{userInfo ? `${userInfo.username}，您好` : '欢迎回来'}</Text>
          <Text className='brand-title'>专业电路检测</Text>
          <Text className='brand-subtitle'>守护您的用电安全</Text>
          <Button 
            type='primary' 
            className='banner-btn'
            onClick={handleInspection}
          >
            立即预约
          </Button>
        </View>
        {/* 装饰圆圈 */}
        <View className='decoration-circle circle-1' />
        <View className='decoration-circle circle-2' />
      </View>

      {/* 功能菜单卡片 */}
      <View className='menu-card'>
        <View className='card-header'>
          <View className='header-line' />
          <Text className='header-title'>常用功能</Text>
        </View>
        <Grid columns={4} className='menu-grid' border={false}>
          {menuItems.map((item, index) => (
            <GridItem 
              key={index} 
              onClick={item.onClick}
              className='menu-grid-item'
            >
              <View className='menu-icon-wrap'>
                {item.icon}
              </View>
              <Text className='menu-text'>{item.text}</Text>
            </GridItem>
          ))}
        </Grid>
      </View>

      {/* 服务优势卡片 */}
      <View className='service-card'>
        <View className='card-header'>
          <View className='header-line' />
          <Text className='header-title'>服务优势</Text>
        </View>
        <View className='service-list'>
          {serviceAdvantages.map((item, index) => (
            <View key={index} className='service-item'>
              <View className='service-icon-wrap'>
                {item.icon}
              </View>
              <View className='service-content'>
                <Text className='service-title'>{item.title}</Text>
                <Text className='service-desc'>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 底部安全提示 */}
      <View className='safety-tips'>
        <Text className='tips-text'>🔒 您的信息安全受到严格保护</Text>
      </View>
    </View>
  );
};

export default Home;
