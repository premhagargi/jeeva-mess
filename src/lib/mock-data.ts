export type MenuCategory = 'Lunch' | 'Dinner';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
}

export interface ThaliItem {
  id: string;
  name: string;
  isCore?: boolean;
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
    { id: 'l1', name: 'Aloo Methi', isCore: true },
    { id: 'l2', name: 'Dal Fry', isCore: true },
    { id: 'l3', name: 'Steamed Rice', isCore: true },
    { id: 'l4', name: 'Hot Sambar', isCore: true },
    { id: 'l5', name: 'Chapati (2x)', isCore: false },
    { id: 'l6', name: 'Onion & Lemon', isCore: false },
    { id: 'l7', name: 'Mango Pickle', isCore: false },
  ],
  dinner: [
    { id: 'd1', name: 'Mixed Veg Kurma', isCore: true },
    { id: 'd2', name: 'Baingan Bharta', isCore: true },
    { id: 'd3', name: 'Jeera Rice', isCore: true },
    { id: 'd4', name: 'Hot Sambar', isCore: true },
    { id: 'd5', name: 'Bhakri (1x)', isCore: false },
    { id: 'd6', name: 'Carrot Salad', isCore: false },
    { id: 'd7', name: 'Thecha', isCore: false },
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
