import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Cell, CellGroup, Avatar } from '@nutui/nutui-react-taro';
import { User, Phone, ShieldCheck, Service } from '@nutui/icons-react-taro';
import { useUserStore, selectIsLogin } from '../../../store';
import './index.scss';

const Profile = () => {
  const isLogin = useUserStore(selectIsLogin);
  const { userInfo, fetchUserInfo, logout } = useUserStore();

  Taro.useDidShow(() => {
    if (isLogin) {
      fetchUserInfo();
    }
  });

  const handleLogout = async () => {
    Taro.showLoading({ title: '退出中...' });
    try {
      await logout();
      Taro.hideLoading();
      Taro.redirectTo({ url: '/pages/auth/login' });
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({ title: '退出失败，请重试', icon: 'none' });
    }
  };

  const handleBindPhone = () => {
    Taro.navigateTo({ url: '/pages/auth/bind-phone' });
  };

  const menuItems = [
    { icon: <User size={20} color="#E60012" />, title: '我的资料', onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }) },
    { icon: <Phone size={20} color="#E60012" />, title: '绑定手机', onClick: handleBindPhone },
    { icon: <ShieldCheck size={20} color="#E60012" />, title: '账号安全', onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }) },
    { icon: <Service size={20} color="#E60012" />, title: '联系客服', onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }) },
  ];

  return (
    <View className='profile-page'>
      {/* 头部用户信息 */}
      <View className='profile-header'>
        <View className='header-bg' />
        <View className='user-info'>
          <View className='avatar-section'>
            {userInfo?.avatar ? (
              <Avatar 
                size='large' 
                src={userInfo.avatar}
                className='user-avatar'
              />
            ) : (
              <Avatar 
                size='large' 
                className='user-avatar'
                style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
              >
                {userInfo?.username?.[0] || 'U'}
              </Avatar>
            )}
            <View className='user-meta'>
              <Text className='username'>{userInfo?.username || '用户'}</Text>
              <Text className='phone'>{userInfo?.phone || '未绑定手机'}</Text>
            </View>
          </View>
        </View>
        {/* 装饰元素 */}
        <View className='decoration-circle' />
      </View>

      {/* 功能菜单卡片 */}
      <View className='menu-card'>
        <CellGroup className='profile-cell-group'>
          {menuItems.map((item, index) => (
            <Cell
              key={index}
              title={item.title}
              onClick={item.onClick}
              className='profile-cell'
              icon={
                <View className='cell-icon-wrap'>
                  {item.icon}
                </View>
              }
            />
          ))}
        </CellGroup>
      </View>

      {/* 退出登录按钮 */}
      <View className='logout-section'>
        <Button 
          className='logout-btn'
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </View>

      {/* 版本信息 */}
      <View className='version-info'>
        <Text className='version-text'>安电通 v1.0.0</Text>
      </View>
    </View>
  );
};

export default Profile;
