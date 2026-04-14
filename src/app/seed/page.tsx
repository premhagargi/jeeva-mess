"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, Database, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import Link from "next/link";

const SEED_MENU_ITEMS = [
  {
    name: 'South Indian Thali',
    description: 'Rice, Sambar, Rasam, Vegetable Curry, Curd, Pickle & Papad.',
    price: 120,
    category: 'Lunch',
    image: 'https://picsum.photos/seed/thali/400/300'
  },
  {
    name: 'Chapati with Kurma',
    description: 'Two handmade wheat flatbreads with vegetable kurma.',
    price: 85,
    category: 'Dinner',
    image: 'https://picsum.photos/seed/chapati/400/300'
  },
  {
    name: 'Curd Rice Special',
    description: 'Tempered yogurt rice served with pomegranate and pickle.',
    price: 70,
    category: 'Lunch',
    image: 'https://picsum.photos/seed/curdrice/400/300'
  },
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with garden vegetables and spices.',
    price: 110,
    category: 'Dinner',
    image: 'https://picsum.photos/seed/biryani/400/300'
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling, served with chutneys.',
    price: 80,
    category: 'Lunch',
    image: 'https://picsum.photos/seed/dosa/400/300'
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich, creamy tomato gravy with butter naan.',
    price: 130,
    category: 'Dinner',
    image: 'https://picsum.photos/seed/paneer/400/300'
  },
];

const SEED_THALI_MENU = {
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

const SEED_DASHBOARD_CONFIG = {
  todaysSpecial: "South Indian Thali",
  todaysSpecialSub: "Lunch Highlight",
  alerts: [
    { title: "Lunch Rush", message: "High demand for Thali expected between 12:30 - 14:00." },
    { title: "Stock Alert", message: "Sambar dal supply running low. Recommended reorder in 24h." },
    { title: "Dinner Special", message: "Biryani & Chapati service begins at 19:30." },
  ]
};

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const runSeed = async () => {
    setStatus('running');
    setLogs([]);

    try {
      // 1. Check if already seeded
      addLog("Checking existing data...");
      const db = getFirebaseDb();
      const auth = getFirebaseAuth();
      const adminsSnap = await getDocs(collection(db, 'admins'));
      if (!adminsSnap.empty) {
        addLog("Database already has admin data. Skipping admin creation.");
      } else {
        // 2. Create default admin user in Firebase Auth
        addLog("Creating default admin account (admin@jeeva.eats)...");
        try {
          const cred = await createUserWithEmailAndPassword(auth, "admin@jeeva.eats", "admin@123");
          addLog(`Admin auth user created: ${cred.user.uid}`);

          // 3. Create admin doc in Firestore
          await setDoc(doc(db, 'admins', cred.user.uid), {
            name: "Admin",
            email: "admin@jeeva.eats",
            role: "super_admin",
            createdAt: new Date().toISOString(),
          });
          addLog("Admin Firestore document created with super_admin role.");

          // Sign out so they can log in fresh
          await signOut(auth);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            addLog("Admin auth user already exists. Skipping.");
          } else {
            throw authError;
          }
        }
      }

      // 4. Seed menu items
      addLog("Seeding menu items...");
      const menuSnap = await getDocs(collection(db, 'menuItems'));
      if (menuSnap.empty) {
        for (const item of SEED_MENU_ITEMS) {
          const ref = doc(collection(db, 'menuItems'));
          await setDoc(ref, item);
        }
        addLog(`${SEED_MENU_ITEMS.length} menu items created.`);
      } else {
        addLog(`Menu items already exist (${menuSnap.size} found). Skipping.`);
      }

      // 5. Seed thali menu
      addLog("Seeding thali menu...");
      await setDoc(doc(db, 'config', 'thaliMenu'), SEED_THALI_MENU);
      addLog("Thali menu (lunch + dinner) saved.");

      // 6. Seed dashboard config
      addLog("Seeding dashboard config...");
      await setDoc(doc(db, 'config', 'dashboard'), SEED_DASHBOARD_CONFIG);
      addLog("Dashboard config with alerts saved.");

      addLog("Seed complete! You can now log in.");
      setStatus('done');
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-secondary">
      <Card className="w-full max-w-lg border-border shadow-none">
        <CardHeader className="space-y-3 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/5 border border-accent/10">
              <Database className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Database Seed</CardTitle>
              <CardDescription className="concierge-text text-xs">Initialize Jeeva Eats with default data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="bg-secondary/50 border border-border p-4 space-y-2">
            <h4 className="text-xs font-bold">This will create:</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Default admin account: <span className="font-bold text-foreground">admin@jeeva.eats / admin@123</span></li>
              <li>{SEED_MENU_ITEMS.length} menu items (Lunch & Dinner)</li>
              <li>Thali menu with lunch and dinner components</li>
              <li>Dashboard alerts and config</li>
            </ul>
          </div>

          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className={log.startsWith('ERROR') ? 'text-red-400' : ''}>
                  &gt; {log}
                </div>
              ))}
            </div>
          )}

          {status === 'idle' && (
            <Button onClick={runSeed} className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-accent active:scale-[0.98]">
              Initialize Database
            </Button>
          )}

          {status === 'running' && (
            <Button disabled className="w-full h-12">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Seeding...
            </Button>
          )}

          {status === 'done' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-800">Database initialized successfully!</p>
                  <p className="text-xs text-green-600 mt-0.5">Login with admin@jeeva.eats / admin@123</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-11 font-bold text-xs">
                  <Link href="/admin/login">Admin Login</Link>
                </Button>
                <Button asChild className="h-11 bg-primary font-bold text-xs">
                  <Link href="/student/login">Student Login</Link>
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-800">Seed failed. Check the logs above and verify your Firebase config in .env.local</p>
              </div>
              <Button onClick={runSeed} className="w-full h-12 bg-primary font-bold">
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
