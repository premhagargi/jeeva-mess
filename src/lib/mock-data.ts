export type MenuCategory = 'Lunch' | 'Dinner';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
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

export const MOCK_STUDENTS: Student[] = [
  { id: 'STU101', name: 'Rahul Kumar', email: 'rahul@example.com' },
  { id: 'STU102', name: 'Priya Sharma', email: 'priya@example.com' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD001',
    studentId: 'STU101',
    studentName: 'Rahul Kumar',
    items: [{ name: 'South Indian Thali', quantity: 1, price: 120 }],
    total: 120,
    status: 'Dispatched',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ORD002',
    studentId: 'STU101',
    studentName: 'Rahul Kumar',
    items: [{ name: 'Chapati with Kurma', quantity: 1, price: 85 }],
    total: 85,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];
