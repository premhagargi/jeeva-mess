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
      <SidebarInset className="pb-[68px] md:pb-0">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <h1 className="text-lg font-black uppercase tracking-tight">Jeeva Eats</h1>
              </div>
              <div className="hidden md:block">
                <SidebarTrigger className="-ml-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="concierge-text text-muted-foreground text-[9px]">Member</p>
                <p className="text-xs font-bold hidden sm:block">{user?.name || "Administrator"}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-[1440px] mx-auto w-full">
          {children}
        </div>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}