"use client";

import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Status Updated",
      description: `Order ${orderId} is now ${status}.`
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <p className="concierge-text text-accent text-[10px]">Operations</p>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">Active Orders</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-2.5 sm:px-3 py-1.5 border border-border shrink-0">
          <Package className="h-3.5 w-3.5 text-accent" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{orders.length} Total</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {orders.length === 0 ? (
          <div className="col-span-full py-16 sm:py-20 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground text-[10px]">Queue is empty</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white border border-border p-3 sm:p-4 flex flex-col justify-between hover:border-accent transition-all active:border-accent">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-accent truncate">{order.id}</h3>
                  <p className="text-[13px] font-black truncate">{order.studentName}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {order.studentId}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black leading-none">₹{order.total}</p>
                  <span className={cn(
                    "inline-block mt-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                    order.status === 'Pending' ? "bg-muted text-muted-foreground" :
                    order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>

              {order.status === 'Pending' && (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border">
                  <Button
                    onClick={() => handleStatusUpdate(order.id, 'Dispatched')}
                    size="sm"
                    className="h-9 sm:h-8 bg-accent text-accent-foreground font-black text-[9px] tracking-widest uppercase active:scale-[0.97]"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Dispatch
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                    variant="outline"
                    size="sm"
                    className="h-9 sm:h-8 border-destructive text-destructive font-black text-[9px] tracking-widest uppercase hover:bg-destructive hover:text-white active:scale-[0.97]"
                  >
                    <XCircle className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
