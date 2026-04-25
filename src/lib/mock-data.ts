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
  amount: number;
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
  credits: number;
  createdAt?: string;
}

export type OrderStatus = 'Pending' | 'Dispatched' | 'Cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
  // Sum of selected thali items' `amount` at the time the order was placed.
  // Deducted from the student's credits when the order is dispatched.
  dispatchAmount?: number;
  selectedThaliItems?: string[];
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  selectedThaliItems?: string[];
  creditsDeducted?: boolean;
  createdAt: string;
  // Guest ordering fields. When `isGuest` is true the order originates from a
  // walk-in customer; `studentId` carries their phone number as the identifier
  // and credits are never deducted (creditsDeducted stays false).
  isGuest?: boolean;
  guestPhone?: string;
  guestAddress?: string;
}

export interface GuestSession {
  phone: string;
  address: string;
  name?: string;
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
