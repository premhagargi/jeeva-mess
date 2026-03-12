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
import { CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Status Updated",
      description: `Order ${orderId} has been marked as ${status}.`
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Fulfillment Center</p>
        <h2 className="text-4xl font-black">Manage Orders</h2>
      </header>

      <div className="border border-border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="concierge-text h-14">Order ID</TableHead>
              <TableHead className="concierge-text h-14">Student Details</TableHead>
              <TableHead className="concierge-text h-14">Items</TableHead>
              <TableHead className="concierge-text h-14">Total</TableHead>
              <TableHead className="concierge-text h-14">Status</TableHead>
              <TableHead className="concierge-text h-14 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No orders found in the system.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-secondary transition-colors h-20">
                  <TableCell className="font-black uppercase">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{order.studentName}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{order.studentId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-xs">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="font-black">₹{order.total}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground uppercase text-[10px] font-bold tracking-widest px-3"
                            onClick={() => handleStatusUpdate(order.id, 'Dispatched')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Dispatch
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground uppercase text-[10px] font-bold tracking-widest px-3"
                            onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                        </>
                      )}
                      {order.status !== 'Pending' && (
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pr-4">
                          No actions available
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}