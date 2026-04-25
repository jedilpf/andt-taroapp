import { post, get } from './request';
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  BindPhoneParams,
  ThirdPartyAuthInfo,
  UserBindInfo,
  SendCodeParams,
  UpdateUserInfoParams,
} from '../../types/auth';
import type { UserInfo } from '../../types/api';

export const authApi = {
  // 发送验证码
  sendCode: (params: SendCodeParams) => {
    return post<void>('/auth/code', params);
  },

  // 手机号登录
  login: (params: LoginParams) => {
    return post<LoginResult>('/auth/login', params);
  },

  // 手机号注册
  register: (params: RegisterParams) => {
    return post<LoginResult>('/auth/register', params);
  },

  // 微信登录（预留SDK接口）
  wechatLogin: (code: string) => {
    return post<LoginResult>('/auth/wechat/login', { code });
  },

  // 支付宝登录（预留SDK接口）
  alipayLogin: (authCode: string) => {
    return post<LoginResult>('/auth/alipay/login', { authCode });
  },

  // 绑定手机号
  bindPhone: (params: BindPhoneParams) => {
    return post<void>('/auth/bind/phone', params);
  },

  // 绑定微信（预留SDK接口）
  bindWechat: (code: string) => {
    return post<void>('/auth/bind/wechat', { code });
  },

  // 绑定支付宝（预留SDK接口）
  bindAlipay: (authCode: string) => {
    return post<void>('/auth/bind/alipay', { authCode });
  },

  // 解绑微信
  unbindWechat: () => {
    return post<void>('/auth/unbind/wechat');
  },

  // 解绑支付宝
  unbindAlipay: () => {
    return post<void>('/auth/unbind/alipay');
  },

  // 获取用户绑定信息
  getBindInfo: () => {
    return get<UserBindInfo>('/auth/bind/info');
  },

  // 刷新Token
  refreshToken: (refreshToken: string) => {
    return post<{ token: string; refreshToken: string; expiresIn: number }>(
      '/auth/refresh',
      { refreshToken }
    );
  },

  // 退出登录
  logout: () => {
    return post<void>('/auth/logout');
  },

  // 更新用户信息
  updateUserInfo: (params: UpdateUserInfoParams) => {
    return post<UserInfo>('/auth/user/update', params);
  },
};
