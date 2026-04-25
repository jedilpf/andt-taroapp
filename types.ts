

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ELECTRICIAN = 'ELECTRICIAN'
}

export enum SpecialIdentity {
  NONE = 'NONE',
  TEACHER = 'TEACHER',
  DOCTOR = 'DOCTOR',
  VETERAN = 'VETERAN',
  MARTYR_CHILD = 'MARTYR_CHILD'
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  ARRIVED = 'Arrived',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  PAID = 'Paid',
  CANCELLED = 'Cancelled'
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Added OrderItem interface to support detailed order items
export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  type: 'Repair' | 'Inspection' | 'Install' | 'Checkup' | 'Bill' | 'Fresh' | 'Product' | 'Medicine' | 'Digital' | 'Takeout' | 'Travel';
  title: string;
  description: string;
  images: string[];
  location: Location;
  status: OrderStatus;
  createdAt: number;
  scheduledTime: string;
  priceEstimate: {
    min: number;
    max: number;
    final?: number;
    breakdown?: { material: number; labor: number; trip: number };
  };
  clientId: string;
  clientName: string;
  electricianId?: string;
  electricianName?: string;
  timeline: { status: OrderStatus; time: number }[];
  pointsReward?: number;
  isFirstPurchaseReward?: boolean;
  // Added items property to Order interface to support itemized orders
  items?: OrderItem[];
}

export enum TaskStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  status: TaskStatus;
  publisherId: number;
  publisherName: string;
  publisherPhone?: string;
  address: string;
  images: string[];
  createTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar: string;
  verified: boolean;
  rating: number;
  location: Location;
  specialIdentity?: SpecialIdentity;
  identityStatus?: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  balance: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  type: 'SYSTEM' | 'ORDER' | 'PROMO';
  title: string;
  content: string;
  time: number;
  read: boolean;
  link?: string;
}