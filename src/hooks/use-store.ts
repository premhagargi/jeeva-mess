"use client";

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, getSecondaryAuth } from '@/lib/firebase';
import {
  subscribeMenuItems,
  subscribeThaliMenu,
  saveThaliMenu,
  subscribeStudents,
  getStudentByEmail,
  addStudent as addStudentDoc,
  deleteStudent as deleteStudentDoc,
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

// ─── localStorage cache helpers ───────────────────────────────

const CACHE_KEY = 'jeeva_auth_cache';

interface AuthCache {
  user: Student | null;
  admin: Admin | null;
  isAdmin: boolean;
}

function loadAuthCache(): AuthCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveAuthCache(cache: AuthCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function clearAuthCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

// ─── Global state ─────────────────────────────────────────────

// Restore auth from cache instantly (no waiting for Firebase)
const cached = typeof window !== 'undefined' ? loadAuthCache() : null;

// Cart persistence
const CART_KEY = 'jeeva_cart';
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCart(cart: CartItem[]) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}

let globalCart: CartItem[] = typeof window !== 'undefined' ? loadCart() : [];
let globalOrders: Order[] = [];
let globalStudents: Student[] = [];
let globalMenuItems: MenuItem[] = [];
let globalThaliMenu: ThaliMenu = { lunch: [], dinner: [] };
let globalAdmins: Admin[] = [];
let globalDashboardConfig: DashboardConfig | null = null;

let currentUser: Student | null = cached?.user ?? null;
let currentAdmin: Admin | null = cached?.admin ?? null;
let isAdmin = cached?.isAdmin ?? false;
// If we have cached auth, skip the loading state entirely
let authLoading = !cached;
let dataLoading = true;

const listeners = new Set<() => void>();

// Batched notify: coalesces rapid-fire updates into one render
let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    listeners.forEach((l) => l());
  });
}

// ─── Firestore initialization (runs once) ─────────────────────

let initialized = false;
const unsubscribers: (() => void)[] = [];

function initFirestoreListeners() {
  if (initialized) return;
  initialized = true;

  // Data listeners - all fire from local cache first (instant), then sync
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
        // Check admin first (faster path for admin users)
        const [adminDoc, student] = await Promise.all([
          getAdminByUid(firebaseUser.uid),
          getStudentByEmail(firebaseUser.email || ''),
        ]);

        if (adminDoc) {
          currentAdmin = adminDoc;
          isAdmin = true;
          currentUser = null;
        } else if (student) {
          currentUser = student;
          isAdmin = false;
          currentAdmin = null;
        }

        saveAuthCache({ user: currentUser, admin: currentAdmin, isAdmin });
      } else {
        currentUser = null;
        currentAdmin = null;
        isAdmin = false;
        clearAuthCache();
      }
      authLoading = false;
      notify();
    })
  );
}

// ─── State snapshot (avoids creating new objects on every render) ──

function getSnapshot() {
  return {
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
  };
}

// ─── Hook ─────────────────────────────────────────────────────

