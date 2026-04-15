"use client";

import { LayoutDashboard, UtensilsCrossed, ShoppingCart, History, LogOut, PackageSearch, Users, Utensils, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, admin, logout, cart } = useStore();

  const studentLinks: { title: string; href: string; icon: any; badge?: number | null }[] = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Menu", href: "/student/menu", icon: UtensilsCrossed },
    { title: "Cart", href: "/student/cart", icon: ShoppingCart, badge: cart.length > 0 ? cart.length : null },
    { title: "Orders", href: "/student/orders", icon: History },
  ];

  const role = admin?.role;

  const allAdminLinks: { title: string; href: string; icon: any; badge?: number | null; roles: string[] }[] = [
    { title: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['super_admin', 'kitchen_manager', 'order_manager'] },
    { title: "Manage Orders", href: "/admin/orders", icon: PackageSearch, roles: ['super_admin', 'kitchen_manager', 'order_manager'] },
    { title: "Manage Menu", href: "/admin/menu", icon: Utensils, roles: ['super_admin', 'kitchen_manager'] },
    { title: "Students", href: "/admin/students", icon: Users, roles: ['super_admin', 'kitchen_manager'] },
    { title: "Admin Team", href: "/admin/admins", icon: ShieldCheck, roles: ['super_admin'] },
  ];

  const adminLinks = allAdminLinks.filter(l => !role || l.roles.includes(role));

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex flex-col gap-1">
          <span className="concierge-text text-accent">Est. 2026</span>
          <h1 className="text-2xl font-bold leading-none">Jeeva Café</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="concierge-text py-4">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === link.href}
                  className={cn(
                    "h-12 transition-all duration-200",
                    pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    <span className="font-medium">{link.title}</span>
                    {link.badge && (
                      <span className="ml-auto bg-accent text-accent-foreground text-xs px-1.5 py-0.5 font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex flex-col gap-4">
          <div className="px-2">
            <p className="concierge-text text-muted-foreground">Logged in as</p>
            <p className="font-bold truncate">{isAdmin ? (admin?.name || "Administrator") : user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-bold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
