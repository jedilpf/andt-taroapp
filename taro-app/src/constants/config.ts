// H5 mode: empty string so requests use relative paths matched by devServer proxy
// Mini-program mode: set to the actual backend gateway URL (e.g. 'https://api.andiantong.com')
export const API_BASE_URL = '';

export const APP_VERSION = '1.0.0';

export const PAGE_SIZE = 10;

export const ORDER_STATUS_MAP: Record<string, string> = {
  PENDING: '待接单',
  ACCEPTED: '已接单',
  ARRIVED: '已到达',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
  CONFIRMED: '已确认',
};

export const RECTIFICATION_STATUS_MAP: Record<string, string> = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  IN_PROGRESS: '整改中',
  COMPLETED: '已完成',
  PAID: '已支付',
  CANCELLED: '已取消',
};

export const SAFETY_LEVEL_MAP: Record<string, string> = {
  excellent: '优秀',
  good: '良好',
  warning: '预警',
  danger: '危险'
};

export const ITEM_STATUS_MAP: Record<string, string> = {
  pass: '合格',
  warn: '警告',
  fail: '不合格'
};
