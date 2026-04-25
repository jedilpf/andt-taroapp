import { create } from 'zustand';
import type { InspectionOrder, InspectionReport, InspectionQuota, RectificationOrder } from '../types/api';
import { inspectionApi } from '../services/api/inspection';
import { rectificationApi } from '../services/api/order';

interface InspectionState {
  quota: InspectionQuota | null;
  currentOrder: InspectionOrder | null;
  currentReport: InspectionReport | null;
  orderList: InspectionOrder[];
  rectificationOrders: RectificationOrder[];
  currentRectification: RectificationOrder | null;

  setQuota: (quota: InspectionQuota) => void;
  setCurrentOrder: (order: InspectionOrder | null) => void;
  setCurrentReport: (report: InspectionReport | null) => void;
  setOrderList: (list: InspectionOrder[]) => void;

  fetchQuota: () => Promise<void>;
  fetchOrderDetail: (id: number) => Promise<void>;
  fetchReport: (orderId: number) => Promise<void>;
  fetchOrderList: (page?: number) => Promise<void>;
  fetchRectificationOrders: (page?: number) => Promise<void>;
  fetchRectificationDetail: (id: number) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useInspectionStore = create<InspectionState>((set, get) => ({
  quota: null,
  currentOrder: null,
  currentReport: null,
  orderList: [],
  rectificationOrders: [],
  currentRectification: null,

  setQuota: (quota) => set({ quota }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setCurrentReport: (report) => set({ currentReport: report }),
  setOrderList: (list) => set({ orderList: list }),

  fetchQuota: async () => {
    try {
      const quota = await inspectionApi.checkQuota();
      set({ quota });
    } catch (error) {
      console.error('获取检测资格失败:', error);
    }
  },

  fetchOrderDetail: async (id) => {
    try {
      const order = await inspectionApi.getOrderDetail(id);
      set({ currentOrder: order });
    } catch (error) {
      console.error('获取订单详情失败:', error);
    }
  },

  fetchReport: async (orderId) => {
    try {
      const report = await inspectionApi.getReport(orderId);
      set({ currentReport: report });
    } catch (error) {
      console.error('获取检测报告失败:', error);
    }
  },

  fetchOrderList: async (page = 1) => {
    try {
      const result = await inspectionApi.getOrderList(page);
      if (page === 1) {
        set({ orderList: result.list });
      } else {
        set({ orderList: [...get().orderList, ...result.list] });
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    }
  },

  fetchRectificationOrders: async (page = 1) => {
    try {
      const result = await rectificationApi.getList(page);
      if (page === 1) {
        set({ rectificationOrders: result.list });
      } else {
        set({ rectificationOrders: [...get().rectificationOrders, ...result.list] });
      }
    } catch (error) {
      console.error('获取整改订单列表失败:', error);
    }
  },

  fetchRectificationDetail: async (id) => {
    try {
      const order = await rectificationApi.getDetail(id);
      set({ currentRectification: order });
    } catch (error) {
      console.error('获取整改订单详情失败:', error);
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null, currentReport: null, currentRectification: null });
  },
}));
