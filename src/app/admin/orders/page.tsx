"use client";

import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Package, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import type { OrderStatus } from "@/lib/mock-data";

const STATUSES: (OrderStatus | 'All')[] = ['All', 'Pending', 'Dispatched', 'Cancelled'];
const BATCH_SIZE = 30;

export default function AdminOrders() {
  const { orders, updateOrderStatus, refreshOrders } = useStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Auto-refresh from server on mount
  useEffect(() => {
    refreshOrders().then(() => setLastUpdated(new Date()));
  }, [refreshOrders]);

  const filteredOrders = useMemo(() => {
    if (filter === 'All') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => ({
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Dispatched: orders.filter(o => o.status === 'Dispatched').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  }), [orders]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  // IntersectionObserver: load more when sentinel comes into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setVisibleCount(prev => Math.min(prev + BATCH_SIZE, filteredOrders.length));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filteredOrders.length]);

  // Track when orders update from real-time listener
  useEffect(() => {
    setLastUpdated(new Date());
  }, [orders]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshOrders();
    setLastUpdated(new Date());
    setRefreshing(false);
    toast({ title: "Orders refreshed" });
  }, [refreshOrders, toast]);

  const handleStatusUpdate = useCallback((orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Status Updated",
      description: `Order is now ${status}.`
    });
  }, [updateOrderStatus, toast]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <p className="concierge-text text-accent text-xs">Operations</p>
          <h1 className="text-lg sm:text-xl font-bold">Active Orders</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Updated {format(lastUpdated, 'hh:mm a')}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 w-9 flex items-center justify-center border border-border bg-card hover:bg-secondary rounded-md transition-colors"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", refreshing && "animate-spin")} />
          </button>
          <div className="flex items-center gap-2 bg-secondary px-2.5 sm:px-3 py-1.5 border border-border">
            <Package className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold">{filteredOrders.length} of {orders.length}</span>
          </div>
        </div>
      </header>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1.5 text-xs font-bold border transition-all shrink-0",
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-accent hover:text-foreground"
            )}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Order grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 sm:py-20 text-center border border-dashed border-border bg-secondary/20">
          <p className="concierge-text text-muted-foreground text-xs">
            {filter === 'All' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border p-3 sm:p-4 flex flex-col justify-between hover:border-accent transition-all active:border-accent"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '0 150px' }}
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-accent truncate">{order.id.slice(0, 10)}...</h3>
                    <p className="text-[13px] font-bold truncate">{order.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold leading-none">{order.total}</p>
                    <span className={cn(
                      "inline-block mt-1.5 px-2 py-0.5 text-xs font-bold",
                      order.status === 'Pending' ? "bg-muted text-muted-foreground" :
                      order.status === 'Dispatched' ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div className="bg-secondary/50 p-2 mb-2 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground gap-2">
                        <span className="truncate">{item.quantity}x {item.name}</span>
                        <span className="font-bold shrink-0">{item.price * item.quantity}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm font-semibold leading-snug pl-4">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                {order.status === 'Pending' && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border">
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'Dispatched')}
                      size="sm"
                      className="h-9 sm:h-8 bg-accent text-accent-foreground font-bold text-xs active:scale-[0.97]"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Dispatch
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                      variant="outline"
                      size="sm"
                      className="h-9 sm:h-8 border-destructive text-destructive font-bold text-xs hover:bg-destructive hover:text-white active:scale-[0.97]"
                    >
                      <XCircle className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sentinel for infinite scroll */}
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </>
      )}
    </div>
  );
}
