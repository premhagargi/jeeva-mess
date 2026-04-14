export type MenuCategory = 'Lunch' | 'Dinner';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
}

export type ThaliItemType = 'bhaji' | 'bread' | 'rice' | 'sambar' | 'side';

export interface ThaliItem {
  id: string;
  name: string;
  type: ThaliItemType;
}

export interface ThaliMenu {
  lunch: ThaliItem[];
  dinner: ThaliItem[];
  lunchPrice?: number;
  dinnerPrice?: number;
}

export interface Student {
  id: string; // This will be the Serial Number
  name: string;
  email: string;
  mobile?: string;
  createdAt?: string;
}

export type OrderStatus = 'Pending' | 'Dispatched' | 'Cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type AdminRole = 'super_admin' | 'kitchen_manager' | 'order_manager';

export interface Admin {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt?: string;
}
