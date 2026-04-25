import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { authApi } from '../../services/api/auth';
import './profile-complete.scss';

const ProfileComplete = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (username.trim().length < 2) {
      Taro.showToast({ title: '用户名至少2个字符', icon: 'none' });
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      // Call backend to update user info
      const updatedInfo = await authApi.updateUserInfo({ username: username.trim() });

      // Update local store with the returned user info
      useUserStore.getState().setUserInfo(updatedInfo);

      Taro.showToast({ title: '资料完善成功', icon: 'success' });

      setTimeout(() => {
        Taro.switchTab({ url: '/pages/user/home/index' });
      }, 1000);
    } catch (error: any) {
      const message = error?.message || '提交失败，请稍后重试';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="profile-complete-page">
      <View className="header-section">
        <Text className="title">完善您的资料</Text>
        <Text className="subtitle">让我们更好地为您服务</Text>
      </View>

      <View className="form-section">
        <View className="input-group">
          <Text className="label">用户名</Text>
          <Input
            placeholder="请输入用户名"
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
            className="input"
          />
        </View>

        <Button
          type="primary"
          block
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
          className="submit-btn"
        >
          提交
        </Button>
      </View>
    </View>
  );
};

export default ProfileComplete;
