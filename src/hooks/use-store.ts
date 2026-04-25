"use client";

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth, getSecondaryAuth } from '@/lib/firebase';
import {
  subscribeMenuItems,
  subscribeThaliMenu,
  saveThaliMenu,
  subscribeStudents,
  getStudentByEmail,
  addStudent as addStudentDoc,
  updateStudent as updateStudentDoc,
  deleteStudent as deleteStudentDoc,
  subscribeOrders,
  fetchOrdersFromServer,
  fetchGuestOrdersByPhone,
  createOrder,
  updateOrderStatus as updateOrderStatusDoc,
  subscribeAdmins,
  getAdminByUid,
  addAdmin as addAdminDoc,
  subscribeDashboardConfig,
  DashboardConfig,
} from '@/lib/firestore';
import type { Order, MenuItem, Student, ThaliMenu, ThaliItem, ThaliItemType, Admin, AdminRole, GuestSession } from '@/lib/mock-data';

interface CartItem extends MenuItem {
  quantity: number;
  selectedThaliItems?: string[];
  // Sum of selected thali items' `amount` — deducted from student credits on dispatch.
  dispatchAmount?: number;
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

// ─── Guest session persistence ────────────────────────────────
// Guests don't have a Firestore /students record. Their identity (phone +
// address) lives in localStorage so they stay "logged in" across visits and
// can return to their order history. Phone is the persistent identifier.

const GUEST_KEY = 'jeeva_guest_session';
const GUEST_CART_KEY = 'jeeva_guest_cart';
const GUEST_ORDERS_KEY = 'jeeva_guest_orders'; // local cache of guest orders

function loadGuestSession(): GuestSession | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveGuestSession(g: GuestSession | null) {
  try {
    if (g) localStorage.setItem(GUEST_KEY, JSON.stringify(g));
    else localStorage.removeItem(GUEST_KEY);
  } catch {}
}
function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveGuestCart(cart: CartItem[]) {
  try { localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart)); } catch {}
}
function loadGuestOrdersCache(): Order[] {
  try {
    const raw = localStorage.getItem(GUEST_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveGuestOrdersCache(orders: Order[]) {
  try { localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders)); } catch {}
}

let globalCart: CartItem[] = typeof window !== 'undefined' ? loadCart() : [];
let globalOrders: Order[] = [];
let globalStudents: Student[] = [];
let globalMenuItems: MenuItem[] = [];
let globalThaliMenu: ThaliMenu = { lunch: [], dinner: [] };
let globalAdmins: Admin[] = [];
let globalDashboardConfig: DashboardConfig | null = null;

// Guest state — kept fully separate from student/admin state so existing
// flows are not affected. Guest cart/orders use their own localStorage keys.
let currentGuest: GuestSession | null = typeof window !== 'undefined' ? loadGuestSession() : null;
let globalGuestCart: CartItem[] = typeof window !== 'undefined' ? loadGuestCart() : [];
let globalGuestOrders: Order[] = typeof window !== 'undefined' ? loadGuestOrdersCache() : [];

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
      // Keep currentUser in sync with the latest Firestore state, but strip
      // `credits` — the student panel must not read or display credit values.
      // Credits remain in the underlying student doc for admin workflows.
      if (currentUser) {
        const fresh = students.find(s => s.id === currentUser!.id);
        if (fresh) {
          const { credits: _omit, ...rest } = fresh;
          currentUser = rest as Student;
          saveAuthCache({ user: currentUser, admin: currentAdmin, isAdmin });
        }
      }
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
          // Strip `credits` before exposing the student to the client store.
          const { credits: _omit, ...rest } = student;
          currentUser = rest as Student;
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
    guest: currentGuest,
    isGuest: !!currentGuest,
    guestCart: globalGuestCart,
    guestOrders: globalGuestOrders,
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
        const { credits: _omit, ...rest } = student;
        currentUser = rest as Student;
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

  // ── Guest auth & order actions ────────────────────────────
  // Guests have no Firestore /students record. We sign them in anonymously
  // (so Firestore rules permit order creation) and persist phone/address in
  // localStorage. Phone is the persistent identifier for their order history.

  const loginAsGuest = useCallback(async (phone: string, address: string, name?: string): Promise<boolean> => {
    const cleanPhone = (phone || '').trim();
    const cleanAddress = (address || '').trim();
    if (!cleanPhone || !cleanAddress) return false;
    // Refuse if a student/admin is currently signed in — guest mode is for
    // walk-ins only and we must not clobber an existing auth session.
    if (currentUser || currentAdmin) return false;
    try {
      // Anonymous sign-in is idempotent: reuse an existing anon user if one
      // is already active. Only sign in if there is no current Firebase user
      // or the current user is not anonymous (which shouldn't happen here
      // because of the guard above, but kept defensive).
      if (!auth.currentUser || !auth.currentUser.isAnonymous) {
        await signInAnonymously(auth);
      }
      const session: GuestSession = {
        phone: cleanPhone,
        address: cleanAddress,
        name: (name || '').trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      currentGuest = session;
      saveGuestSession(session);

      // Pull any existing orders for this phone (returning guest).
      try {
        const past = await fetchGuestOrdersByPhone(cleanPhone);
        globalGuestOrders = past;
        saveGuestOrdersCache(past);
      } catch {}
      notify();
      return true;
    } catch {
      return false;
    }
  }, []);

  const logoutGuest = useCallback(async () => {
    currentGuest = null;
    globalGuestCart = [];
    globalGuestOrders = [];
    saveGuestSession(null);
    saveGuestCart(globalGuestCart);
    saveGuestOrdersCache(globalGuestOrders);
    notify();
    // Sign out anonymous auth only if no other auth user is active.
    if (auth.currentUser?.isAnonymous) {
      try { await signOut(auth); } catch {}
    }
  }, []);

  const addToGuestCart = useCallback((item: MenuItem & { dispatchAmount?: number; selectedThaliItems?: string[] }) => {
    const existing = globalGuestCart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
      globalGuestCart = [...globalGuestCart];
    } else {
      globalGuestCart = [...globalGuestCart, { ...item, quantity: 1 }];
    }
    saveGuestCart(globalGuestCart);
    notify();
  }, []);

  const removeFromGuestCart = useCallback((id: string) => {
    globalGuestCart = globalGuestCart.filter((i) => i.id !== id);
    saveGuestCart(globalGuestCart);
    notify();
  }, []);

  const updateGuestQuantity = useCallback((id: string, delta: number) => {
    const item = globalGuestCart.find((i) => i.id === id);
    if (item) {
      const next = item.quantity + delta;
      if (next <= 0) {
        globalGuestCart = globalGuestCart.filter((i) => i.id !== id);
      } else {
        item.quantity = next;
        globalGuestCart = [...globalGuestCart];
      }
      saveGuestCart(globalGuestCart);
      notify();
    }
  }, []);

  const placeGuestOrder = useCallback(async (): Promise<Order | null> => {
    if (!currentGuest || globalGuestCart.length === 0) return null;
    // Defensive: ensure anonymous auth is in place so Firestore create succeeds.
    if (!auth.currentUser) {
      try { await signInAnonymously(auth); } catch { return null; }
    }
    const orderData: Omit<Order, 'id'> = {
      studentId: currentGuest.phone,
      studentName: currentGuest.name || `Guest (${currentGuest.phone})`,
      items: globalGuestCart.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        description: i.description,
        dispatchAmount: i.dispatchAmount ?? 0,
        selectedThaliItems: i.selectedThaliItems ?? [],
      })),
      total: globalGuestCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'Pending',
      creditsDeducted: false,
      createdAt: new Date().toISOString(),
      isGuest: true,
      guestPhone: currentGuest.phone,
      guestAddress: currentGuest.address,
    };
    // Optimistic local cache update.
    const tempId = `local-${Date.now()}`;
    const optimistic: Order = { id: tempId, ...orderData };
    globalGuestOrders = [optimistic, ...globalGuestOrders];
    saveGuestOrdersCache(globalGuestOrders);
    globalGuestCart = [];
    saveGuestCart(globalGuestCart);
    notify();

    try {
      const id = await createOrder(orderData);
      const final: Order = { id, ...orderData };
      globalGuestOrders = globalGuestOrders.map(o => o.id === tempId ? final : o);
      saveGuestOrdersCache(globalGuestOrders);
      notify();
      return final;
    } catch {
      // Roll back the optimistic order so the guest can retry.
      globalGuestOrders = globalGuestOrders.filter(o => o.id !== tempId);
      saveGuestOrdersCache(globalGuestOrders);
      notify();
      return null;
    }
  }, []);

  const refreshGuestOrders = useCallback(async () => {
    if (!currentGuest) return;
    try {
      const fresh = await fetchGuestOrdersByPhone(currentGuest.phone);
      globalGuestOrders = fresh;
      saveGuestOrdersCache(fresh);
      notify();
    } catch {}
  }, []);

  // ── Cart actions (client-side only, instant) ──────────────

  const addToCart = useCallback((item: MenuItem & { dispatchAmount?: number; selectedThaliItems?: string[] }) => {
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
      items: globalCart.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        description: i.description,
        dispatchAmount: i.dispatchAmount ?? 0,
        selectedThaliItems: i.selectedThaliItems ?? [],
      })),
      total: globalCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'Pending' as const,
      creditsDeducted: false,
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

  const refreshOrders = useCallback(async () => {
    const fresh = await fetchOrdersFromServer();
    globalOrders = fresh;
    notify();
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

  const updateStudent = useCallback(async (id: string, data: Partial<Student>): Promise<boolean> => {
    try {
      // Optimistic
      globalStudents = globalStudents.map(s => s.id === id ? { ...s, ...data } : s);
      notify();
      await updateStudentDoc(id, data);
      return true;
    } catch {
      return false;
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

  const addThaliItem = useCallback(async (type: 'lunch' | 'dinner', name: string, itemType: ThaliItemType = 'side', amount: number = 0) => {
    const newItem: ThaliItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: itemType,
      amount,
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

  const updateThaliItemAmount = useCallback(async (type: 'lunch' | 'dinner', itemId: string, amount: number) => {
    const updated = globalThaliMenu[type].map(i => i.id === itemId ? { ...i, amount } : i);
    const newMenu = { ...globalThaliMenu, [type]: updated };
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

  const updateThaliPrice = useCallback(async (type: 'lunch' | 'dinner', price: number) => {
    const key = type === 'lunch' ? 'lunchPrice' : 'dinnerPrice';
    const newMenu = { ...globalThaliMenu, [key]: price };
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
    refreshOrders,
    registerStudent,
    updateStudent,
    deleteStudent,
    updateThaliItem,
    updateThaliItemAmount,
    addThaliItem,
    removeThaliItem,
    updateThaliPrice,
    registerAdmin,
    // Guest actions
    loginAsGuest,
    logoutGuest,
    addToGuestCart,
    removeFromGuestCart,
    updateGuestQuantity,
    placeGuestOrder,
    refreshGuestOrders,
  };
}
