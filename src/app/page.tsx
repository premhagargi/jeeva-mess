"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Utensils, ShieldCheck, ArrowRight } from "lucide-react";
import { useStore } from "@/hooks/use-store";

export default function Home() {
  const { user, admin, isAdmin, authLoading } = useStore();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAdmin && admin) {
      setRedirecting(true);
      router.replace("/admin/dashboard");
    } else if (user) {
      setRedirecting(true);
      router.replace("/student/dashboard");
    }
  }, [user, admin, isAdmin, authLoading, router]);

  if (authLoading || redirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Jeeva Eats</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:p-6 space-y-8 sm:space-y-12">
        <header className="text-center space-y-3 sm:space-y-4">
          <p className="concierge-text text-accent">South Indian Heritage Kitchen</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold">Jeeva Eats</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Traditional flavors meets modern convenience. Premium subscription mess service for the discerning student.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-lg">
          <Link
            href="/student/login"
            className="group relative border border-border p-6 sm:p-10 md:p-12 w-full flex flex-col items-center text-center space-y-4 sm:space-y-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.98]"
          >
            <Utensils className="h-10 w-10 sm:h-12 sm:w-12 text-accent group-hover:text-primary-foreground transition-colors" />
            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Student Portal</h2>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary-foreground/70">
                Access your daily menu, manage subscriptions, and place food orders.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs">
              Sign In <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link
            href="/admin/login"
            className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-medium">Admin Portal</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <footer className="px-4 py-6 sm:p-8 border-t border-border flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center text-xs font-bold text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Jeeva Mess Co.</span>
        <div className="flex gap-4 sm:gap-8">
          <Link href="#" className="hover:text-accent">Terms</Link>
          <Link href="#" className="hover:text-accent">Privacy</Link>
          <Link href="#" className="hover:text-accent">Contact</Link>
        </div>
      </footer>
    </main>
  );
}