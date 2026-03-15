"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { useStore } from "@/hooks/use-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user && !isAdmin && pathname !== "/student/login") {
      router.push("/student/login");
    }
  }, [user, isAdmin, router, pathname, mounted]);

  if (!mounted) return null;

  if (pathname === "/student/login") {
    return <>{children}</>;
  }

  if (!user && !isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset className="pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="layout-container w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <h1 className="text-xl font-black">Jeeva</h1>
              </div>
              <div className="hidden md:block">
                <SidebarTrigger className="-ml-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="concierge-text text-muted-foreground">Member</p>
                <p className="text-sm font-bold">{user?.name || "Administrator"}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 layout-container py-6 md:py-8">
          {children}
        </div>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}