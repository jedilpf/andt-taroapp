import Taro from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { Button, Input } from '@nutui/nutui-react-taro';
import { Location, User, Phone, Clock, Edit } from '@nutui/icons-react-taro';
import { useState, useEffect } from 'react';
import { inspectionApi } from '../../../services/api/inspection';
import { useUserStore } from '../../../store';
import './book.scss';

const Book = () => {
  const router = Taro.getCurrentInstance().router;
  const serviceType = (router?.params?.serviceType as string) || 'home';

  const { addressList, fetchAddressList, defaultAddress } = useUserStore();
  const [addressId, setAddressId] = useState<number>(0);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddressList();
  }, []);

  useEffect(() => {
    if (defaultAddress) {
      setAddressId(defaultAddress.id);
      setContactName(defaultAddress.contactName);
      setContactPhone(defaultAddress.contactPhone);
    }
  }, [defaultAddress]);

  const handleAddressChange = (e) => {
    const idx = e.detail.value;
    const addr = addressList[idx];
    if (addr) {
      setAddressId(addr.id);
      setContactName(addr.contactName);
      setContactPhone(addr.contactPhone);
    }
  };

  const handleSubmit = async () => {
    if (!addressId) {
      Taro.showToast({ title: '请选择服务地址', icon: 'none' });
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      Taro.showToast({ title: '请填写联系人信息', icon: 'none' });
      return;
    }
    if (!scheduledTime.trim()) {
      Taro.showToast({ title: '请填写预约时间', icon: 'none' });
      return;
    }

    setLoading(true);
    Taro.showLoading({ title: '提交中...' });
    try {
      await inspectionApi.createOrder({
        addressId,
        serviceType,
        description: description.trim() || undefined,
        scheduledTime,
      });
      Taro.hideLoading();
      Taro.showToast({ title: '预约成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/user/inspection/process' });
      }, 1500);
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({ title: '预约失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const addressDisplay = addressList.length > 0
    ? (() => {
        const addr = addressList.find(a => a.id === addressId);
        return addr
          ? `${addr.province || ''}${addr.city || ''}${addr.district || ''}${addr.detail || ''}`
          : '请选择服务地址';
      })()
    : '请先添加地址';

  return (
    <View className="book-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <Text className='title'>预约检测</Text>
          <Text className='subtitle'>填写信息，快速预约</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      <View className="form-section">
        <View className="form-item">
          <View className="label-wrap">
            <Location size={16} color="#E60012" />
            <Text className="label">服务地址</Text>
          </View>
          <Picker mode="selector" range={addressList} rangeKey="detail" onChange={handleAddressChange}>
            <View className="picker-input">
              <Text className={addressId ? 'picker-text' : 'picker-placeholder'}>{addressDisplay}</Text>
            </View>
          </Picker>
        </View>

        <View className="form-item">
          <View className="label-wrap">
            <User size={16} color="#E60012" />
            <Text className="label">联系人</Text>
          </View>
          <Input 
            placeholder="请输入联系人姓名" 
            value={contactName} 
            onChange={(value) => setContactName(value)} 
            className="nut-input-book"
          />
        </View>

        <View className="form-item">
          <View className="label-wrap">
            <Phone size={16} color="#E60012" />
            <Text className="label">联系电话</Text>
          </View>
          <Input 
            placeholder="请输入联系电话" 
            maxLength={11} 
            value={contactPhone} 
            onChange={(value) => setContactPhone(value)} 
            className="nut-input-book"
          />
        </View>

        <View className="form-item">
          <View className="label-wrap">
            <Clock size={16} color="#E60012" />
            <Text className="label">预约时间</Text>
          </View>
          <Input 
            placeholder="如：明天上午10点" 
            value={scheduledTime} 
            onChange={(value) => setScheduledTime(value)} 
            className="nut-input-book"
          />
        </View>

        <View className="form-item">
          <View className="label-wrap">
            <Edit size={16} color="#E60012" />
            <Text className="label">备注说明</Text>
          </View>
          <Input 
            placeholder="请描述您的需求（选填）" 
            value={description} 
            onChange={(value) => setDescription(value)} 
            className="nut-input-book"
          />
        </View>

        <Button 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit} 
          className="submit-btn"
          block
        >
          提交预约
        </Button>
      </View>
    </View>
  );
};

export default Book;
