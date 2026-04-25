import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
---

## 第十一部分 微信小程序特有功能

## 11.1 微信登录与支付

```typescript
import Taro from '@tarojs/taro';
import { login, getUserProfile, requestPayment, getProvider } from '@tarojs/plugin-platform';

export class WechatAuthService {

  static async login(): Promise<LoginResult> {
    try {
      const code = await login();
      const res = await Api.wxLogin({ code });
      if (res.success) {
        Taro.setStorageSync('token', res.data.token);
        Taro.setStorageSync('userInfo', res.data.userInfo);
        return res.data;
      }
      throw new Error(res.message || '登录失败');
    } catch (error) {
      console.error('微信登录失败', error);
      throw error;
    }
  }

  static async getUserProfile(): Promise<UserProfileResult> {
    try {
      const userProfile = await getUserProfile({
        desc: '用于完善用户资料'
      });
      return userProfile;
    } catch (error) {
      console.error('获取用户信息失败', error);
      throw error;
    }
  }

  static async updateUserInfo(userInfo: any): Promise<void> {
    const token = Taro.getStorageSync('token');
    await Api.updateUserInfo({
      avatar: userInfo.avatarUrl,
      nickname: userInfo.nickName,
      gender: userInfo.gender
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
  }

  static getPhoneNumber(encryptedData: string, iv: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = Taro.getStorageSync('token');
        const res = await Api.getPhoneNumber({
          encryptedData,
          iv
        }, {
          header: { Authorization: `Bearer ${token}` }
        });
        if (res.success) {
          resolve(res.data.phone);
        } else {
          reject(new Error(res.message));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class WechatPaymentService {

  static async createPayment(orderId: number, amount: number): Promise<PaymentParams> {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Api.createPayment({
        orderId,
        payType: 1
      }, {
        header: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message || '创建支付失败');
    } catch (error) {
      console.error('创建微信支付失败', error);
      throw error;
    }
  }

  static async pay(paymentParams: PaymentParams): Promise<PayResult> {
    try {
      const result = await requestPayment({
        timeStamp: paymentParams.timeStamp,
        nonceStr: paymentParams.nonceStr,
        package: paymentParams.package,
        signType: paymentParams.signType,
        paySign: paymentParams.paySign
      });
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('微信支付失败', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async payOrder(orderId: number): Promise<void> {
    const paymentParams = await this.createPayment(orderId, 0);
    const payResult = await this.pay(paymentParams);
    if (!payResult.success) {
      throw new Error(payResult.error || '支付失败');
    }
    await Api.confirmPayment(orderId);
  }

  static async queryPaymentStatus(orderId: number): Promise<number> {
    const token = Taro.getStorageSync('token');
    const res = await Api.queryPaymentStatus(orderId, {
      header: { Authorization: `Bearer ${token}` }
    });
    return res.data.status;
  }
}

export class WechatLocationService {

  static async getLocation(): Promise<Location> {
    try {
      const result = await Taro.getLocation({
        type: 'wgs84'
      });
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        speed: result.speed,
        accuracy: result.accuracy
      };
    } catch (error) {
      console.error('获取位置失败', error);
      throw error;
    }
  }

  static async chooseLocation(): Promise<ChooseLocationResult> {
    try {
      const result = await Taro.chooseLocation({
        type: 'wgs84'
      });
      return {
        name: result.name,
        address: result.address,
        latitude: result.latitude,
        longitude: result.longitude
      };
    } catch (error) {
      console.error('选择位置失败', error);
      throw error;
    }
  }

  static async openLocation(latitude: number, longitude: number, name?: string, address?: string): Promise<void> {
    await Taro.openLocation({
      latitude,
      longitude,
      name: name || '',
      address: address || ''
    });
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 1000);
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export class WechatShareService {

  static onShareAppMessage(options?: ShareOptions): void {
    const token = Taro.getStorageSync('token');
    const userInfo = Taro.getStorageSync('userInfo') || {};

    Taro.onShareAppMessage(() => {
      return {
        title: options?.title || '安电通-家庭用电安全服务平台',
        path: options?.path || '/pages/index/index?referrer=' + (userInfo.id || ''),
        imageUrl: options?.imageUrl || 'https://andiantong.com/share.png'
      };
    });
  }

  static onShareTimeline(): void {
    Taro.onShareTimeline(() => {
      return {
        title: '安电通-家庭用电安全服务平台',
        query: 'from=timeline',
        imageUrl: 'https://andiantong.com/share.png'
      };
    });
  }

  static async shareFriend(): Promise<void> {
    const token = Taro.getStorageSync('token');
    await Api.shareSuccess({
      type: 'friend'
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
  }
}

export class WechatNotifyService {

  static async requestNotifyPermission(): Promise<boolean> {
    try {
      const result = await Taro.getSetting();
      if (!result.authSetting['scope.notify']) {
        const authResult = await Taro.authorize({
          scope: 'scope.notify'
        });
        return authResult.errMsg === 'authorize:ok';
      }
      return true;
    } catch (error) {
      console.error('请求通知权限失败', error);
      return false;
    }
  }

  static async subscribeMessage(templateId: string): Promise<boolean> {
    try {
      const result = await Taro.requestSubscribeMessage({
        tmplIds: [templateId]
      });
      return result[templateId] === 'accept';
    } catch (error) {
      console.error('订阅消息失败', error);
      return false;
    }
  }

  static async subscribeOrderNotify(orderId: number): Promise<void> {
    const templateId = 'ORDER_NOTIFY_TEMPLATE_ID';
    const hasPermission = await this.subscribeMessage(templateId);
    if (hasPermission) {
      const token = Taro.getStorageSync('token');
      await Api.subscribeOrderNotify({
        orderId,
        templateId
      }, {
        header: { Authorization: `Bearer ${token}` }
      });
    }
  }

  static async subscribeElectricianNotify(electricianId: number): Promise<void> {
    const templateId = 'ELECTRICIAN_NOTIFY_TEMPLATE_ID';
    const hasPermission = await this.subscribeMessage(templateId);
    if (hasPermission) {
      const token = Taro.getStorageSync('token');
      await Api.subscribeElectricianNotify({
        electricianId,
        templateId
      }, {
        header: { Authorization: `Bearer ${token}` }
      });
    }
  }
}
```

