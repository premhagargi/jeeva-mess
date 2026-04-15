"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { useStore } from "@/hooks/use-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PullToRefresh } from "@/components/shared/pull-to-refresh";
import { PageLoader } from "@/components/shared/page-loader";
import { LogOut } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, authLoading, dataLoading, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for auth to resolve before redirecting
  useEffect(() => {
    if (mounted && !authLoading && !user && !isAdmin && pathname !== "/student/login") {
      router.push("/student/login");
    }
  }, [user, isAdmin, authLoading, router, pathname, mounted]);

  // Prevent back button from going past student dashboard
  useEffect(() => {
    if (!mounted || !user || pathname === "/student/login") return;
    const handlePopState = () => {
      const loc = window.location.pathname;
      if (!loc.startsWith('/student')) {
        router.replace('/student/dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mounted, user, pathname, router]);

  if (!mounted) return null;

  if (pathname === "/student/login") {
    return <>{children}</>;
  }

  // Show nothing while auth is resolving (prevents flash)
  if (authLoading || (!user && !isAdmin)) return null;

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
                <h1 className="text-lg font-bold">Jeeva Café</h1>
              </div>
              <div className="hidden md:block">
                <SidebarTrigger className="-ml-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="concierge-text text-muted-foreground text-xs">Member</p>
                <p className="text-xs font-bold">{user?.name || "Administrator"}</p>
              </div>
              <button
                onClick={async () => { await logout(); router.push("/"); }}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>
        <PullToRefresh className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-[1440px] mx-auto w-full">
          {dataLoading ? <PageLoader /> : children}
        </PullToRefresh>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}