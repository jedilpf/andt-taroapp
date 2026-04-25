import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { UserInfo, AddressInfo } from '../types/api';
import type { LoginResult } from '../types/auth';
import { authApi } from '../services/api/auth';
import { userApi } from '../services/api/user';

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  addressList: AddressInfo[];
  defaultAddress: AddressInfo | null;
  bindInfo: {
    wechatBound: boolean;
    alipayBound: boolean;
  } | null;

  setUserInfo: (info: UserInfo) => void;
  setToken: (token: string, refreshToken?: string) => void;
  login: (result: LoginResult) => void;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  fetchBindInfo: () => Promise<void>;
  fetchAddressList: () => Promise<void>;
  setDefaultAddress: (addressId: number) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

// Derived selector: isLogin is always computed from token
export const selectIsLogin = (state: UserState) => !!state.token;

export const useUserStore = create<UserState>((set, get) => ({
  userInfo: null,
  token: Taro.getStorageSync('token') || null,
  refreshToken: Taro.getStorageSync('refreshToken') || null,
  addressList: [],
  defaultAddress: null,
  bindInfo: null,

  setUserInfo: (info) => set({ userInfo: info }),

  setToken: (token, refreshToken?) => {
    Taro.setStorageSync('token', token);
    const updates: Partial<UserState> = { token };
    if (refreshToken) {
      Taro.setStorageSync('refreshToken', refreshToken);
      updates.refreshToken = refreshToken;
    }
    set(updates);
  },

  login: (result) => {
    Taro.setStorageSync('token', result.token);
    Taro.setStorageSync('refreshToken', result.refreshToken);
    set({
      token: result.token,
      refreshToken: result.refreshToken,
      userInfo: result.userInfo,
    });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('refreshToken');
    set({
      token: null,
      refreshToken: null,
      userInfo: null,
      addressList: [],
      defaultAddress: null,
      bindInfo: null
    });
  },

  refreshAccessToken: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) {
      return false;
    }
    try {
      const result = await authApi.refreshToken(refreshToken);
      Taro.setStorageSync('token', result.token);
      Taro.setStorageSync('refreshToken', result.refreshToken);
      set({
        token: result.token,
        refreshToken: result.refreshToken
      });
      return true;
    } catch (error) {
      console.error('刷新token失败:', error);
      get().logout();
      return false;
    }
  },

  fetchBindInfo: async () => {
    try {
      const bindInfo = await authApi.getBindInfo();
      set({ bindInfo });
    } catch (error) {
      console.error('获取绑定信息失败:', error);
    }
  },

  fetchUserInfo: async () => {
    const userInfo = await userApi.getUserInfo();
    set({ userInfo });
  },

  fetchAddressList: async () => {
    try {
      const list = await userApi.getAddressList();
      const defaultAddr = list.find(item => item.isDefault) || list[0] || null;
      set({ addressList: list, defaultAddress: defaultAddr });
    } catch (error) {
      console.error('获取地址列表失败:', error);
    }
  },

  setDefaultAddress: async (addressId: number) => {
    try {
      await userApi.setDefaultAddress(addressId);
      const list = get().addressList;
      const updatedList = list.map(item => ({
        ...item,
        isDefault: item.id === addressId
      }));
      const defaultAddr = updatedList.find(item => item.id === addressId) || null;
      set({ addressList: updatedList, defaultAddress: defaultAddr });
    } catch (error) {
      console.error('设置默认地址失败:', error);
    }
  },
}));
