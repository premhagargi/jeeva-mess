"use client";

import { useStore } from "@/hooks/use-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, CalendarDays, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  bhaji: 'Bhaaji',
  bread: 'Bread',
  rice: 'Rice',
  sambar: 'Sambar',
  side: 'Sides',
};

export default function StudentDashboard() {
  const { user, orders, thaliMenu, dashboardConfig } = useStore();
  const latestOrder = orders.find(o => o.studentId === user?.id);
  const studentOrderCount = orders.filter(o => o.studentId === user?.id).length;

  const todaysSpecial = dashboardConfig?.todaysSpecial || "Today's Thali";
  const todaysSpecialSub = dashboardConfig?.todaysSpecialSub || "Check the menu";

  // Build thali preview from lunch items
  const lunchItems = thaliMenu.lunch || [];
  const lunchPreview = lunchItems.slice(0, 4).map(i => i.name).join(', ');

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Member Dashboard</p>
        <h1 className="text-2xl sm:text-[28px]">Welcome, {user?.name?.split(' ')[0]}</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Plan Status", value: "Active", sub: "Subscription", icon: CalendarDays },
          { label: "Usage", value: `${studentOrderCount} Orders`, sub: "This month", icon: History },
          { label: "Today's Special", value: todaysSpecial, sub: todaysSpecialSub, icon: UtensilsCrossed },
        ].map((stat, i) => (
          <Card key={i} className={cn("border-border shadow-none bg-secondary/50", i === 2 && "col-span-2 sm:col-span-1")}>
            <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <p className="text-xs sm:text-xs font-bold">{stat.label}</p>
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-bold leading-none">{stat.value}</p>
                <p className="text-xs sm:text-xs font-bold text-muted-foreground mt-1.5 sm:mt-2">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
        {/* Today's Thali */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl">Today's Thali</h2>
            <Link href="/student/menu" className="text-xs font-bold hover:text-accent flex items-center gap-1 transition-colors">
              Order Now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Lunch Thali Preview */}
          {lunchItems.length > 0 ? (
            <Card className="border-primary/20 shadow-none bg-primary/5">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Lunch Thali</h3>
                  <span className="font-bold text-primary text-lg">₹{thaliMenu.lunchPrice ?? 80}</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    lunchItems.reduce((acc, item) => {
                      if (!acc[item.type]) acc[item.type] = [];
                      acc[item.type].push(item.name);
                      return acc;
                    }, {} as Record<string, string[]>)
                  ).map(([type, names]) => (
                    <div key={type} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground font-semibold text-xs w-16 shrink-0">{TYPE_LABELS[type] || type}</span>
                      <span className="font-medium">{names.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 text-center border border-dashed border-border bg-secondary/20 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground">No menu set for today</p>
            </div>
          )}

          {/* Dinner Thali Preview */}
          {(thaliMenu.dinner || []).length > 0 && (
            <Card className="border-border shadow-none bg-secondary/30">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Dinner Thali</h3>
                  <span className="font-bold text-primary text-lg">₹{thaliMenu.dinnerPrice ?? 90}</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    (thaliMenu.dinner || []).reduce((acc, item) => {
                      if (!acc[item.type]) acc[item.type] = [];
                      acc[item.type].push(item.name);
                      return acc;
                    }, {} as Record<string, string[]>)
                  ).map(([type, names]) => (
                    <div key={type} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground font-semibold text-xs w-16 shrink-0">{TYPE_LABELS[type] || type}</span>
                      <span className="font-medium">{names.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Track */}
        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl">Quick Track</h2>
          {latestOrder ? (
            <Card className="border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6 bg-secondary/30 border-b border-border flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="concierge-text text-muted-foreground">Latest Order</p>
                    <h4 className="font-bold text-base sm:text-lg">{latestOrder.id.slice(0, 8)}</h4>
                  </div>
                  <span className={cn(
                    "px-2.5 sm:px-3 py-1 text-xs sm:text-xs font-bold shrink-0",
                    latestOrder.status === 'Pending' ? "bg-muted text-muted-foreground" :
                    latestOrder.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {latestOrder.status}
                  </span>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    {latestOrder.items.slice(0, 2).map((i, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-sm gap-2">
                          <span className="font-medium truncate">{i.quantity}x {i.name}</span>
                          <span className="font-bold shrink-0">₹{i.price * i.quantity}</span>
                        </div>
                        {i.description && (
                          <p className="text-[11px] text-muted-foreground leading-tight pl-4">{i.description}</p>
                        )}
                      </div>
                    ))}
                    {latestOrder.items.length > 2 && (
                      <p className="text-xs font-bold text-muted-foreground">+ {latestOrder.items.length - 2} more items</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-sm">Amount Paid</span>
                    <span className="font-bold text-lg sm:text-xl">₹{latestOrder.total}</span>
                  </div>
                  <Button asChild className="w-full btn-primary-action">
                    <Link href="/student/orders">Track in Detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-10 sm:p-12 text-center border border-dashed border-border bg-secondary/20 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground">No recent meal activity</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
