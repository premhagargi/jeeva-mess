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

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm3',
    name: 'South Indian Thali',
    description: 'Rice, Sambar, Rasam, Vegetable Curry, Curd, Pickle & Papad.',
    price: 120,
    category: 'Lunch',
    image: 'https://picsum.photos/seed/thali/400/300'
  },
  {
    id: 'm4',
    name: 'Chapati with Kurma',
    description: 'Two handmade wheat flatbreads with vegetable kurma.',
    price: 85,
    category: 'Dinner',
    image: 'https://picsum.photos/seed/chapati/400/300'
  },
  {
    id: 'm6',
    name: 'Curd Rice Special',
    description: 'Tempered yogurt rice served with pomegranate and pickle.',
    price: 70,
    category: 'Lunch',
    image: 'https://picsum.photos/seed/curdrice/400/300'
  },
  {
    id: 'm7',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with garden vegetables and spices.',
    price: 110,
    category: 'Dinner',
    image: 'https://picsum.photos/seed/biryani/400/300'
  }
];

export const INITIAL_THALI_MENU: ThaliMenu = {
  lunch: [
    { id: 'l1', name: 'Aloo Bhaji', type: 'bhaji' },
    { id: 'l2', name: 'Beans Palya', type: 'bhaji' },
    { id: 'l3', name: 'Chapati', type: 'bread' },
    { id: 'l4', name: 'Steamed Rice', type: 'rice' },
    { id: 'l5', name: 'Vegetable Sambar', type: 'sambar' },
    { id: 'l6', name: 'Onion', type: 'side' },
    { id: 'l7', name: 'Carrot', type: 'side' },
  ],
  dinner: [
    { id: 'd1', name: 'Mixed Veg Kurma', type: 'bhaji' },
    { id: 'd2', name: 'Paneer Masala', type: 'bhaji' },
    { id: 'd3', name: 'Bhakri', type: 'bread' },
    { id: 'd4', name: 'Jeera Rice', type: 'rice' },
    { id: 'd5', name: 'Dal Tadka', type: 'sambar' },
    { id: 'd6', name: 'Salad', type: 'side' },
    { id: 'd7', name: 'Thecha', type: 'side' },
  ]
};

export const MOCK_STUDENTS: Student[] = [
  { id: '101', name: 'Rahul Kumar', email: 'rahul@example.com', mobile: '9876543210', createdAt: new Date().toISOString() },
  { id: '102', name: 'Priya Sharma', email: 'priya@example.com', mobile: '9876543211', createdAt: new Date().toISOString() }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD001',
    studentId: '101',
    studentName: 'Rahul Kumar',
    items: [{ name: 'South Indian Thali', quantity: 1, price: 120 }],
    total: 120,
    status: 'Dispatched',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ORD002',
    studentId: '101',
    studentName: 'Rahul Kumar',
    items: [{ name: 'Chapati with Kurma', quantity: 1, price: 85 }],
    total: 85,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];
