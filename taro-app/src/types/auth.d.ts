export type { UserInfo, AddressInfo } from './api';

export interface LoginParams {
  phone: string;
  code: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: import('./api').UserInfo;
  isNewUser: boolean;
  needBindPhone: boolean;
}

export interface RegisterParams {
  phone: string;
  code: string;
  username?: string;
  avatar?: string;
}

export interface BindPhoneParams {
  phone: string;
  code: string;
  bindType: 'phone' | 'wechat' | 'alipay';
  openId: string;
}

export interface ThirdPartyAuthInfo {
  openId: string;
  unionId?: string;
  nickname?: string;
  avatar?: string;
  platform: 'wechat' | 'alipay';
}

export interface UserBindInfo {
  phone?: string;
  wechatBound: boolean;
  alipayBound: boolean;
  wechatInfo?: {
    nickname?: string;
    avatar?: string;
    bindTime: string;
  };
  alipayInfo?: {
    nickname?: string;
    avatar?: string;
    bindTime: string;
  };
}

export interface SendCodeParams {
  phone: string;
  type: 'login' | 'register' | 'bind' | 'reset';
}

export interface UpdateUserInfoParams {
  username?: string;
  avatar?: string;
}
