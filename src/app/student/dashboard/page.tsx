"use client";

import { useStore } from "@/hooks/use-store";
import { MENU_ITEMS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, CalendarDays, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const { user, orders } = useStore();
  const latestOrder = orders.find(o => o.studentId === user?.id);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Member Dashboard</p>
        <h1 className="text-2xl sm:text-[28px]">Welcome, {user?.name?.split(' ')[0]}</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Plan Status", value: "Premium Active", sub: "Until Dec 30", icon: CalendarDays },
          { label: "Usage", value: `${orders.filter(o => o.studentId === user?.id).length} Orders`, sub: "This month", icon: History },
          { label: "Today's Special", value: "South Indian Thali", sub: "Lunch Highlight", icon: UtensilsCrossed },
        ].map((stat, i) => (
          <Card key={i} className={cn("border-border shadow-none bg-secondary/50", i === 2 && "col-span-2 sm:col-span-1")}>
            <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-black leading-none">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 sm:mt-2">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl">Featured Meals</h2>
            <Link href="/student/menu" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-accent flex items-center gap-1 transition-colors">
              Full Menu <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {MENU_ITEMS.slice(0, 3).map((item) => (
              <div key={item.id} className="group border border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-primary active:border-primary transition-all cursor-default">
                <div className="h-14 w-14 sm:h-16 sm:w-16 bg-muted flex-shrink-0 border border-border">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate text-[14px] sm:text-[16px]">{item.name}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate uppercase font-bold tracking-widest">{item.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-base sm:text-lg">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl">Quick Track</h2>
          {latestOrder ? (
            <Card className="border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6 bg-secondary/30 border-b border-border flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="concierge-text text-muted-foreground">Latest Order</p>
                    <h4 className="font-black text-base sm:text-lg">{latestOrder.id}</h4>
                  </div>
                  <span className={cn(
                    "px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shrink-0",
                    latestOrder.status === 'Pending' ? "bg-muted text-muted-foreground" :
                    latestOrder.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {latestOrder.status}
                  </span>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    {latestOrder.items.slice(0, 2).map((i, idx) => (
                      <div key={idx} className="flex justify-between text-sm gap-2">
                        <span className="font-medium truncate">{i.quantity}x {i.name}</span>
                        <span className="font-bold shrink-0">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                    {latestOrder.items.length > 2 && (
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">+ {latestOrder.items.length - 2} more items</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-sm">Amount Paid</span>
                    <span className="font-black text-lg sm:text-xl">₹{latestOrder.total}</span>
                  </div>
                  <Button asChild className="w-full btn-primary-action">
                    <Link href="/student/orders">Track in Detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-10 sm:p-12 text-center border border-dashed border-border bg-secondary/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No recent meal activity</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
