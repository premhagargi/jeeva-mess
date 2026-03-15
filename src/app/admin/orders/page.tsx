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
import { CheckCircle, XCircle, Clock } from "lucide-react";
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
    <div className="space-y-10">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Operations Center</p>
        <h1 className="text-[28px] font-black">Order Registry</h1>
      </header>

      {/* Desktop/Tablet Operations Table */}
      <div className="hidden md:block border border-border bg-white">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="concierge-text h-14">Identity</TableHead>
              <TableHead className="concierge-text h-14">Selection</TableHead>
              <TableHead className="concierge-text h-14">Value</TableHead>
              <TableHead className="concierge-text h-14">Status</TableHead>
              <TableHead className="concierge-text h-14 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground concierge-text">
                  No active orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-border h-24 hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-accent text-sm">{order.id}</span>
                      <span className="font-bold text-[14px]">{order.studentName}</span>
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">ID: {order.studentId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="bg-secondary/50 p-2.5 border border-border">
                      <div className="max-w-[200px] truncate text-[13px] font-medium">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-lg">₹{order.total}</span>
                  </TableCell>
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
                            className="h-11 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-black text-[10px] tracking-widest px-4"
                            onClick={() => handleStatusUpdate(order.id, 'Dispatched')}
                          >
                            Dispatch
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-11 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-black text-[10px] tracking-widest px-4"
                            onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pr-4 flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Processed
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Operations List */}
      <div className="md:hidden grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-border p-6 space-y-5 bg-white group active:scale-[0.99] transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-accent leading-none">{order.id}</h3>
                <p className="text-[15px] font-bold">{order.studentName}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Student {order.studentId}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">₹{order.total}</p>
                <span className={cn(
                  "inline-block mt-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                  order.status === 'Pending' ? "bg-muted text-muted-foreground" : 
                  order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                )}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="bg-secondary p-4 text-[13px] font-bold uppercase tracking-tight leading-relaxed">
              {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
            </div>

            {order.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={() => handleStatusUpdate(order.id, 'Dispatched')} 
                  className="h-11 bg-accent text-accent-foreground font-black text-[10px] tracking-widest uppercase"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Dispatch
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(order.id, 'Cancelled')} 
                  className="h-11 bg-destructive text-destructive-foreground font-black text-[10px] tracking-widest uppercase"
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            )}
            
            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest pt-1">
              Received {format(new Date(order.createdAt), 'hh:mm a')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
