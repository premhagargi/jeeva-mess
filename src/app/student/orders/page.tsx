"use client";

import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function StudentOrders() {
  const { user, orders } = useStore();
  const studentOrders = orders.filter(o => o.studentId === user?.id);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Order Archive</p>
        <h1 className="text-[28px]">Recent Orders</h1>
      </header>

      {studentOrders.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 border border-border border-dashed p-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">No orders found in history</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {studentOrders.map((order) => (
            <div key={order.id} className="border border-border p-5 md:p-6 bg-background group hover:border-accent transition-all cursor-default">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-black">{order.id}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy · hh:mm a')}
                      </p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-secondary p-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-accent w-6">{item.quantity}x</span>
                          <span className="font-medium truncate max-w-[200px]">{item.name}</span>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="text-right">
                    <p className="concierge-text text-muted-foreground">Order Total</p>
                    <p className="text-2xl font-black">₹{order.total}</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center border border-border bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ChevronRight className="h-5 w-5" />
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