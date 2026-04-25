import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button, Input } from '@nutui/nutui-react-taro';
import { Phone, Message, ShieldCheck } from '@nutui/icons-react-taro';
import { useState, useEffect } from 'react';
import { authApi } from '../../services/api/auth';
import { useUserStore } from '../../store/userStore';
import './bind-phone.scss';

const BindPhone = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [binding, setBinding] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (sendingCode || countdown > 0) return;

    setSendingCode(true);
    try {
      await authApi.sendCode({ phone, type: 'bind' });
      Taro.showToast({ title: '验证码已发送', icon: 'success' });
      setCountdown(60);
    } catch (error) {
      Taro.showToast({ title: '发送失败，请稍后重试', icon: 'none' });
    } finally {
      setSendingCode(false);
    }
  };

  const handleBind = async () => {
    if (!validatePhone(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (code.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' });
      return;
    }
    if (binding) return;

    setBinding(true);
    try {
      await authApi.bindPhone({
        phone,
        code,
        bindType: 'phone',
        openId: '',
      });

      try {
        await useUserStore.getState().fetchUserInfo();
      } catch (e) {
        console.error('刷新用户信息失败:', e);
      }

      Taro.showToast({ title: '绑定成功', icon: 'success' });

      setTimeout(() => {
        const pages = Taro.getCurrentPages();
        if (pages.length > 1) {
          Taro.navigateBack();
        } else {
          Taro.switchTab({ url: '/pages/user/home/index' });
        }
      }, 1000);
    } catch (error: any) {
      const message = error?.message || '绑定失败，请稍后重试';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setBinding(false);
    }
  };

  return (
    <View className="bind-phone-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <View className="icon-wrap">
            <ShieldCheck size={48} color="#FFFFFF" />
          </View>
          <Text className='title'>绑定手机号</Text>
          <Text className='subtitle'>用于登录和接收通知</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      <View className="form-section">
        <View className="input-group">
          <View className="label-wrap">
            <Phone size={16} color="#E60012" />
            <Text className="label">手机号</Text>
          </View>
          <Input
            placeholder="请输入手机号"
            maxLength={11}
            value={phone}
            onChange={(value) => setPhone(value)}
            className="nut-input-bind"
            type="tel"
          />
        </View>

        <View className="input-group">
          <View className="label-wrap">
            <Message size={16} color="#E60012" />
            <Text className="label">验证码</Text>
          </View>
          <View className="code-input-wrap">
            <Input
              placeholder="请输入验证码"
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              className="nut-input-bind code-input"
              type="number"
            />
            <Button
              onClick={handleSendCode}
              disabled={countdown > 0 || sendingCode}
              loading={sendingCode}
              className="code-btn"
              type="primary"
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </View>
        </View>

        <Button
          type="primary"
          block
          loading={binding}
          disabled={binding}
          onClick={handleBind}
          className="submit-btn"
        >
          绑定
        </Button>
      </View>
    </View>
  );
};

export default BindPhone;
