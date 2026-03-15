"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { useStore } from "@/hooks/use-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdmin, router, pathname, mounted]);

  if (!mounted) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset className="pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-primary text-primary-foreground">
          <div className="layout-container w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <h1 className="text-xl font-black text-primary-foreground">Jeeva Admin</h1>
              </div>
              <div className="hidden md:block">
                <SidebarTrigger className="-ml-1 text-primary-foreground hover:text-accent transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="concierge-text text-primary-foreground/70">Management</p>
                <p className="text-sm font-bold">Admin Console</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-background layout-container py-6 px-4 md:py-10">
          {children}
        </div>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
