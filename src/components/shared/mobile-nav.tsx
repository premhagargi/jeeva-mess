"use client";

import { LayoutDashboard, UtensilsCrossed, ShoppingCart, History, PackageSearch, Users, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { cart, isAdmin } = useStore();

  const studentLinks = [
    { title: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Menu", href: "/student/menu", icon: UtensilsCrossed },
    { title: "Cart", href: "/student/cart", icon: ShoppingCart, badge: cart.length > 0 ? cart.length : null },
    { title: "Orders", href: "/student/orders", icon: History },
  ];

  const adminLinks = [
    { title: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Orders", href: "/admin/orders", icon: PackageSearch },
    { title: "Menu", href: "/admin/menu", icon: Utensils },
    { title: "Students", href: "/admin/students", icon: Users },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex md:hidden h-[68px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-1 sm:px-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200",
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <link.icon className={cn("h-[22px] w-[22px] transition-transform", isActive && "scale-110")} />
              {link.badge && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-[9px] px-1 font-black min-w-[16px] h-[16px] flex items-center justify-center border border-background">
                  {link.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.1em] transition-all",
              isActive ? "opacity-100 font-black" : "opacity-70"
            )}>
              {link.title}
            </span>
            {isActive && <div className="absolute top-0 w-10 h-[3px] bg-accent animate-in fade-in duration-300" />}
          </Link>
        );
      })}
    </nav>
  );
}
