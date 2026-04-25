import { get, post } from './request';
import type { UserInfo, AddressInfo, ApiResponse } from '../../types/api';

export const userApi = {
  login: (phone: string, code: string) => {
    return post<{ token: string; userInfo: UserInfo }>('/user/login', { phone, code });
  },

  getUserInfo: () => {
    return get<UserInfo>('/user/info');
  },

  updateUserInfo: (data: Partial<UserInfo>) => {
    return post<UserInfo>('/user/update', data);
  },

  getAddressList: () => {
    return get<AddressInfo[]>('/user/address/list');
  },

  addAddress: (data: Omit<AddressInfo, 'id' | 'userId'>) => {
    return post<AddressInfo>('/user/address/add', data);
  },

  updateAddress: (id: number, data: Partial<AddressInfo>) => {
    return post<AddressInfo>(`/user/address/update/${id}`, data);
  },

  deleteAddress: (id: number) => {
    return post<void>(`/user/address/delete/${id}`);
  },

  setDefaultAddress: (id: number) => {
    return post<void>(`/user/address/default/${id}`);
  },
};