## 11.2 微信小程序分享与扫码

```typescript
import Taro from '@tarojs/taro';
import { scanCode } from '@tarojs/plugin-platform';

export class WechatScanService {

  static async scanQRCode(): Promise<ScanResult> {
    try {
      const result = await scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode', 'barCode']
      });
      return {
        result: result.result,
        scanType: result.scanType,
        charSet: result.charSet,
        path: result.path
      };
    } catch (error) {
      console.error('扫码失败', error);
      throw error;
    }
  }

  static async scanOrderQRCode(): Promise<number> {
    const scanResult = await this.scanQRCode();
    const orderId = this.parseQRCode(scanResult.result);
    return orderId;
  }

  static parseQRCode(content: string): number {
    try {
      const data = JSON.parse(content);
      if (data.type === 'order' && data.id) {
        return data.id;
      }
      if (data.type === 'electrician' && data.id) {
        return data.id;
      }
      const match = content.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    } catch {
      const match = content.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
  }

  static generateQRCodeData(type: string, id: number): string {
    return JSON.stringify({ type, id, timestamp: Date.now() });
  }
}

export class WechatAIService {

  static async voiceToText(filePath: string): Promise<string> {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Taro.uploadFile({
        url: 'https://api.weixin.qq.com/cdn/get',
        filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = JSON.parse(res.data);
      if (data.errcode === 0) {
        return data.content;
      }
      throw new Error(data.errmsg || '语音转文字失败');
    } catch (error) {
      console.error('语音转文字失败', error);
      throw error;
    }
  }

  static async textToVoice(text: string): Promise<string> {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Api.textToVoice({
        text
      }, {
        header: { Authorization: `Bearer ${token}` }
      });
      return res.data.url;
    } catch (error) {
      console.error('文字转语音失败', error);
      throw error;
    }
  }

  static async imageRecognition(imagePath: string): Promise<RecognitionResult> {
    try {
      const token = Taro.getStorageSync('token');
      const res = await Api.imageRecognition({
        image: imagePath
      }, {
        header: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('图片识别失败', error);
      throw error;
    }
  }
}

export class WechatDeviceService {

  static async getSystemInfo(): Promise<SystemInfo> {
    const result = await Taro.getSystemInfo();
    return {
      brand: result.brand,
      model: result.model,
      system: result.system,
      platform: result.platform,
      version: result.version,
      screenWidth: result.screenWidth,
      screenHeight: result.screenHeight,
      windowWidth: result.windowWidth,
      windowHeight: result.windowHeight,
      statusBarHeight: result.statusBarHeight,
      navigationBarHeight: result.navigationBarHeight
    };
  }

  static async getNetworkType(): Promise<string> {
    const result = await Taro.getNetworkType();
    return result.networkType;
  }

  static async onNetworkStatusChange(callback: (res: NetworkStatusChange) => void): Promise<void> {
    Taro.onNetworkStatusChange(callback);
  }

  static async makePhoneCall(phoneNumber: string): Promise<void> {
    await Taro.makePhoneCall({ phoneNumber });
  }

  static async setClipboardData(text: string): Promise<void> {
    await Taro.setClipboardData({ data: text });
  }

  static async getClipboardData(): Promise<string> {
    const result = await Taro.getClipboardData();
    return result.data;
  }

  static async saveImageToPhotosAlbum(filePath: string): Promise<void> {
    await Taro.saveImageToPhotosAlbum({ filePath });
  }

  static async saveVideoToPhotosAlbum(filePath: string): Promise<void> {
    await Taro.saveVideoToPhotosAlbum({ filePath });
  }

  static vibrateShort(): void {
    Taro.vibrateShort();
  }

  static vibrateLong(): void {
    Taro.vibrateLong();
  }
}
```

