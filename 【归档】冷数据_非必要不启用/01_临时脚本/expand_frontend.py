#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

additional_frontend = '''

## 第三部分：前端补充代码

### 3.1 前端核心代码 - 微信登录组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './login.scss';

class Login extends Taro.Component {
  state = {
    phone: '',
    password: '',
    verifyCode: '',
    loginType: 'password',
    countdown: 0,
    agreementChecked: false,
    loading: false,
  };

  componentDidMount() {
    this.checkSession();
  }

  checkSession = () => {
    Taro.checkSession({
      success: () => {
        const token = Taro.getStorageSync('token');
        if (token) {
          Taro.switchTab({ url: '/pages/index/index' });
        }
      },
      fail: () => {
        Taro.removeStorageSync('token');
      },
    });
  };

  onPhoneChange = (e) => {
    this.setState({ phone: e.detail.value });
  };

  onPasswordChange = (e) => {
    this.setState({ password: e.detail.value });
  };

  onVerifyCodeChange = (e) => {
    this.setState({ verifyCode: e.detail.value });
  };

  onLoginTypeChange = (type) => {
    this.setState({ loginType: type });
  };

  sendVerifyCode = async () => {
    const { phone, countdown } = this.state;
    if (countdown > 0) return;
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    try {
      await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/sendVerifyCode`,
        data: { phone },
      });
      Taro.showToast({ title: '验证码已发送' });
      this.setState({ countdown: 60 });
      const timer = setInterval(() => {
        this.setState((prev) => {
          if (prev.countdown <= 1) {
            clearInterval(timer);
            return { countdown: 0 };
          }
          return { countdown: prev.countdown - 1 };
        });
      }, 1000);
    } catch (error) {
      Taro.showToast({ title: error.message || '发送失败', icon: 'none' });
    }
  };

  handleLogin = async () => {
    const { phone, password, verifyCode, loginType, agreementChecked, loading } = this.state;
    if (loading) return;
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!agreementChecked) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
      return;
    }
    if (loginType === 'password' && !password) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (loginType === 'verifyCode' && !verifyCode) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    this.setState({ loading: true });
    try {
      let result;
      if (loginType === 'password') {
        result = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/login`,
          method: 'POST',
          data: { phone, password },
        });
      } else {
        result = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/loginByVerifyCode`,
          method: 'POST',
          data: { phone, verifyCode },
        });
      }
      if (result.data.code === 0) {
        Taro.setStorageSync('token', result.data.data.token);
        Taro.setStorageSync('isLogin', true);
        Taro.showToast({ title: '登录成功' });
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' });
        }, 1500);
      } else {
        Taro.showToast({ title: result.data.message || '登录失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleWechatLogin = async () => {
    const { agreementChecked } = this.state;
    if (!agreementChecked) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
      return;
    }
    try {
      const loginResult = await Taro.login();
      const result = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/wechatLogin`,
        method: 'POST',
        data: { code: loginResult.code },
      });
      if (result.data.code === 0) {
        Taro.setStorageSync('token', result.data.data.token);
        Taro.setStorageSync('isLogin', true);
        Taro.showToast({ title: '登录成功' });
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' });
        }, 1500);
      } else {
        Taro.showToast({ title: result.data.message || '登录失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '微信登录失败', icon: 'none' });
    }
  };

  handleAppleLogin = async () => {
    const { agreementChecked } = this.state;
    if (!agreementChecked) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '暂不支持Apple登录', icon: 'none' });
  };

  goToRegister = () => {
    Taro.navigateTo({ url: '/pages/user/register' });
  };

  goToForgetPassword = () => {
    Taro.navigateTo({ url: '/pages/user/forgetPassword' });
  };

  goToAgreement = (type) => {
    Taro.navigateTo({ url: `/pages/user/agreement?type=${type}` });
  };

  onAgreementChange = (e) => {
    this.setState({ agreementChecked: e.detail.value.length > 0 });
  };

  render() {
    const { phone, password, verifyCode, loginType, countdown, agreementChecked, loading } = this.state;
    return (
      <View className="login-page">
        <View className="login-header">
          <Image className="logo" src="https://example.com/logo.png" mode="aspectFit" />
          <Text className="title">安电通</Text>
          <Text className="subtitle">家庭用电安全服务平台</Text>
        </View>
        <View className="login-form">
          <View className="login-type-switch">
            <View className={`type-item ${loginType === 'password' ? 'active' : ''}`} onClick={() => this.onLoginTypeChange('password')}>
              密码登录
            </View>
            <View className={`type-item ${loginType === 'verifyCode' ? 'active' : ''}`} onClick={() => this.onLoginTypeChange('verifyCode')}>
              验证码登录
            </View>
          </View>
          <View className="form-item">
            <Input className="input" type="number" maxLength={11} placeholder="请输入手机号" value={phone} onInput={this.onPhoneChange} />
          </View>
          {loginType === 'password' ? (
            <View className="form-item">
              <Input className="input" password type="text" placeholder="请输入密码" value={password} onInput={this.onPasswordChange} />
            </View>
          ) : (
            <View className="form-item verify-code-item">
              <Input className="input" type="number" maxLength={6} placeholder="请输入验证码" value={verifyCode} onInput={this.onVerifyCodeChange} />
              <Button className="send-code-btn" disabled={countdown > 0} onClick={this.sendVerifyCode}>
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </View>
          )}
          <View className="agreement-item">
            <CheckboxGroup onChange={this.onAgreementChange}>
              <Checkbox value="agreed" checked={agreementChecked} />
            </CheckboxGroup>
            <Text className="agreement-text">
              我已阅读并同意
              <Text className="link" onClick={() => this.goToAgreement('user')}>《用户协议》</Text>
              和
              <Text className="link" onClick={() => this.goToAgreement('privacy')}>《隐私政策》</Text>
            </Text>
          </View>
          <Button className="login-btn" loading={loading} onClick={this.handleLogin}>
            登录
          </Button>
          <View className="third-party-login">
            <Text className="divider-text">其他登录方式</Text>
            <View className="third-party-icons">
              <View className="icon-item" onClick={this.handleWechatLogin}>
                <Image className="icon" src="https://example.com/wechat.png" mode="aspectFit" />
                <Text className="icon-label">微信</Text>
              </View>
              <View className="icon-item" onClick={this.handleAppleLogin}>
                <Image className="icon" src="https://example.com/apple.png" mode="aspectFit" />
                <Text className="icon-label">Apple</Text>
              </View>
            </View>
          </View>
          <View className="register-link">
            <Text className="text">还没有账号？</Text>
            <Text className="link" onClick={this.goToRegister}>立即注册</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
```

### 3.2 前端核心代码 - 服务详情组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './detail.scss';

class ServiceDetail extends Taro.Component {
  state = {
    serviceId: null,
    serviceDetail: null,
    selectedSpec: null,
    quantity: 1,
    isFavorite: false,
    loading: false,
    evaluationList: [],
    evaluationStats: null,
  };

  componentDidMount(options) {
    const { id } = options || {};
    if (id) {
      this.setState({ serviceId: parseInt(id) });
      this.getServiceDetail(id);
      this.getServiceEvaluations(id);
      this.checkFavoriteStatus(id);
    }
  }

  getServiceDetail = async (id) => {
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/item/${id}`,
      });
      if (res.data.code === 0) {
        this.setState({ serviceDetail: res.data.data, loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getServiceEvaluations = async (id) => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/item/${id}/evaluations`,
        data: { pageNum: 1, pageSize: 5 },
      });
      if (res.data.code === 0) {
        this.setState({ evaluationList: res.data.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkFavoriteStatus = async (id) => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/favorites`,
      });
      if (res.data.code === 0) {
        const favorites = res.data.data || [];
        const isFavorite = favorites.some((item) => item.id === parseInt(id));
        this.setState({ isFavorite });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onSpecSelect = (spec) => {
    this.setState({ selectedSpec: spec });
  };

  onQuantityChange = (num) => {
    const { quantity } = this.state;
    const newQuantity = quantity + num;
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    this.setState({ quantity: newQuantity });
  };

  toggleFavorite = async () => {
    const { serviceId, isFavorite } = this.state;
    const isLogin = Taro.getStorageSync('isLogin');
    if (!isLogin) {
      Taro.navigateTo({ url: '/pages/user/login' });
      return;
    }
    try {
      if (isFavorite) {
        await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/favorite/${serviceId}`,
          method: 'DELETE',
        });
        Taro.showToast({ title: '取消收藏' });
        this.setState({ isFavorite: false });
      } else {
        await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/favorite/${serviceId}`,
          method: 'POST',
        });
        Taro.showToast({ title: '收藏成功' });
        this.setState({ isFavorite: true });
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' });
    }
  };

  goToCreateOrder = () => {
    const { serviceId, selectedSpec, quantity, serviceDetail } = this.state;
    const isLogin = Taro.getStorageSync('isLogin');
    if (!isLogin) {
      Taro.navigateTo({ url: '/pages/user/login' });
      return;
    }
    const price = selectedSpec ? selectedSpec.price : serviceDetail.price;
    Taro.navigateTo({
      url: `/pages/order/create?serviceId=${serviceId}&specId=${selectedSpec?.id || ''}&quantity=${quantity}&price=${price}`,
    });
  };

  goToElectricianList = () => {
    const { serviceId } = this.state;
    Taro.navigateTo({
      url: `/pages/electrician/list?serviceId=${serviceId}`,
    });
  };

  goToEvaluationList = () => {
    const { serviceId } = this.state;
    Taro.navigateTo({
      url: `/pages/service/evaluations?id=${serviceId}`,
    });
  };

  previewImages = (current) => {
    const { serviceDetail } = this.state;
    const images = serviceDetail.images || [serviceDetail.image];
    Taro.previewImage({ urls: images, current });
  };

  render() {
    const { serviceDetail, selectedSpec, quantity, isFavorite, loading, evaluationList } = this.state;
    if (loading || !serviceDetail) {
      return (
        <View className="loading-container">
          <Text>加载中...</Text>
        </View>
      );
    }
    const price = selectedSpec ? selectedSpec.price : serviceDetail.price;
    return (
      <ScrollView className="service-detail-page" scrollY>
        <Swiper className="image-swiper" indicatorDots autoplay circular>
          {(serviceDetail.images || [serviceDetail.image]).map((image, index) => (
            <SwiperItem key={index} onClick={() => this.previewImages(image)}>
              <Image className="service-image" src={image} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>
        <View className="service-info">
          <View className="price-section">
            <Text className="price-label">价格</Text>
            <Text className="price">¥{price}</Text>
            {serviceDetail.originalPrice && <Text className="original-price">¥{serviceDetail.originalPrice}</Text>}
          </View>
          <Text className="service-name">{serviceDetail.name}</Text>
          <View className="service-tags">
            {serviceDetail.tags && serviceDetail.tags.map((tag, index) => (
              <Text className="tag" key={index}>{tag}</Text>
            ))}
          </View>
          <View className="service-stats">
            <Text className="stat-item">已售 {serviceDetail.sales}</Text>
            <Text className="stat-item">好评 {serviceDetail.goodRate}%</Text>
          </View>
        </View>
        {serviceDetail.specs && serviceDetail.specs.length > 0 && (
          <View className="spec-section">
            <Text className="section-title">选择规格</Text>
            <View className="spec-list">
              {serviceDetail.specs.map((spec) => (
                <View
                  key={spec.id}
                  className={`spec-item ${selectedSpec?.id === spec.id ? 'active' : ''}`}
                  onClick={() => this.onSpecSelect(spec)}
                >
                  <Text className="spec-name">{spec.name}</Text>
                  <Text className="spec-price">¥{spec.price}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View className="quantity-section">
          <Text className="section-title">购买数量</Text>
          <View className="quantity-counter">
            <Button className="counter-btn" onClick={() => this.onQuantityChange(-1)}>-</Button>
            <Text className="quantity">{quantity}</Text>
            <Button className="counter-btn" onClick={() => this.onQuantityChange(1)}>+</Button>
          </View>
        </View>
        <View className="service-desc-section">
          <Text className="section-title">服务描述</Text>
          <Text className="description">{serviceDetail.description}</Text>
        </View>
        <View className="evaluation-section">
          <View className="section-header" onClick={this.goToEvaluationList}>
            <Text className="section-title">用户评价</Text>
            <Text className="more">查看全部</Text>
          </View>
          {evaluationList.length > 0 ? (
            <View className="evaluation-list">
              {evaluationList.map((evaluation) => (
                <View className="evaluation-item" key={evaluation.id}>
                  <View className="evaluation-header">
                    <Image className="avatar" src={evaluation.userAvatar} mode="aspectFill" />
                    <Text className="username">{evaluation.userName}</Text>
                    <Text className="rating">{'★'.repeat(evaluation.rating)}</Text>
                  </View>
                  <Text className="content">{evaluation.content}</Text>
                  <Text className="time">{evaluation.createTime}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="no-evaluation">暂无评价</Text>
          )}
        </View>
        <View className="bottom-action">
          <View className="action-icons">
            <View className="icon-item" onClick={this.toggleFavorite}>
              <Text className={`iconfont ${isFavorite ? 'icon-heart-fill' : 'icon-heart'}`}></Text>
              <Text className="icon-label">收藏</Text>
            </View>
            <View className="icon-item" onClick={this.goToElectricianList}>
              <Text className="iconfont icon-person"></Text>
              <Text className="icon-label">电工</Text>
            </View>
          </View>
          <View className="action-buttons">
            <Button className="btn-buy-now" onClick={this.goToCreateOrder}>立即预约</Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ServiceDetail;
```

### 3.3 前端核心代码 - 订单创建组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Input, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './create.scss';

class CreateOrder extends Taro.Component {
  state = {
    serviceId: null,
    serviceInfo: null,
    addressList: [],
    selectedAddress: null,
    selectedDate: '',
    selectedTime: '',
    remark: '',
    couponList: [],
    selectedCoupon: null,
    loading: false,
    totalPrice: 0,
  };

  componentDidMount(options) {
    const { serviceId, specId, quantity, price } = options || {};
    if (serviceId) {
      this.setState({ serviceId: parseInt(serviceId), totalPrice: parseFloat(price) || 0 });
      this.getServiceInfo(serviceId);
      this.getAddressList();
      this.getCouponList(serviceId);
    }
  }

  getServiceInfo = async (id) => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/item/${id}`,
      });
      if (res.data.code === 0) {
        this.setState({ serviceInfo: res.data.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  getAddressList = async () => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/addresses`,
      });
      if (res.data.code === 0) {
        const addresses = res.data.data || [];
        const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
        this.setState({ addressList: addresses, selectedAddress: defaultAddress });
      }
    } catch (error) {
      console.error(error);
    }
  };

  getCouponList = async (serviceId) => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/coupons`,
      });
      if (res.data.code === 0) {
        this.setState({ couponList: res.data.data || [] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onDateChange = (e) => {
    this.setState({ selectedDate: e.detail.value });
  };

  onTimeChange = (e) => {
    this.setState({ selectedTime: e.detail.value });
  };

  onRemarkChange = (e) => {
    this.setState({ remark: e.detail.value });
  };

  onCouponSelect = (coupon) => {
    this.setState({ selectedCoupon: coupon });
    this.calculateTotalPrice(coupon);
  };

  calculateTotalPrice = (coupon) => {
    const { totalPrice } = this.state;
    if (coupon) {
      const discount = Math.min(coupon.amount, totalPrice);
      this.setState({ totalPrice: totalPrice - discount });
    }
  };

  goToAddressList = () => {
    Taro.navigateTo({ url: '/pages/user/address?select=1' });
  };

  goToCouponList = () => {
    Taro.navigateTo({ url: '/pages/user/coupon?select=1' });
  };

  submitOrder = async () => {
    const { serviceId, selectedAddress, selectedDate, selectedTime, remark, selectedCoupon, loading } = this.state;
    if (loading) return;
    if (!selectedAddress) {
      Taro.showToast({ title: '请选择服务地址', icon: 'none' });
      return;
    }
    if (!selectedDate || !selectedTime) {
      Taro.showToast({ title: '请选择服务时间', icon: 'none' });
      return;
    }
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/create`,
        method: 'POST',
        data: {
          serviceId,
          addressId: selectedAddress.id,
          serviceDate: selectedDate,
          serviceTime: selectedTime,
          remark,
          couponId: selectedCoupon?.id,
        },
      });
      if (res.data.code === 0) {
        const orderId = res.data.data;
        Taro.navigateTo({
          url: `/pages/payment/pay?orderId=${orderId}`,
        });
      } else {
        Taro.showToast({ title: res.data.message || '创建订单失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '创建订单失败', icon: 'none' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { serviceInfo, addressList, selectedAddress, selectedDate, selectedTime, remark, couponList, selectedCoupon, loading, totalPrice } = this.state;
    return (
      <View className="create-order-page">
        <View className="address-section" onClick={this.goToAddressList}>
          {selectedAddress ? (
            <View className="address-info">
              <Text className="name">{selectedAddress.receiverName} {selectedAddress.phone}</Text>
              <Text className="address">{selectedAddress.province}{selectedAddress.city}{selectedAddress.district}{selectedAddress.detailAddress}</Text>
            </View>
          ) : (
            <Text className="add-address">请选择服务地址</Text>
          )}
          <Text className="arrow">></Text>
        </View>
        <View className="service-section">
          {serviceInfo && (
            <View className="service-item">
              <Image className="service-image" src={serviceInfo.image} mode="aspectFill" />
              <View className="service-info">
                <Text className="service-name">{serviceInfo.name}</Text>
                <Text className="service-price">¥{serviceInfo.price}</Text>
              </View>
            </View>
          )}
        </View>
        <View className="time-section">
          <Picker mode="date" onChange={this.onDateChange}>
            <View className="picker-item">
              <Text className="label">服务日期</Text>
              <Text className="value">{selectedDate || '请选择'}</Text>
            </View>
          </Picker>
          <Picker mode="time" onChange={this.onTimeChange}>
            <View className="picker-item">
              <Text className="label">服务时间</Text>
              <Text className="value">{selectedTime || '请选择'}</Text>
            </View>
          </Picker>
        </View>
        <View className="remark-section">
          <Text className="label">备注</Text>
          <Input className="remark-input" type="textarea" placeholder="请输入备注信息" value={remark} onInput={this.onRemarkChange} />
        </View>
        <View className="coupon-section" onClick={this.goToCouponList}>
          <Text className="label">优惠券</Text>
          <Text className="value">{selectedCoupon ? `-¥${selectedCoupon.amount}` : '请选择'}</Text>
          <Text className="arrow">></Text>
        </View>
        <View className="bottom-action">
          <View className="price-info">
            <Text className="label">合计：</Text>
            <Text className="price">¥{totalPrice}</Text>
          </View>
          <Button className="submit-btn" loading={loading} onClick={this.submitOrder}>
            提交订单
          </Button>
        </View>
      </View>
    );
  }
}

export default CreateOrder;
```

### 3.4 前端核心代码 - 个人资料组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Input, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './profile.scss';

class Profile extends Taro.Component {
  state = {
    userInfo: null,
    editing: false,
    nickname: '',
    gender: '',
    birthday: '',
    loading: false,
  };

  componentDidShow() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/info`,
      });
      if (res.data.code === 0) {
        const userInfo = res.data.data;
        this.setState({
          userInfo,
          nickname: userInfo.nickname,
          gender: userInfo.gender,
          birthday: userInfo.birthday,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onNicknameChange = (e) => {
    this.setState({ nickname: e.detail.value });
  };

  onGenderChange = (e) => {
    const genderList = ['', '男', '女', '保密'];
    this.setState({ gender: genderList[e.detail.value] });
  };

  onBirthdayChange = (e) => {
    this.setState({ birthday: e.detail.value });
  };

  toggleEdit = () => {
    const { editing, userInfo } = this.state;
    if (editing) {
      this.setState({
        nickname: userInfo.nickname,
        gender: userInfo.gender,
        birthday: userInfo.birthday,
      });
    }
    this.setState({ editing: !editing });
  };

  saveProfile = async () => {
    const { nickname, gender, birthday, loading } = this.state;
    if (loading) return;
    if (!nickname.trim()) {
      Taro.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/update`,
        method: 'PUT',
        data: { nickname, gender, birthday },
      });
      if (res.data.code === 0) {
        Taro.showToast({ title: '保存成功' });
        this.setState({ editing: false });
        this.getUserInfo();
      } else {
        Taro.showToast({ title: res.data.message || '保存失败', icon: 'none' });
      }
    } catch (error) {
      Taro.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      this.setState({ loading: false });
    }
  };

  changeAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0];
        try {
          const uploadRes = await Taro.uploadFile({
            url: `${Taro.getStorageSync('apiBaseUrl')}/api/file/upload/avatar`,
            filePath: tempFilePath,
            name: 'file',
          });
          if (uploadRes.statusCode === 200) {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 0) {
              Taro.showToast({ title: '头像上传成功' });
              this.getUserInfo();
            }
          }
        } catch (error) {
          Taro.showToast({ title: '上传失败', icon: 'none' });
        }
      },
    });
  };

  goToChangePassword = () => {
    Taro.navigateTo({ url: '/pages/user/changePassword' });
  };

  goToRealNameAuth = () => {
    Taro.navigateTo({ url: '/pages/user/realNameAuth' });
  };

  render() {
    const { userInfo, editing, nickname, gender, birthday, loading } = this.state;
    const genderIndex = gender === '男' ? 1 : gender === '女' ? 2 : 0;
    return (
      <View className="profile-page">
        <View className="header">
          <View className="avatar-section" onClick={this.changeAvatar}>
            <Image className="avatar" src={userInfo?.avatar || 'https://example.com/default-avatar.png'} mode="aspectFill" />
            <Text className="change-avatar">点击更换头像</Text>
          </View>
        </View>
        <View className="form-section">
          <View className="form-item">
            <Text className="label">昵称</Text>
            {editing ? (
              <Input className="input" value={nickname} onInput={this.onNicknameChange} placeholder="请输入昵称" />
            ) : (
              <Text className="value">{userInfo?.nickname || '未设置'}</Text>
            )}
          </View>
          <Picker mode="selector" range={['保密', '男', '女']} value={genderIndex} onChange={this.onGenderChange}>
            <View className="form-item">
              <Text className="label">性别</Text>
              {editing ? (
                <Text className="value">{gender || '请选择'}</Text>
              ) : (
                <Text className="value">{userInfo?.gender || '保密'}</Text>
              )}
            </View>
          </Picker>
          <Picker mode="date" value={birthday || '2000-01-01'} onChange={this.onBirthdayChange}>
            <View className="form-item">
              <Text className="label">生日</Text>
              {editing ? (
                <Text className="value">{birthday || '请选择'}</Text>
              ) : (
                <Text className="value">{userInfo?.birthday || '未设置'}</Text>
              )}
            </View>
          </Picker>
          <View className="form-item">
            <Text className="label">手机号</Text>
            <Text className="value">{userInfo?.phone || '未绑定'}</Text>
          </View>
          <View className="form-item">
            <Text className="label">实名认证</Text>
            <Text className="value">{userInfo?.realNameAuthStatus === 1 ? '已认证' : '未认证'}</Text>
          </View>
        </View>
        <View className="action-section">
          {editing ? (
            <View className="action-buttons">
              <Button className="btn-cancel" onClick={this.toggleEdit}>取消</Button>
              <Button className="btn-save" loading={loading} onClick={this.saveProfile}>保存</Button>
            </View>
          ) : (
            <Button className="btn-edit" onClick={this.toggleEdit}>编辑资料</Button>
          )}
        </View>
        <View className="menu-section">
          <View className="menu-item" onClick={this.goToChangePassword}>
            <Text className="label">修改密码</Text>
            <Text className="arrow">></Text>
          </View>
          <View className="menu-item" onClick={this.goToRealNameAuth}>
            <Text className="label">实名认证</Text>
            <Text className="arrow">></Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Profile;
```

### 3.5 前端核心代码 - 地址管理组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Switch, SwipeAction } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './address.scss';

class AddressList extends Taro.Component {
  state = {
    addressList: [],
    selectMode: false,
    loading: false,
  };

  componentDidMount(options) {
    const { select } = options || {};
    if (select === '1') {
      this.setState({ selectMode: true });
    }
    this.getAddressList();
  }

  getAddressList = async () => {
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/addresses`,
      });
      if (res.data.code === 0) {
        this.setState({ addressList: res.data.data || [], loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  goToAddAddress = () => {
    Taro.navigateTo({ url: '/pages/user/addressEdit' });
  };

  goToEditAddress = (id) => {
    Taro.navigateTo({ url: `/pages/user/addressEdit?id=${id}` });
  };

  selectAddress = (address) => {
    const { selectMode } = this.state;
    if (selectMode) {
      const pages = Taro.getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        prevPage.setData({ selectedAddress: address });
        prevPage.selectedAddress = address;
      }
      Taro.navigateBack();
    } else {
      this.goToEditAddress(address.id);
    }
  };

  deleteAddress = async (id) => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
    });
    if (confirm.confirm) {
      try {
        const res = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/address/${id}`,
          method: 'DELETE',
        });
        if (res.data.code === 0) {
          Taro.showToast({ title: '删除成功' });
          this.getAddressList();
        }
      } catch (error) {
        Taro.showToast({ title: '删除失败', icon: 'none' });
      }
    }
  };

  setDefaultAddress = async (id) => {
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/address/${id}/default`,
        method: 'PUT',
      });
      if (res.data.code === 0) {
        Taro.showToast({ title: '设置成功' });
        this.getAddressList();
      }
    } catch (error) {
      Taro.showToast({ title: '设置失败', icon: 'none' });
    }
  };

  render() {
    const { addressList, selectMode, loading } = this.state;
    return (
      <View className="address-list-page">
        {loading ? (
          <View className="loading">加载中...</View>
        ) : addressList.length > 0 ? (
          <View className="address-list">
            {addressList.map((address) => (
              <SwipeAction
                key={address.id}
                rightActions={[
                  { text: '编辑', onClick: () => this.goToEditAddress(address.id) },
                  { text: '删除', onClick: () => this.deleteAddress(address.id), style: { backgroundColor: '#ff4d4f' } },
                ]}
              >
                <View className="address-item" onClick={() => this.selectAddress(address)}>
                  <View className="address-info">
                    <View className="name-phone">
                      <Text className="name">{address.receiverName}</Text>
                      <Text className="phone">{address.phone}</Text>
                      {address.isDefault && <Text className="default-tag">默认</Text>}
                    </View>
                    <Text className="address-detail">
                      {address.province}{address.city}{address.district}{address.detailAddress}
                    </Text>
                  </View>
                  {!selectMode && (
                    <View className="address-actions">
                      <Switch
                        checked={address.isDefault}
                        onChange={() => this.setDefaultAddress(address.id)}
                        color="#1890ff"
                      />
                    </View>
                  )}
                </View>
              </SwipeAction>
            ))}
          </View>
        ) : (
          <View className="empty">
            <Text className="empty-text">暂无收货地址</Text>
          </View>
        )}
        <View className="add-button">
          <Button type="primary" onClick={this.goToAddAddress}>新增收货地址</Button>
        </View>
      </View>
    );
  }
}

export default AddressList;
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(additional_frontend)

print(f"已追加前端代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
