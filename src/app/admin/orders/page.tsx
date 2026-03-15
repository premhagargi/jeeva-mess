"use client";

import { useStore } from "@/hooks/use-store";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
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
      <header className="space-y-1">
        <p className="concierge-text text-accent">Fulfillment Center</p>
        <h1 className="text-[28px]">Order Registry</h1>
      </header>

      {/* Desktop View */}
      <div className="hidden lg:block border border-border">
        <Table>
          <TableHeader className="bg-secondary sticky top-0 z-10">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="concierge-text h-14">Order ID</TableHead>
              <TableHead className="concierge-text h-14">Customer</TableHead>
              <TableHead className="concierge-text h-14">Selection</TableHead>
              <TableHead className="concierge-text h-14">Value</TableHead>
              <TableHead className="concierge-text h-14">Status</TableHead>
              <TableHead className="concierge-text h-14 text-right">Fulfillment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-border h-20">
                  <TableCell className="font-black text-[14px]">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px]">{order.studentName}</span>
                      <span className="text-[10px] font-black text-muted-foreground tracking-widest">{order.studentId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate text-[14px] font-medium">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-[14px]">₹{order.total}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-black text-[10px] tracking-widest px-4"
                            onClick={() => handleStatusUpdate(order.id, 'Dispatched')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> Dispatch
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-black text-[10px] tracking-widest px-4"
                            onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                        </>
                      ) : (
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pr-4">Processed</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border p-5 space-y-4 bg-background">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-lg">{order.id}</h3>
                <p className="text-sm font-bold">{order.studentName}</p>
                <p className="text-[10px] font-black text-muted-foreground tracking-widest">{order.studentId}</p>
              </div>
              <span className={cn(
                "px-2 py-1 text-[10px] font-black uppercase tracking-widest",
                order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
              )}>
                {order.status}
              </span>
            </div>
            <div className="bg-secondary p-3 text-sm font-medium">
              {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xl font-black">₹{order.total}</p>
              {order.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatusUpdate(order.id, 'Dispatched')} className="tap-target bg-accent text-accent-foreground p-2">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleStatusUpdate(order.id, 'Cancelled')} className="tap-target bg-destructive text-destructive-foreground p-2">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}