## 11.3 电工端特有功能

```typescript
import Taro from '@tarojs/taro';
import { chooseVideo, chooseImage, uploadFile, getLocation } from '@tarojs/plugin-platform';

export class ElectricianService {

  static async grabOrder(orderId: number): Promise<void> {
    const token = Taro.getStorageSync('token');
    const res = await Api.grabOrder(orderId, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '抢单失败');
    }
  }

  static async acceptOrder(orderId: number): Promise<void> {
    const token = Taro.getStorageSync('token');
    const res = await Api.acceptOrder(orderId, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '接单失败');
    }
  }

  static async startService(orderId: number): Promise<void> {
    const token = Taro.getStorageSync('token');
    const location = await getLocation({
      type: 'wgs84'
    });
    const res = await Api.startService({
      orderId,
      latitude: location.latitude,
      longitude: location.longitude
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '开始服务失败');
    }
  }

  static async completeService(orderId: number, serviceContent: string, images: string[]): Promise<void> {
    const token = Taro.getStorageSync('token');
    const location = await getLocation({
      type: 'wgs84'
    });
    const res = await Api.completeService({
      orderId,
      serviceContent,
      images,
      latitude: location.latitude,
      longitude: location.longitude
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '完成服务失败');
    }
  }

  static async uploadServiceImage(): Promise<string[]> {
    const imageRes = await chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    });
    const token = Taro.getStorageSync('token');
    const imageUrls: string[] = [];
    for (const tempFilePath of imageRes.tempFilePaths) {
      const uploadRes = await uploadFile({
        url: `${API_BASE_URL}/api/file/upload`,
        filePath: tempFilePath,
        name: 'file',
        header: { Authorization: `Bearer ${token}` }
      });
      const data = JSON.parse(uploadRes.data);
      if (data.success) {
        imageUrls.push(data.data.url);
      }
    }
    return imageUrls;
  }

  static async uploadServiceVideo(): Promise<string> {
    const videoRes = await chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back'
    });
    const token = Taro.getStorageSync('token');
    const uploadRes = await uploadFile({
      url: `${API_BASE_URL}/api/file/upload`,
      filePath: videoRes.tempFilePath,
      name: 'file',
      header: { Authorization: `Bearer ${token}` }
    });
    const data = JSON.parse(uploadRes.data);
    if (data.success) {
      return data.data.url;
    }
    throw new Error('视频上传失败');
  }

  static async getNearbyOrders(radius: number = 5000): Promise<Order[]> {
    const location = await getLocation({
      type: 'wgs84'
    });
    const token = Taro.getStorageSync('token');
    const res = await Api.getNearbyOrders({
      latitude: location.latitude,
      longitude: location.longitude,
      radius
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || '获取订单失败');
  }

  static async calculateRoute(destination: { latitude: number; longitude: number }): Promise<void> {
    const location = await getLocation({
      type: 'wgs84'
    });
    await Taro.openLocation({
      latitude: destination.latitude,
      longitude: destination.longitude,
      name: '服务地点',
      scale: 18
    });
  }

  static async getTodaySchedule(): Promise<Schedule[]> {
    const token = Taro.getStorageSync('token');
    const res = await Api.getTodaySchedule({
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || '获取日程失败');
  }

  static async updateLocation(): Promise<void> {
    const token = Taro.getStorageSync('token');
    const location = await getLocation({
      type: 'wgs84'
    });
    await Api.updateLocation({
      latitude: location.latitude,
      longitude: location.longitude
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
  }

  static startLocationWatch(callback: (location: Location) => void): void {
    const watchId = Taro.watchLocationChange((location) => {
      callback({
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        accuracy: location.accuracy
      });
    });
    Taro.setStorageSync('locationWatchId', watchId);
  }

  static stopLocationWatch(): void {
    const watchId = Taro.getStorageSync('locationWatchId');
    if (watchId) {
      Taro.clearWatch({ watchId });
      Taro.removeStorageSync('locationWatchId');
    }
  }
}

export class WalletService {

  static async getWalletInfo(): Promise<WalletInfo> {
    const token = Taro.getStorageSync('token');
    const res = await Api.getWalletInfo({
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || '获取钱包信息失败');
  }

  static async withdraw(amount: number, bankCardId: number): Promise<void> {
    const token = Taro.getStorageSync('token');
    const res = await Api.withdraw({
      amount,
      bankCardId
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '提现失败');
    }
  }

  static async getIncomeHistory(startDate: string, endDate: string, page: number, pageSize: number): Promise<IncomeRecord[]> {
    const token = Taro.getStorageSync('token');
    const res = await Api.getIncomeHistory({
      startDate,
      endDate,
      page,
      pageSize
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data.records;
    }
    throw new Error(res.message || '获取收入记录失败');
  }

  static async getWithdrawHistory(page: number, pageSize: number): Promise<WithdrawRecord[]> {
    const token = Taro.getStorageSync('token');
    const res = await Api.getWithdrawHistory({
      page,
      pageSize
    }, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data.records;
    }
    throw new Error(res.message || '获取提现记录失败');
  }

  static async addBankCard(bankCard: BankCard): Promise<void> {
    const token = Taro.getStorageSync('token');
    const res = await Api.addBankCard(bankCard, {
      header: { Authorization: `Bearer ${token}` }
    });
    if (!res.success) {
      throw new Error(res.message || '添加银行卡失败');
    }
  }

  static async getBankCardList(): Promise<BankCard[]> {
    const token = Taro.getStorageSync('token');
    const res = await Api.getBankCardList({
      header: { Authorization: `Bearer ${token}` }
    });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || '获取银行卡列表失败');
  }
}
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
