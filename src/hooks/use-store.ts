"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, getSecondaryAuth } from '@/lib/firebase';
import {
  subscribeMenuItems,
  subscribeThaliMenu,
  saveThaliMenu,
  subscribeStudents,
  getStudentByEmail,
  addStudent as addStudentDoc,
  subscribeOrders,
  createOrder,
  updateOrderStatus as updateOrderStatusDoc,
  subscribeAdmins,
  getAdminByUid,
  addAdmin as addAdminDoc,
  subscribeDashboardConfig,
  DashboardConfig,
} from '@/lib/firestore';
import type { Order, MenuItem, Student, ThaliMenu, ThaliItem, ThaliItemType, Admin, AdminRole } from '@/lib/mock-data';

interface CartItem extends MenuItem {
  quantity: number;
}

// ─── Global state ─────────────────────────────────────────────

let globalCart: CartItem[] = [];
let globalOrders: Order[] = [];
let globalStudents: Student[] = [];
let globalMenuItems: MenuItem[] = [];
let globalThaliMenu: ThaliMenu = { lunch: [], dinner: [] };
let globalAdmins: Admin[] = [];
let globalDashboardConfig: DashboardConfig | null = null;

let currentUser: Student | null = null;
let currentAdmin: Admin | null = null;
let isAdmin = false;
let authLoading = true;
let dataLoading = true;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

// ─── Firestore initialization (runs once) ─────────────────────

let initialized = false;
const unsubscribers: (() => void)[] = [];

function initFirestoreListeners() {
  if (initialized) return;
  initialized = true;

  // Data listeners
  unsubscribers.push(
    subscribeMenuItems((items) => {
      globalMenuItems = items;
      notify();
    }),
    subscribeThaliMenu((menu) => {
      globalThaliMenu = menu;
      dataLoading = false;
      notify();
    }),
    subscribeStudents((students) => {
      globalStudents = students;
      notify();
    }),
    subscribeOrders((orders) => {
      globalOrders = orders;
      notify();
    }),
    subscribeAdmins((admins) => {
      globalAdmins = admins;
      notify();
    }),
    subscribeDashboardConfig((config) => {
      globalDashboardConfig = config;
      notify();
    })
  );

  // Auth listener
  unsubscribers.push(
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if admin
        const adminDoc = await getAdminByUid(firebaseUser.uid);
        if (adminDoc) {
          currentAdmin = adminDoc;
          isAdmin = true;
          currentUser = null;
        } else {
          // Check if student
          const student = await getStudentByEmail(firebaseUser.email || '');
          if (student) {
            currentUser = student;
            isAdmin = false;
            currentAdmin = null;
          }
        }
      } else {
        currentUser = null;
        currentAdmin = null;
        isAdmin = false;
      }
      authLoading = false;
      notify();
    })
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useStore() {
  const [state, setState] = useState({
    cart: globalCart,
    orders: globalOrders,
    students: globalStudents,
    menuItems: globalMenuItems,
    thaliMenu: globalThaliMenu,
    admins: globalAdmins,
    dashboardConfig: globalDashboardConfig,
    user: currentUser,
    admin: currentAdmin,
    isAdmin,
    authLoading,
    dataLoading,
  });

  useEffect(() => {
    initFirestoreListeners();

    const handleUpdate = () => {
      setState({
        cart: [...globalCart],
        orders: [...globalOrders],
        students: [...globalStudents],
        menuItems: [...globalMenuItems],
        thaliMenu: { ...globalThaliMenu },
        admins: [...globalAdmins],
        dashboardConfig: globalDashboardConfig,
        user: currentUser,
        admin: currentAdmin,
        isAdmin,
        authLoading,
        dataLoading,
      });
    };

    listeners.add(handleUpdate);
    // Sync immediately in case data loaded before this component mounted
    handleUpdate();
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  // ── Auth actions ──────────────────────────────────────────

  const loginAsStudent = async (serialNumber: string, password: string): Promise<boolean> => {
    const cleanId = serialNumber.replace('STU', '');
    const email = `${cleanId}@jeeva.eats`;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch {
      return false;
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const adminDoc = await getAdminByUid(cred.user.uid);
      if (!adminDoc) {
        await signOut(auth);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    globalCart = [];
    await signOut(auth);
  };

  // ── Cart actions (client-side only) ───────────────────────

  const addToCart = (item: MenuItem) => {
    const existing = globalCart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      globalCart.push({ ...item, quantity: 1 });
    }
    notify();
  };

  const removeFromCart = (id: string) => {
    globalCart = globalCart.filter((i) => i.id !== id);
    notify();
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = globalCart.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      notify();
    }
  };

  // ── Order actions ─────────────────────────────────────────

  const placeOrder = async (): Promise<Order | null> => {
    if (globalCart.length === 0 || !currentUser) return null;

    const orderData = {
      studentId: currentUser.id,
      studentName: currentUser.name,
      items: globalCart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: globalCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    const id = await createOrder(orderData);
    globalCart = [];
    notify();
    return { id, ...orderData };
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatusDoc(orderId, status);
  };

  // ── Student registration (from admin panel) ───────────────

  const registerStudent = async (student: Student): Promise<{ success: boolean; password?: string }> => {
    const exists = globalStudents.find(s => s.id === student.id);
    if (exists) return { success: false };

    // Generate random 8-char alphanumeric password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const password = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const email = `${student.id}@jeeva.eats`;

    try {
      // Create Firebase Auth user using secondary app (so admin stays logged in)
      const secondaryAuth = getSecondaryAuth();
      await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await secondaryAuth.signOut();

      // Create Firestore student doc
      await addStudentDoc({ ...student, email });

      return { success: true, password };
    } catch {
      return { success: false };
    }
  };

  // ── Thali menu actions ────────────────────────────────────

  const updateThaliItem = async (type: 'lunch' | 'dinner', itemId: string, newName: string) => {
    const items = globalThaliMenu[type];
    const updated = items.map(i => i.id === itemId ? { ...i, name: newName } : i);
    const newMenu = { ...globalThaliMenu, [type]: updated };
    await saveThaliMenu(newMenu);
  };

  const addThaliItem = async (type: 'lunch' | 'dinner', name: string, itemType: ThaliItemType = 'side') => {
    const newItem: ThaliItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: itemType,
    };
    const newMenu = {
      ...globalThaliMenu,
      [type]: [...globalThaliMenu[type], newItem],
    };
    await saveThaliMenu(newMenu);
  };

  const removeThaliItem = async (type: 'lunch' | 'dinner', itemId: string) => {
    const items = globalThaliMenu[type];
    const newMenu = {
      ...globalThaliMenu,
      [type]: items.filter(i => i.id !== itemId),
    };
    await saveThaliMenu(newMenu);
  };

  // ── Admin management ──────────────────────────────────────

  const registerAdmin = async (name: string, email: string, password: string, role: AdminRole): Promise<boolean> => {
    try {
      const secondaryAuth = getSecondaryAuth();
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await secondaryAuth.signOut();

      await addAdminDoc({
        uid: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      return true;
    } catch {
      return false;
    }
  };

  return {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
    loginAsStudent,
    loginAsAdmin,
    logout,
    updateOrderStatus,
    registerStudent,
    updateThaliItem,
    addThaliItem,
    removeThaliItem,
    registerAdmin,
  };
}