export function useStore() {
  const [state, setState] = useState(getSnapshot);

  useEffect(() => {
    initFirestoreListeners();

    const handleUpdate = () => setState(getSnapshot());
    listeners.add(handleUpdate);
    handleUpdate();
    return () => { listeners.delete(handleUpdate); };
  }, []);

  // ── Auth actions ──────────────────────────────────────────

  const loginAsStudent = useCallback(async (serialNumber: string, password: string): Promise<boolean> => {
    const cleanId = serialNumber.replace('STU', '');
    const email = `${cleanId}@jeeva.eats`;
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Wait for user state to resolve before returning
      const student = await getStudentByEmail(cred.user.email || '');
      if (student) {
        currentUser = student;
        isAdmin = false;
        currentAdmin = null;
        saveAuthCache({ user: currentUser, admin: null, isAdmin: false });
        authLoading = false;
        notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const loginAsAdmin = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Wait for admin state to resolve before returning
      const admin = await getAdminByUid(cred.user.uid);
      if (!admin) {
        await signOut(auth);
        return false;
      }
      currentAdmin = admin;
      isAdmin = true;
      currentUser = null;
      saveAuthCache({ user: null, admin: currentAdmin, isAdmin: true });
      authLoading = false;
      notify();
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    globalCart = [];
    saveCart(globalCart);
    clearAuthCache();
    currentUser = null;
    currentAdmin = null;
    isAdmin = false;
    notify();
    await signOut(auth);
  }, []);

  // ── Cart actions (client-side only, instant) ──────────────

  const addToCart = useCallback((item: MenuItem) => {
    const existing = globalCart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
      globalCart = [...globalCart];
    } else {
      globalCart = [...globalCart, { ...item, quantity: 1 }];
    }
    saveCart(globalCart);
    notify();
  }, []);

  const removeFromCart = useCallback((id: string) => {
    globalCart = globalCart.filter((i) => i.id !== id);
    saveCart(globalCart);
    notify();
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    const item = globalCart.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      globalCart = [...globalCart];
      saveCart(globalCart);
      notify();
    }
  }, []);

  // ── Order actions (optimistic) ────────────────────────────

  const placeOrder = useCallback(async (): Promise<Order | null> => {
    if (globalCart.length === 0 || !currentUser) return null;

    const orderData = {
      studentId: currentUser.id,
      studentName: currentUser.name,
      items: globalCart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: globalCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    // Optimistic: clear cart immediately
    globalCart = [];
    saveCart(globalCart);
    notify();

    const id = await createOrder(orderData);
    return { id, ...orderData };
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    // Optimistic: update local state immediately
    const order = globalOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      globalOrders = [...globalOrders];
      notify();
    }
    await updateOrderStatusDoc(orderId, status);
  }, []);

  // ── Student registration ──────────────────────────────────

  const registerStudent = useCallback(async (student: Student): Promise<{ success: boolean; password?: string }> => {
    const exists = globalStudents.find(s => s.id === student.id);
    if (exists) return { success: false };

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const password = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const email = `${student.id}@jeeva.eats`;

    try {
      const secondaryAuth = getSecondaryAuth();
      await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await secondaryAuth.signOut();
      await addStudentDoc({ ...student, email });
      return { success: true, password };
    } catch {
      return { success: false };
    }
  }, []);

  const deleteStudent = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Optimistic
      globalStudents = globalStudents.filter(s => s.id !== id);
      notify();
      await deleteStudentDoc(id);
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── Thali menu actions (optimistic) ───────────────────────

  const updateThaliItem = useCallback(async (type: 'lunch' | 'dinner', itemId: string, newName: string) => {
    const updated = globalThaliMenu[type].map(i => i.id === itemId ? { ...i, name: newName } : i);
    const newMenu = { ...globalThaliMenu, [type]: updated };
    // Optimistic
    globalThaliMenu = newMenu;
    notify();
    await saveThaliMenu(newMenu);
  }, []);

  const addThaliItem = useCallback(async (type: 'lunch' | 'dinner', name: string, itemType: ThaliItemType = 'side') => {
    const newItem: ThaliItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: itemType,
    };
    const newMenu = {
      ...globalThaliMenu,
      [type]: [...globalThaliMenu[type], newItem],
    };
    // Optimistic
    globalThaliMenu = newMenu;
    notify();
    await saveThaliMenu(newMenu);
  }, []);

  const removeThaliItem = useCallback(async (type: 'lunch' | 'dinner', itemId: string) => {
    const newMenu = {
      ...globalThaliMenu,
      [type]: globalThaliMenu[type].filter(i => i.id !== itemId),
    };
    // Optimistic
    globalThaliMenu = newMenu;
    notify();
    await saveThaliMenu(newMenu);
  }, []);

  // ── Admin management ──────────────────────────────────────

  const registerAdmin = useCallback(async (name: string, email: string, password: string, role: AdminRole): Promise<boolean> => {
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
  }, []);

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
    deleteStudent,
    updateThaliItem,
    addThaliItem,
    removeThaliItem,
    registerAdmin,
  };
}
