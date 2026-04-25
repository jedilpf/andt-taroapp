import { get, post } from './request';
import type { RectificationOrder, PageResult } from '../../types/api';

export interface CreateRectificationDTO {
  reportId: number;
  items: number[];
}

export const rectificationApi = {
  // 创建整改订单（基于检测报告中的不合格项）
  create: (data: CreateRectificationDTO) => {
    return post<RectificationOrder>('/api/rectification/create', data);
  },

  // 获取整改订单列表
  getList: (page: number = 1, pageSize: number = 10) => {
    return get<PageResult<RectificationOrder>>('/api/rectification/list', { page, pageSize });
  },

  // 获取整改订单详情
  getDetail: (id: number) => {
    return get<RectificationOrder>(`/api/rectification/${id}`);
  },

  // 用户确认整改订单
  confirm: (id: number) => {
    return post<void>(`/api/rectification/confirm/${id}`);
  },

  // 电工开始整改
  start: (id: number) => {
    return post<void>(`/api/rectification/start/${id}`);
  },

  // 电工完成整改
  complete: (id: number) => {
    return post<void>(`/api/rectification/complete/${id}`);
  },

  // 用户支付整改订单
  pay: (id: number) => {
    return post<void>(`/api/rectification/pay/${id}`);
  },

  // 取消整改订单
  cancel: (id: number) => {
    return post<void>(`/api/rectification/cancel/${id}`);
  },
};
