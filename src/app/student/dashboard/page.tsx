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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Personal Dashboard</p>
        <h2 className="text-4xl font-black">Welcome, {user?.name}</h2>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Subscription</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Valid until 30 Dec 2024</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Order History</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{orders.filter(o => o.studentId === user?.id).length} Orders</div>
            <p className="text-xs text-muted-foreground mt-1">Total orders placed this month</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="concierge-text">Today's Highlight</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">Masala Dosa</div>
            <p className="text-xs text-muted-foreground mt-1">Trending today for breakfast</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Featured Today</h3>
            <Link href="/student/menu" className="text-[10px] font-bold uppercase tracking-widest hover:text-accent flex items-center gap-1">
              View Full Menu <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-4">
            {MENU_ITEMS.slice(0, 3).map((item) => (
              <div key={item.id} className="group border border-border p-4 flex items-center gap-4 hover:border-primary transition-colors">
                <div className="h-16 w-16 bg-muted flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <Card className="border-border shadow-none">
            <CardContent className="p-0">
              {latestOrder ? (
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="concierge-text text-muted-foreground">Latest Order</p>
                      <h4 className="font-black text-lg">{latestOrder.id}</h4>
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                      latestOrder.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                      latestOrder.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {latestOrder.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {latestOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{i.quantity}x {i.name}</span>
                        <span>₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center font-bold">
                    <span>Total Paid</span>
                    <span>₹{latestOrder.total}</span>
                  </div>
                  <Button asChild variant="outline" className="w-full uppercase text-[10px] font-bold tracking-widest">
                    <Link href="/student/orders">View All History</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <p className="text-sm">No recent orders found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}