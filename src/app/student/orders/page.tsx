"use client";

import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function StudentOrders() {
  const { user, orders } = useStore();
  const studentOrders = orders.filter(o => o.studentId === user?.id);

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Order Archive</p>
        <h1 className="text-2xl sm:text-[28px]">Recent Orders</h1>
      </header>

      {studentOrders.length === 0 ? (
        <div className="h-[50vh] sm:h-[60vh] flex flex-col items-center justify-center space-y-4 border border-border border-dashed p-8 sm:p-12">
          <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          <p className="text-muted-foreground font-medium text-xs">No orders found in history</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {studentOrders.map((order) => (
            <div key={order.id} className="border border-border p-4 sm:p-5 md:p-6 bg-background group hover:border-accent active:border-accent transition-all cursor-default">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-3 sm:gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold">Order #{studentOrders.length - studentOrders.indexOf(order)}</h3>
                      <p className="text-xs sm:text-xs font-bold text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy · hh:mm a')}
                      </p>
                    </div>
                    <span className={cn(
                      "px-2.5 sm:px-3 py-1 text-xs sm:text-xs font-bold shrink-0",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" :
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-secondary p-3 sm:p-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center text-xs gap-2">
                          <span className="font-bold text-accent w-5 sm:w-6 shrink-0">{item.quantity}x</span>
                          <span className="text-muted-foreground truncate">{item.name}</span>
                        </div>
                        {item.description && (
                          <p className="text-sm sm:text-base font-semibold leading-snug pl-6 sm:pl-8">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-end md:justify-center gap-4 pt-3 sm:pt-4 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center border border-border bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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