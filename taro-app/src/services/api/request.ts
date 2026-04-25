import Taro from '@tarojs/taro';
import { API_BASE_URL } from '../../constants/config';
import type { ApiResponse } from '../../types/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  header?: Record<string, string>;
}

const request = <T>(options: RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = Taro.getStorageSync('token');
    
    Taro.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.header,
      },
      success: (res) => {
        const data = res.data as ApiResponse<T>;
        if (data.code === 200) {
          resolve(data.data);
        } else if (data.code === 401) {
          // Let the caller handle 401 (e.g. app.tsx will try token refresh).
          // Do not hard-redirect here; the auth flow in app.tsx manages redirects.
          reject(new Error(data.message || '登录已过期'));
        } else {
          Taro.showToast({
            title: data.message || '请求失败',
            icon: 'none',
          });
          reject(new Error(data.message));
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
};

export const get = <T>(url: string, params?: unknown): Promise<T> => {
  return request<T>({
    url: params ? `${url}?${new URLSearchParams(params as Record<string, string>)}` : url,
    method: 'GET',
  });
};

export const post = <T>(url: string, data?: unknown): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
  });
};

export const put = <T>(url: string, data?: unknown): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
  });
};

export const del = <T>(url: string): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
  });
};

export default request;
