"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { useStore } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isAdmin) {
      router.push("/student/login");
    }
  }, [user, isAdmin, router]);

  if (!user && !isAdmin) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="concierge-text text-muted-foreground">Current Member</p>
              <p className="text-sm font-bold">{user?.name}</p>
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