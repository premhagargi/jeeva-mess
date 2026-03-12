"use client";

import Link from "next/link";
import { Utensils, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <header className="text-center space-y-4">
          <p className="concierge-text text-accent">South Indian Heritage Kitchen</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Jeeva Eats</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Traditional flavors meets modern convenience. Premium subscription mess service for the discerning student.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Link 
            href="/student/login"
            className="group relative border border-border p-12 flex flex-col items-center text-center space-y-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Utensils className="h-12 w-12 text-accent group-hover:text-primary-foreground transition-colors" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Student Portal</h2>
              <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">
                Access your daily menu, manage subscriptions, and place food orders.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
              Sign In <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link 
            href="/admin/login"
            className="group relative border border-border p-12 flex flex-col items-center text-center space-y-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ShieldCheck className="h-12 w-12 text-accent group-hover:text-primary-foreground transition-colors" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Admin Portal</h2>
              <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">
                Manage orders, monitor kitchen status, and oversee mess members.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
              Manage <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
      
      <footer className="p-8 border-t border-border flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
        <span>&copy; 2024 Jeeva Mess Co.</span>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-accent">Terms</Link>
          <Link href="#" className="hover:text-accent">Privacy</Link>
          <Link href="#" className="hover:text-accent">Contact</Link>
        </div>
      </footer>
    </main>
  );
}