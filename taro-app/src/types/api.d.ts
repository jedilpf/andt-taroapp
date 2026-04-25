export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserInfo {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'electrician' | 'admin';
  status: number;
  createTime: string;
}

export interface AddressInfo {
  id: number;
  userId: number;
  province: string;
  city: string;
  district: string;
  detail: string;
  contactName: string;
  contactPhone: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAID'
  | 'CANCELLED';

export interface InspectionOrder {
  id: number;
  orderNo: string;
  userId: number;
  electricianId?: number;
  addressId: number;
  address?: AddressInfo;
  serviceType: string;
  description?: string;
  scheduledTime: string;
  status: OrderStatus;
  reportId?: number;
  price: number;
  isFree: boolean;
  createTime: string;
}

export type SafetyLevel = 'excellent' | 'good' | 'warning' | 'danger';

export interface InspectionReport {
  id: number;
  reportNo: string;
  orderId: number;
  userId: number;
  electricianId?: number;
  totalScore: number;
  safetyLevel: SafetyLevel;
  hazardCount: number;
  reportData: InspectionItem[];
  suggestions?: string;
  reportTime: string;
}

export type ItemStatus = 'pass' | 'warn' | 'fail';

export interface InspectionItem {
  id: number;
  reportId: number;
  category: string;
  categoryName: string;
  itemName: string;
  testValue: string;
  standardValue: string;
  status: ItemStatus;
  score: number;
  description?: string;
  suggestion?: string;
}

export type QuotaType = 'first_free' | 'vip_free';

export interface InspectionQuota {
  id: number;
  userId: number;
  quotaType: QuotaType;
  totalCount: number;
  usedCount: number;
  remainingCount: number;
  expireTime?: string;
}

// 整改订单状态
export type RectificationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAID'
  | 'CANCELLED';

// 整改材料项
export interface RectificationMaterial {
  name: string;
  qty: number;
  price: number;
}

// 整改订单
export interface RectificationOrder {
  id: number;
  orderNo: string;
  inspectionReportId: number;
  userId: number;
  electricianId?: number;
  materials?: RectificationMaterial[];
  materialAmount: number;
  laborAmount: number;
  totalAmount: number;
  pointsDiscount: number;
  finalAmount: number;
  status: RectificationStatus;
  createTime: string;
  updateTime: string;
}
