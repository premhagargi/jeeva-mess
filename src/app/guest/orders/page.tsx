"use client";

import { useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ShoppingBag, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuestOrders() {
  const { guestOrders, refreshGuestOrders } = useStore();

  useEffect(() => {
    refreshGuestOrders();
  }, [refreshGuestOrders]);

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="concierge-text text-accent">Order Archive</p>
          <h1 className="text-2xl sm:text-[28px]">My Orders</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshGuestOrders()}
          className="h-9"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" /> Refresh
        </Button>
      </header>

      {guestOrders.length === 0 ? (
        <div className="h-[50vh] sm:h-[60vh] flex flex-col items-center justify-center space-y-4 border border-border border-dashed p-8 sm:p-12">
          <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          <p className="text-muted-foreground font-medium text-xs">No orders yet</p>
          <Button asChild size="sm" className="btn-primary-action">
            <Link href="/guest/menu">Browse Menu</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {guestOrders.map((order, idx) => (
            <div key={order.id} className="border border-border p-4 sm:p-5 md:p-6 bg-background hover:border-accent transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex items-center justify-between md:justify-start gap-3 sm:gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold">Order #{guestOrders.length - idx}</h3>
                      <p className="text-xs font-bold text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy · hh:mm a')}
                      </p>
                    </div>
                    <span className={cn(
                      "px-2.5 sm:px-3 py-1 text-xs font-bold shrink-0",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" :
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-secondary p-3 sm:p-4 space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-accent w-5 sm:w-6 shrink-0">{item.quantity}x</span>
                          <span className="text-muted-foreground truncate">{item.name}</span>
                        </div>
                        <span className="font-bold shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-border/50 text-sm">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-accent">₹{order.total}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end justify-center pt-1">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center border border-border bg-secondary">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
