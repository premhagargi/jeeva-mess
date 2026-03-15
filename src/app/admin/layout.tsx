"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
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
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-primary text-primary-foreground px-4">
          <SidebarTrigger className="-ml-1 text-primary-foreground hover:text-accent transition-colors" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="concierge-text text-primary-foreground/70">Management</p>
              <p className="text-sm font-bold">Admin Console</p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-background layout-container py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}