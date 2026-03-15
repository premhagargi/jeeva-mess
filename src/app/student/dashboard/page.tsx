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
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Member Dashboard</p>
        <h1 className="text-[28px]">Welcome, {user?.name?.split(' ')[0]}</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Plan Status", value: "Premium Active", sub: "Until Dec 30", icon: CalendarDays },
          { label: "Usage", value: `${orders.filter(o => o.studentId === user?.id).length} Orders`, sub: "This month", icon: History },
          { label: "Today's Special", value: "South Indian Thali", sub: "Lunch Highlight", icon: UtensilsCrossed },
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-none bg-secondary/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <p className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-black leading-none">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Featured Meals</h2>
            <Link href="/student/menu" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-accent flex items-center gap-1 transition-colors">
              Full Menu <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-4">
            {MENU_ITEMS.slice(0, 3).map((item) => (
              <div key={item.id} className="group border border-border p-4 flex items-center gap-4 hover:border-primary transition-all cursor-default">
                <div className="h-16 w-16 bg-muted flex-shrink-0 border border-border">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate text-[16px]">{item.name}</h4>
                  <p className="text-xs text-muted-foreground truncate uppercase font-bold tracking-widest">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl">Quick Track</h2>
          {latestOrder ? (
            <Card className="border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-secondary/30 border-b border-border flex justify-between items-center">
                  <div>
                    <p className="concierge-text text-muted-foreground">Latest Order</p>
                    <h4 className="font-black text-lg">{latestOrder.id}</h4>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                    latestOrder.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                    latestOrder.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {latestOrder.status}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    {latestOrder.items.slice(0, 2).map((i, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-medium">{i.quantity}x {i.name}</span>
                        <span className="font-bold">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                    {latestOrder.items.length > 2 && (
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">+ {latestOrder.items.length - 2} more items</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-sm">Amount Paid</span>
                    <span className="font-black text-xl">₹{latestOrder.total}</span>
                  </div>
                  <Button asChild className="w-full btn-primary-action">
                    <Link href="/student/orders">Track in Detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center border border-dashed border-border bg-secondary/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No recent meal activity</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
