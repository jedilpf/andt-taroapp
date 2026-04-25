import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Button, Checkbox, ConfigProvider, Input } from '@nutui/nutui-react-taro';
import { Phone, Message, Weixin, Link } from '@nutui/icons-react-taro';
import { useState, useEffect } from 'react';
import { authApi } from '../../services/api/auth';
import { useUserStore } from '../../store/userStore';
import './login.scss';

const customTheme = {
  nutuiColorPrimary: '#E60012',
};

const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

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
    if (sendingCode) return;

    setSendingCode(true);
    try {
      await authApi.sendCode({ phone, type: 'login' });
      Taro.showToast({ title: '验证码已发送', icon: 'success' });
      setCountdown(60);
    } catch (error) {
      Taro.showToast({ title: '发送失败，请稍后重试', icon: 'none' });
    } finally {
      setSendingCode(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!agreed) {
      Taro.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }
    if (!validatePhone(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (code.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' });
      return;
    }
    if (loginLoading) return;

    setLoginLoading(true);
    try {
      const result = await authApi.login({ phone, code });

      useUserStore.getState().setToken(result.token, result.refreshToken);

      try {
        await useUserStore.getState().fetchUserInfo();
      } catch (e) {
        console.error('获取用户信息失败，使用登录返回的信息:', e);
        if (result.userInfo) {
          useUserStore.getState().setUserInfo(result.userInfo);
        }
      }

      Taro.showToast({ title: '登录成功', icon: 'success' });

      setTimeout(() => {
        if (result.isNewUser) {
          Taro.redirectTo({ url: '/pages/auth/profile-complete' });
        } else if (result.needBindPhone) {
          Taro.redirectTo({ url: '/pages/auth/bind-phone' });
        } else {
          Taro.switchTab({ url: '/pages/user/home/index' });
        }
      }, 1000);
    } catch (error) {
      Taro.showToast({ title: '登录失败，请检查验证码', icon: 'none' });
    } finally {
      setLoginLoading(false);
    }
  };

  // 开发模式：一键跳过登录
  const handleDevSkip = async () => {
    const mockToken = 'dev_mock_token_' + Date.now();
    const mockUserInfo = {
      id: 1,
      username: '开发用户',
      phone: '13800138000',
      avatar: '',
      role: 'user',
      status: 1
    };

    useUserStore.getState().setToken(mockToken, mockToken);
    useUserStore.getState().setUserInfo(mockUserInfo);

    Taro.showToast({ title: '开发模式登录成功', icon: 'success' });

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/user/home/index' });
    }, 800);
  };

  const bannerUrl = 'https://img12.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg';

  return (
    <ConfigProvider theme={customTheme}>
      <View className='login-page'>
        {/* 顶部 Banner区 */}
        <View className='banner-section'>
          <Image src={bannerUrl} mode='aspectFill' className='banner-img' />
          <View className='banner-overlay' />
          <View className='banner-content'>
            <Text className='app-name'>安电通</Text>
            <Text className='app-slogan'>专业电路安全检测平台</Text>
          </View>
        </View>

        {/* 登录卡片 */}
        <View className='login-card'>
          <View className='card-header'>
            <Text className='card-title'>欢迎登录</Text>
            <Text className='card-subtitle'>请使用手机号验证登录</Text>
          </View>

          <View className='form-group'>
            {/* 手机号输入框 */}
            <View className='input-row'>
              <View className='input-icon-wrap'>
                <Phone size={20} color="#999999" />
              </View>
              <Input
                type='tel'
                placeholder='请输入手机号'
                maxLength={11}
                value={phone}
                onChange={(value) => setPhone(value)}
                className='nut-input-custom'
              />
            </View>

            {/* 验证码输入框 */}
            <View className='input-row code-row'>
              <View className='input-icon-wrap'>
                <Message size={20} color="#999999" />
              </View>
              <Input
                type='number'
                placeholder='请输入验证码'
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                className='nut-input-custom code-input'
              />
              {countdown > 0 ? (
                <View className='code-btn disabled'>
                  <Text className='code-btn-text'>{countdown}s</Text>
                </View>
              ) : (
                <View className='code-btn' onClick={handleSendCode}>
                  <Text className='code-btn-text'>获取验证码</Text>
                </View>
              )}
            </View>
          </View>

          {/* 用户协议 */}
          <View className='agreement-row'>
            <Checkbox
              checked={agreed}
              onChange={(val) => setAgreed(val)}
              className='nut-custom-checkbox'
            >
              <Text className='gray-text'>我已阅读并同意</Text>
              <Text className='link-text'>《用户协议》</Text>
              <Text className='gray-text'>与</Text>
              <Text className='link-text'>《隐私政策》</Text>
            </Checkbox>
          </View>

          {/* 登录按钮 */}
          <Button
            block
            type='primary'
            shape='round'
            className='submit-btn'
            loading={loginLoading}
            disabled={loginLoading}
            onClick={handlePhoneLogin}
          >
            立即登录
          </Button>

          {/* 开发环境快速跳过按钮 */}
          <View className='dev-skip-btn' onClick={handleDevSkip}>
            <Text className='dev-skip-text'>⚡ 开发模式：一键跳过登录</Text>
          </View>

          {/* 其他选项 */}
          <View className='other-options'>
            <Text className='option-text' onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
              密码登录
            </Text>
            <Text className='option-text' onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
              忘记密码？
            </Text>
          </View>

          {/* 第三方登录 */}
          <View className='third-party-section'>
            <View className='divider'>
              <View className='line'></View>
              <Text className='text'>其他登录方式</Text>
              <View className='line'></View>
            </View>
            <View className='oauth-icons'>
              <View className='icon-wrap wechat-wrap' onClick={() => Taro.showToast({ title: '微信登录开发中', icon: 'none' })}>
                <Weixin size={28} color="#07C160" />
              </View>
              <View className='icon-wrap alipay-wrap' onClick={() => Taro.showToast({ title: '支付宝登录开发中', icon: 'none' })}>
                <Link size={28} color="#1677FF" />
              </View>
            </View>
          </View>

          {/* 注册入口 */}
          <View className='register-row'>
            <Text className='register-text'>还没有账号？</Text>
            <Text className='register-link' onClick={() => Taro.showToast({ title: '注册功能开发中', icon: 'none' })}>
              立即注册
            </Text>
          </View>
        </View>
      </View>
    </ConfigProvider>
  );
};

export default Login;
