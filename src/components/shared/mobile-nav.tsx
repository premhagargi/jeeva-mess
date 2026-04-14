"use client";

import { LayoutDashboard, UtensilsCrossed, ShoppingCart, History, PackageSearch, Users, Utensils, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { cart, isAdmin, admin } = useStore();
  const role = admin?.role;

  const studentLinks: { title: string; href: string; icon: any; badge?: number | null }[] = [
    { title: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Menu", href: "/student/menu", icon: UtensilsCrossed },
    { title: "Cart", href: "/student/cart", icon: ShoppingCart, badge: cart.length > 0 ? cart.length : null },
    { title: "Orders", href: "/student/orders", icon: History },
  ];

  const allAdminLinks: { title: string; href: string; icon: any; badge?: number | null; roles: string[] }[] = [
    { title: "Home", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['super_admin', 'kitchen_manager', 'order_manager'] },
    { title: "Orders", href: "/admin/orders", icon: PackageSearch, roles: ['super_admin', 'kitchen_manager', 'order_manager'] },
    { title: "Menu", href: "/admin/menu", icon: Utensils, roles: ['super_admin', 'kitchen_manager'] },
    { title: "Students", href: "/admin/students", icon: Users, roles: ['super_admin', 'kitchen_manager'] },
    { title: "Admins", href: "/admin/admins", icon: ShieldCheck, roles: ['super_admin'] },
  ];

  const adminLinks = allAdminLinks.filter(l => !role || l.roles.includes(role));

  const links = isAdmin ? adminLinks : studentLinks;

  return (
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
              {link.badge && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-xs px-1 font-bold min-w-[16px] h-[16px] flex items-center justify-center border border-background">
                  {link.badge}
                </span>
              )}
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
  );
}
