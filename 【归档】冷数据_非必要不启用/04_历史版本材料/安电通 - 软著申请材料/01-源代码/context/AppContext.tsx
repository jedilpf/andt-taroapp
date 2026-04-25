/**
 * 安电通上门电工服务系统
 * Copyright © 2026 米枫网络科技. All rights reserved.
 * 
 * 本软件为原创开发，受中华人民共和国著作权法保护。
 * 
 * 文件名：AppContext.tsx
 * 功能描述：全局状态管理，管理用户、订单、通知等状态
 * 创建日期：2026-02-28
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Order, OrderStatus, UserProfile, Location, AppNotification, SpecialIdentity } from '../types';

export interface AddressItem {
  id: string;
  tag: string;
  address: string;
  detail: string;
  name: string;
  gender: string;
  phone: string;
  isDefault: boolean;
}

export interface ExtendedUserProfile extends UserProfile {
    points: number;
    isFirstPurchase: boolean;
}

const DEFAULT_ADDRESS = '上海市徐汇区天钥桥路 333 号 602室';
const DEFAULT_COORDS = { lat: 31.1940, lng: 121.4360 };

const INITIAL_MOCK_ORDERS: any[] = [
    {
        id: '24112601',
        title: '安电通服务驿站 (天钥桥店)',
        type: 'Install',
        images: ['https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=400&h=400&fit=crop'],
        status: OrderStatus.PAID,
        createdAt: 1732602000000, 
        scheduledTime: '2024-11-26 14:20',
        location: { ...DEFAULT_COORDS, address: DEFAULT_ADDRESS },
        priceEstimate: { 
            min: 128, max: 128, final: 128,
            breakdown: { material: 88, labor: 40, trip: 0 } 
        },
        items: [
            { name: '施耐德 1P+N 断路器', qty: 1, price: 42.5 },
            { name: '加厚绝缘接线端子', qty: 2, price: 22.75 },
            { name: '上门勘测与更换服务', qty: 1, price: 40 }
        ],
        clientId: 'u1',
        clientName: '李女士',
        electricianId: 'e1',
        electricianName: '王师傅',
        pointsReward: 128,
        description: '下单：2024-11-26'
    }
];

const MOCK_USER: ExtendedUserProfile = {
  id: 'u1', name: '李女士 (业主)', role: UserRole.USER, phone: '13800138000', 
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li&backgroundColor=ffdfbf',
  verified: true, rating: 4.8,
  points: 2580, 
  balance: 128.50,
  isFirstPurchase: true, 
  identityStatus: 'VERIFIED',
  specialIdentity: SpecialIdentity.NONE,
  location: { ...DEFAULT_COORDS, address: DEFAULT_ADDRESS }
};

const MOCK_ELEC: ExtendedUserProfile = {
  id: 'e1', name: '王师傅 (金牌电工)', role: UserRole.ELECTRICIAN, phone: '13900139000',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangMaster&backgroundColor=b6e3f4',
  verified: true, rating: 4.9,
  points: 500,
  balance: 1250.00,
  isFirstPurchase: false,
  identityStatus: 'VERIFIED',
  location: { lat: 31.1960, lng: 121.4380, address: '上海市徐汇区' }
};

interface AppContextType {
  currentUser: ExtendedUserProfile | null;
  role: UserRole;
  orders: any[];
  messages: AppNotification[];
  addresses: AddressItem[];
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  createOrder: (order: Partial<Order>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateUserLocation: (location: Location) => void;
  earnPoints: (amount: number, isFirstPurchaseBonus?: boolean) => void;
  spendPoints: (points: number) => void;
  addAddress: (addr: Omit<AddressItem, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<AddressItem>) => void;
  deleteAddress: (id: string) => void;
  markAllMessagesRead: () => void;
  submitVerification: (data: any) => void;
  updateSpecialIdentity: (identity: SpecialIdentity) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const isNumeric = (val: any) => {
    const n = Number(val);
    return typeof n === 'number' && !isNaN(n) && isFinite(n);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ExtendedUserProfile | null>(() => {
    try {
        const saved = sessionStorage.getItem('currentUser');
        if (!saved) return MOCK_USER;
        const parsed = JSON.parse(saved);
        if (!parsed.location || !isNumeric(parsed.location.lat) || !isNumeric(parsed.location.lng)) {
            parsed.location = MOCK_USER.location;
        }
        return parsed;
    } catch (e) {
        return MOCK_USER;
    }
  });
  
  const [role, setRole] = useState<UserRole>(() => {
    try {
        const savedRole = sessionStorage.getItem('currentRole');
        return (savedRole as UserRole) || UserRole.USER;
    } catch (e) {
        return UserRole.USER;
    }
  });

  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
      const saved = sessionStorage.getItem('user_addresses');
      if (saved) return JSON.parse(saved);
      return [
        { id: '1', tag: '家', address: '上海市徐汇区天钥桥路', detail: '333 号 602室', name: '李', gender: '女士', phone: '138****8000', isDefault: true },
        { id: '2', tag: '公司', address: '上海市静安区静安寺', detail: '88 号', name: '李', gender: '女士', phone: '138****8000', isDefault: false }
      ];
  });

  const [orders, setOrders] = useState<any[]>(() => {
    try {
        const savedOrders = sessionStorage.getItem('orders');
        if (savedOrders) return JSON.parse(savedOrders);
        return INITIAL_MOCK_ORDERS;
    } catch (e) {
        return INITIAL_MOCK_ORDERS;
    }
  });

  const [messages, setMessages] = useState<AppNotification[]>([
      { id: 'm1', type: 'SYSTEM', title: '欢迎来到安电通', content: '开启您的社区智慧电力生活，现在完成首单即领1000积分！', time: Date.now() - 3600000, read: false },
      { id: 'm2', type: 'PROMO', title: '冬季取暖特惠', content: '社区拼团电热毯低至49元起，点击查看详情。', time: Date.now() - 86400000, read: true }
  ]);

  useEffect(() => {
    sessionStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
      sessionStorage.setItem('user_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const login = (phone: string, selectedRole: UserRole) => {
    const user = selectedRole === UserRole.ELECTRICIAN ? MOCK_ELEC : MOCK_USER;
    const userWithRole = { ...user, role: selectedRole };
    setCurrentUser(userWithRole);
    setRole(selectedRole);
    sessionStorage.setItem('currentUser', JSON.stringify(userWithRole));
    sessionStorage.setItem('currentRole', selectedRole);
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(UserRole.GUEST);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentRole');
    sessionStorage.removeItem('orders');
  };

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      const targetProfile = newRole === UserRole.ELECTRICIAN ? MOCK_ELEC : MOCK_USER;
      const updatedUser = { ...targetProfile, role: newRole, points: currentUser.points, isFirstPurchase: currentUser.isFirstPurchase, balance: currentUser.balance, specialIdentity: currentUser.specialIdentity };
      setCurrentUser(updatedUser);
      setRole(newRole);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      sessionStorage.setItem('currentRole', newRole);
    }
  };

  const updateSpecialIdentity = (identity: SpecialIdentity) => {
      if (currentUser) {
          const updatedUser = { ...currentUser, specialIdentity: identity };
          setCurrentUser(updatedUser);
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          setMessages(prev => [{
              id: Date.now().toString(),
              type: 'SYSTEM',
              title: '优待身份认证成功',
              content: '恭喜！您的公益优待身份已认证成功，即刻起享受专属服务折扣。',
              time: Date.now(),
              read: false
          }, ...prev]);
      }
  };

  const earnPoints = (amount: number, isFirstPurchaseBonus = false) => {
    if (currentUser) {
        const totalAdd = Math.floor(amount) + (isFirstPurchaseBonus ? 1000 : 0);
        const updatedUser = { 
            ...currentUser, 
            points: currentUser.points + totalAdd,
            isFirstPurchase: isFirstPurchaseBonus ? false : currentUser.isFirstPurchase 
        };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        setMessages(prev => [{
            id: Date.now().toString(),
            type: 'SYSTEM',
            title: '积分变动通知',
            content: `恭喜！您获得了 ${totalAdd} 积分奖励。`,
            time: Date.now(),
            read: false
        }, ...prev]);
    }
  };

  const spendPoints = (points: number) => {
    if (currentUser && currentUser.points >= points) {
        const updatedUser = { ...currentUser, points: currentUser.points - points };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            const updated = { ...o, ...updates };
            if (updates.status) {
                setMessages(m => [{
                    id: Date.now().toString(),
                    type: 'ORDER',
                    title: '订单状态更新',
                    content: `您的订单 [${o.title}] 已变更为: ${updates.status}`,
                    time: Date.now(),
                    read: false,
                    link: `/user/order/${o.id}`
                }, ...m]);
            }
            return updated;
        }
        return o;
    }));
  };

  const createOrder = (orderData: Partial<Order>) => {
    const userToUse = currentUser || MOCK_USER; 
    const newOrder: any = {
      id: `${Date.now()}`.slice(-8), 
      type: 'Repair',
      title: '安电通服务驿站 (天钥桥店)',
      description: `下单：${new Date().toLocaleDateString()}`,
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop'],
      items: [{ name: orderData.title || '常规维修', qty: 1, price: orderData.priceEstimate?.min || 50 }],
      location: userToUse.location,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      scheduledTime: '尽快',
      priceEstimate: { min: 50, max: 100 },
      clientId: userToUse.id,
      clientName: userToUse.name,
      timeline: [{ status: OrderStatus.PENDING, time: Date.now() }],
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateUserLocation = (location: Location) => {
    if (currentUser) {
        const lat = Number(location.lat);
        const lng = Number(location.lng);
        const safeLat = isNumeric(lat) ? lat : DEFAULT_COORDS.lat;
        const safeLng = isNumeric(lng) ? lng : DEFAULT_COORDS.lng;

        const updatedUser = { ...currentUser, location: { ...location, lat: safeLat, lng: safeLng } };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const markAllMessagesRead = () => {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const submitVerification = (data: any) => {
      if (currentUser) {
          const updated = { ...currentUser, identityStatus: 'PENDING' as const };
          setCurrentUser(updated);
          sessionStorage.setItem('currentUser', JSON.stringify(updated));
          
          setMessages(prev => [{
              id: Date.now().toString(),
              type: 'SYSTEM',
              title: '实名认证申请已提交',
              content: '您的实名认证申请已提交审核，预计 1-2 个工作日内完成。',
              time: Date.now(),
              read: false
          }, ...prev]);
      }
  };

  const addAddress = (addr: Omit<AddressItem, 'id'>) => {
      const newAddr = { ...addr, id: Date.now().toString() };
      setAddresses(prev => [newAddr, ...prev]);
  };

  const updateAddress = (id: string, addr: Partial<AddressItem>) => {
      setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...addr } : a));
  };

  const deleteAddress = (id: string) => {
      setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
        currentUser, role, orders, messages, addresses, login, logout, 
        switchRole, createOrder, updateOrder, updateUserLocation,
        earnPoints, spendPoints, addAddress, updateAddress, deleteAddress,
        markAllMessagesRead, submitVerification, updateSpecialIdentity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
