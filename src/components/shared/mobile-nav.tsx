"use client";

import { LayoutDashboard, UtensilsCrossed, ShoppingCart, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { cart, isAdmin } = useStore();

  if (isAdmin) return null;

  const links = [
    { title: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Menu", href: "/student/menu", icon: UtensilsCrossed },
    { title: "Cart", href: "/student/cart", icon: ShoppingCart, badge: cart.length > 0 ? cart.length : null },
    { title: "Orders", href: "/student/orders", icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex md:hidden h-16 safe-area-bottom">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
              isActive ? "text-accent" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <link.icon className="h-5 w-5" />
              {link.badge && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-[10px] px-1 font-black min-w-[14px] text-center">
                  {link.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{link.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}