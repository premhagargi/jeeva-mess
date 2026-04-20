import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocsFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  runTransaction,
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
    credits: typeof student.credits === 'number' ? student.credits : 0,
    createdAt: student.createdAt || new Date().toISOString(),
  });
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
  await updateDoc(doc(db, 'students', id), data);
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

export async function fetchOrdersFromServer(): Promise<Order[]> {
  const snap = await getDocsFromServer(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), order);
  return ref.id;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (status === 'Dispatched') {
    await dispatchOrderAndDeductCredits(orderId);
    return;
  }
  await updateDoc(doc(db, 'orders', orderId), { status });
}

// Atomic dispatch: flips status to Dispatched and deducts the order's dispatchAmount
// total from the student's credits exactly once. The `creditsDeducted` flag guards
// against double deduction if this is invoked more than once for the same order.
export async function dispatchOrderAndDeductCredits(orderId: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await runTransaction(db, async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists()) throw new Error('Order not found');
    const order = orderSnap.data() as Order;

    if (order.creditsDeducted) {
      // Idempotent: just ensure status is Dispatched and return.
      if (order.status !== 'Dispatched') tx.update(orderRef, { status: 'Dispatched' });
      return;
    }

    const totalDeduction = (order.items || []).reduce((sum, item) => {
      const per = typeof item.dispatchAmount === 'number' ? item.dispatchAmount : 0;
      return sum + per * (item.quantity || 1);
    }, 0);

    if (totalDeduction > 0 && order.studentId) {
      const studentRef = doc(db, 'students', order.studentId);
      const studentSnap = await tx.get(studentRef);
      if (studentSnap.exists()) {
        const current = studentSnap.data() as Student;
        const currentCredits = typeof current.credits === 'number' ? current.credits : 0;
        tx.update(studentRef, { credits: currentCredits - totalDeduction });
      }
    }

    tx.update(orderRef, { status: 'Dispatched', creditsDeducted: true });
  });
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
