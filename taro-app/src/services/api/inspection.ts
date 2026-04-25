import { get, post } from './request';
import type {
  InspectionOrder,
  InspectionReport,
  InspectionQuota,
  PageResult
} from '../../types/api';

export interface CreateInspectionDTO {
  addressId: number;
  serviceType: string;
  description?: string;
  scheduledTime: string;
}

export interface SubmitReportDTO {
  orderId: number;
  report: {
    totalScore?: number;
    safetyLevel?: string;
    suggestions?: string;
  };
  items: {
    category: string;
    categoryName: string;
    itemName: string;
    testValue: string;
    standardValue: string;
    status: 'pass' | 'warn' | 'fail';
    score: number;
    description?: string;
    suggestion?: string;
  }[];
}

export const inspectionApi = {
  checkQuota: () => {
    return get<InspectionQuota>('/api/inspection/quota');
  },

  createOrder: (data: CreateInspectionDTO) => {
    return post<InspectionOrder>('/api/inspection/create', data);
  },

  getOrderList: (page: number = 1, pageSize: number = 10) => {
    return get<PageResult<InspectionOrder>>('/api/inspection/list', { page, pageSize });
  },

  getOrderDetail: (id: number) => {
    return get<InspectionOrder>(`/api/inspection/${id}`);
  },

  cancelOrder: (id: number) => {
    return post<void>(`/api/inspection/cancel/${id}`);
  },

  getReport: (orderId: number) => {
    return get<InspectionReport>(`/api/inspection/report/${orderId}`);
  },
};

export const electricianApi = {
  getPendingOrders: (page: number = 1, pageSize: number = 10) => {
    return get<PageResult<InspectionOrder>>('/api/electrician/pending', { page, pageSize });
  },

  acceptOrder: (id: number) => {
    return post<void>(`/api/electrician/accept/${id}`);
  },

  arriveOrder: (id: number) => {
    return post<void>(`/api/electrician/arrive/${id}`);
  },

  startInspection: (id: number) => {
    return post<void>(`/api/electrician/start/${id}`);
  },

  submitReport: (data: SubmitReportDTO) => {
    return post<void>('/api/electrician/report', data);
  },

  getMyTasks: (page: number = 1, pageSize: number = 10) => {
    return get<PageResult<InspectionOrder>>('/api/electrician/tasks', { page, pageSize });
  },

  getIncomeStats: (params?: { startDate?: string; endDate?: string }) => {
    return get<{ totalIncome: number; monthlyIncome: number; orderCount: number }>('/api/electrician/income', params);
  },
};
