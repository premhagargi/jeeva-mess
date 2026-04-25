"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/hooks/use-store";
import { LogOut, UtensilsCrossed, ShoppingCart, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/shared/page-loader";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const { guest, isGuest, guestCart, guestOrders, dataLoading, logoutGuest, user, isAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Send logged-in students/admins back to their own area — guest mode is for
  // unauthenticated walk-ins only.
  useEffect(() => {
    if (!mounted) return;
    if (user) router.replace("/student/dashboard");
    else if (isAdmin) router.replace("/admin/dashboard");
  }, [mounted, user, isAdmin, router]);

  // No guest session → bounce to landing so they can start one.
  useEffect(() => {
    if (!mounted) return;
    if (!isGuest) router.replace("/");
  }, [mounted, isGuest, router]);

  if (!mounted || !isGuest) return null;

  const cartCount = guestCart.reduce((sum, i) => sum + i.quantity, 0);
  const hasOrders = guestOrders.length > 0;

  const links: { title: string; href: string; icon: any; badge?: number | null }[] = [
    { title: "Menu", href: "/guest/menu", icon: UtensilsCrossed },
    { title: "Cart", href: "/guest/cart", icon: ShoppingCart, badge: cartCount > 0 ? cartCount : null },
    ...(hasOrders ? [{ title: "Orders", href: "/guest/orders", icon: History, badge: guestOrders.length }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-[68px] md:pb-0">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/guest/menu" className="text-lg font-bold truncate">Jeeva Café</Link>
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-accent border border-accent px-1.5 py-0.5">Guest</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-1.5 text-sm font-bold border transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-accent hover:text-foreground"
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.title}
                  {link.badge ? (
                    <span className="ml-1 bg-accent text-accent-foreground text-[10px] px-1 font-bold min-w-[16px] h-[16px] flex items-center justify-center">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="concierge-text text-muted-foreground text-xs">Guest</p>
              <p className="text-xs font-bold truncate max-w-[140px]">{guest?.name || guest?.phone}</p>
            </div>
            <button
              onClick={async () => { await logoutGuest(); router.push("/"); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-[1440px] mx-auto w-full">
        {dataLoading ? <PageLoader /> : children}
      </main>

      {/* Mobile bottom nav — mirrors the student bottom nav so it feels familiar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex md:hidden h-[68px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-0">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 px-1",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <link.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {link.badge ? (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-xs px-1 font-bold min-w-[16px] h-[16px] flex items-center justify-center border border-background">
                    {link.badge}
                  </span>
                ) : null}
              </div>
              <span className={cn(
                "text-[10px] leading-tight font-bold transition-all truncate w-full text-center",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {link.title}
              </span>
              {isActive && <div className="absolute top-0 w-8 h-[3px] bg-accent animate-in fade-in duration-300" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
