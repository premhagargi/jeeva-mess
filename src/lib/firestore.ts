import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { MenuItem, ThaliMenu, ThaliItem, Student, Order, OrderStatus, Admin } from './mock-data';

// ─── Menu Items ───────────────────────────────────────────────

export function subscribeMenuItems(callback: (items: MenuItem[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'menuItems'), (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
    callback(items);
  });
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'menuItems'), item);
  return ref.id;
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>): Promise<void> {
  await updateDoc(doc(db, 'menuItems', id), data);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menuItems', id));
}

// ─── Thali Menu ───────────────────────────────────────────────

export function subscribeThaliMenu(callback: (menu: ThaliMenu) => void): Unsubscribe {
  return onSnapshot(doc(db, 'config', 'thaliMenu'), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as ThaliMenu);
    } else {
      callback({ lunch: [], dinner: [] });
    }
  });
}

export async function saveThaliMenu(menu: ThaliMenu): Promise<void> {
  await setDoc(doc(db, 'config', 'thaliMenu'), menu);
}

// ─── Students ─────────────────────────────────────────────────

export function subscribeStudents(callback: (students: Student[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'students'), (snap) => {
    const students = snap.docs.map(d => ({ ...d.data(), id: d.id } as Student));
    callback(students);
  });
}

export async function getStudentBySerial(serial: string): Promise<Student | null> {
  const snap = await getDoc(doc(db, 'students', serial));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Student) : null;
}

export async function getStudentByEmail(email: string): Promise<Student | null> {
  const q = query(collection(db, 'students'), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...d.data(), id: d.id } as Student;
}

export async function addStudent(student: Student): Promise<void> {
  await setDoc(doc(db, 'students', student.id), {
    name: student.name,
    email: student.email,
    mobile: student.mobile || '',
    createdAt: student.createdAt || new Date().toISOString(),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'students', id));
}

// ─── Orders ───────────────────────────────────────────────────

export function subscribeOrders(callback: (orders: Order[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
    (snap) => {
      const orders = snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
      callback(orders);
    }
  );
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), order);
  return ref.id;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { status });
}

// ─── Admins ───────────────────────────────────────────────────

export function subscribeAdmins(callback: (admins: Admin[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'admins'), (snap) => {
    const admins = snap.docs.map(d => ({ ...d.data(), uid: d.id } as Admin));
    callback(admins);
  });
}

export async function getAdminByUid(uid: string): Promise<Admin | null> {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists() ? ({ ...snap.data(), uid: snap.id } as Admin) : null;
}

export async function addAdmin(admin: Admin): Promise<void> {
  await setDoc(doc(db, 'admins', admin.uid), {
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt || new Date().toISOString(),
  });
}

export async function updateAdmin(uid: string, data: Partial<Admin>): Promise<void> {
  await updateDoc(doc(db, 'admins', uid), data);
}

export async function deleteAdmin(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'admins', uid));
}

// ─── Dashboard Config ─────────────────────────────────────────

export interface DashboardConfig {
  todaysSpecial: string;
  todaysSpecialSub: string;
  alerts: { title: string; message: string }[];
}

export function subscribeDashboardConfig(callback: (config: DashboardConfig | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'config', 'dashboard'), (snap) => {
    callback(snap.exists() ? (snap.data() as DashboardConfig) : null);
  });
}

export async function saveDashboardConfig(config: DashboardConfig): Promise<void> {
  await setDoc(doc(db, 'config', 'dashboard'), config);
}
