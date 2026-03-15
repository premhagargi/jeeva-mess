"use client";

import { useState, useEffect } from 'react';
import { Order, MenuItem, INITIAL_ORDERS, Student, MOCK_STUDENTS, ThaliMenu, ThaliItem, INITIAL_THALI_MENU } from '@/lib/mock-data';

interface CartItem extends MenuItem {
  quantity: number;
}

// Simple singleton-like store for the prototype
let globalCart: CartItem[] = [];
let globalOrders: Order[] = INITIAL_ORDERS;
let globalStudents: Student[] = MOCK_STUDENTS;
let globalThaliMenu: ThaliMenu = INITIAL_THALI_MENU;
let currentUser: Student | null = null;
let isAdmin: boolean = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useStore() {
  const [state, setState] = useState({
    cart: globalCart,
    orders: globalOrders,
    students: globalStudents,
    thaliMenu: globalThaliMenu,
    user: currentUser,
    isAdmin: isAdmin,
  });

  useEffect(() => {
    const handleUpdate = () => {
      setState({
        cart: [...globalCart],
        orders: [...globalOrders],
        students: [...globalStudents],
        thaliMenu: { ...globalThaliMenu },
        user: currentUser,
        isAdmin: isAdmin,
      });
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const loginAsStudent = (id: string) => {
    const cleanId = id.replace('STU', '');
    const student = globalStudents.find(s => s.id === cleanId || s.id === id);
    if (student) {
      currentUser = student;
      isAdmin = false;
      notify();
      return true;
    }
    return false;
  };

  const loginAsAdmin = (user: string) => {
    if (user === 'admin') {
      currentUser = null;
      isAdmin = true;
      notify();
      return true;
    }
    return false;
  };

  const logout = () => {
    currentUser = null;
    isAdmin = false;
    globalCart = [];
    notify();
  };

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

  const placeOrder = () => {
    if (globalCart.length === 0 || !currentUser) return null;
    
    const newOrder: Order = {
      id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      items: globalCart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: globalCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    globalOrders = [newOrder, ...globalOrders];
    globalCart = [];
    notify();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = globalOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      globalOrders = [...globalOrders];
      notify();
    }
  };

  const registerStudent = (student: Student) => {
    const exists = globalStudents.find(s => s.id === student.id);
    if (exists) return false;
    
    globalStudents = [student, ...globalStudents];
    notify();
    return true;
  };

  const updateThaliItem = (type: 'lunch' | 'dinner', itemId: string, newName: string) => {
    const items = globalThaliMenu[type];
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.name = newName;
      globalThaliMenu = { ...globalThaliMenu };
      notify();
    }
  };

  const addThaliItem = (type: 'lunch' | 'dinner', name: string) => {
    const newItem: ThaliItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isCore: false
    };
    globalThaliMenu[type].push(newItem);
    globalThaliMenu = { ...globalThaliMenu };
    notify();
  };

  const removeThaliItem = (type: 'lunch' | 'dinner', itemId: string) => {
    const items = globalThaliMenu[type];
    const item = items.find(i => i.id === itemId);
    if (item && !item.isCore) {
      globalThaliMenu[type] = items.filter(i => i.id !== itemId);
      globalThaliMenu = { ...globalThaliMenu };
      notify();
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
    removeThaliItem
  };
}
