"use client";

import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Package } from "lucide-react";
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
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="concierge-text text-accent">Operations Center</p>
          <h1 className="text-2xl font-black uppercase tracking-tight">Order Registry</h1>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-secondary px-4 py-2 border border-border">
          <Package className="h-4 w-4 text-accent" />
          <span className="text-[11px] font-black uppercase tracking-widest">{orders.length} Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-border bg-secondary/20">
            <p className="concierge-text text-muted-foreground">Queue is empty</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white border border-border p-6 space-y-5 flex flex-col group hover:border-accent transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-accent leading-none tracking-tight">{order.id}</h3>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black">{order.studentName}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Student ID: {order.studentId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">₹{order.total}</p>
                  <span className={cn(
                    "inline-block mt-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full",
                    order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                    order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="bg-secondary/60 p-4 space-y-2 border-l-4 border-accent/20">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[13px] font-bold uppercase tracking-tight">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="opacity-60">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
                {order.status === 'Pending' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => handleStatusUpdate(order.id, 'Dispatched')} 
                      className="h-11 bg-accent text-accent-foreground font-black text-[10px] tracking-widest uppercase hover:bg-accent/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Dispatch
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate(order.id, 'Cancelled')} 
                      variant="outline"
                      className="h-11 border-destructive text-destructive font-black text-[10px] tracking-widest uppercase hover:bg-destructive hover:text-white"
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 bg-secondary text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Processed {format(new Date(order.createdAt), 'hh:mm a')}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
