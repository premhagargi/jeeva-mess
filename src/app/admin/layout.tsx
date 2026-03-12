"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { useStore } from "@/hooks/use-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not admin and not on the login page, redirect to login
    if (!isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdmin, router, pathname]);

  // If on the login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated and still being redirected, don't show the admin layout
  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-primary text-primary-foreground">
          <SidebarTrigger className="-ml-1 text-primary-foreground hover:text-accent transition-colors" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="concierge-text text-primary-foreground/70">Management</p>
              <p className="text-sm font-bold">Admin Console</p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
