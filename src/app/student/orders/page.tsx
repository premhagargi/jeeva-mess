"use client";

import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function StudentOrders() {
  const { user, orders } = useStore();
  const studentOrders = orders.filter(o => o.studentId === user?.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Order Archive</p>
        <h2 className="text-4xl font-black">History</h2>
      </header>

      {studentOrders.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border text-muted-foreground">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {studentOrders.map((order) => (
            <div key={order.id} className="border border-border p-6 md:p-8 hover:border-accent transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black uppercase tracking-tight">{order.id}</h3>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Placed on {format(new Date(order.createdAt), 'PPP p')}</p>
                </div>
                <div className="text-right">
                  <p className="concierge-text text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-black">₹{order.total}</p>
                </div>
              </div>

              <div className="bg-secondary p-4 md:p-6">
                <p className="concierge-text text-muted-foreground mb-4">Ordered Items</p>
                <div className="grid gap-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-accent">{item.quantity}x</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}