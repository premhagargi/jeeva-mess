"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ArrowRight, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function GuestCart() {
  const { guestCart, guest, updateGuestQuantity, removeFromGuestCart, placeGuestOrder } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [ordering, setOrdering] = useState(false);

  const itemCount = guestCart.reduce((sum, item) => sum + item.quantity, 0);
  const total = guestCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (ordering) return;
    setOrdering(true);
    const order = await placeGuestOrder();
    if (!order) {
      setOrdering(false);
      toast({ variant: "destructive", title: "Could not place order", description: "Please check your connection and try again." });
      return;
    }
    toast({ title: "Order Placed!", description: `Total ₹${order.total} — kitchen has been notified.` });
    router.push("/guest/orders");
  };

  if (guestCart.length === 0 && !ordering) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-5 sm:space-y-6 text-center px-4">
        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-secondary flex items-center justify-center border border-border">
          <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl">Empty Cart</h1>
          <p className="text-muted-foreground max-w-xs text-sm">Browse the menu to add items to your order.</p>
        </div>
        <Button asChild className="btn-primary-action px-8">
          <Link href="/guest/menu">Go to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Your Selection</p>
        <h1 className="text-2xl sm:text-[28px]">Review &amp; Order</h1>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {guestCart.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 bg-background border border-border">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-[14px] sm:text-[16px]">{item.name}</h3>
                  {item.description && (
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-1">{item.description}</p>
                  )}
                  <p className="text-xs font-bold mt-1 text-accent">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center border border-border bg-secondary shrink-0">
                  <button
                    onClick={() => updateGuestQuantity(item.id, -1)}
                    className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors active:bg-muted flex items-center justify-center"
                  >
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateGuestQuantity(item.id, 1)}
                    className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors active:bg-muted flex items-center justify-center"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => removeFromGuestCart(item.id)}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4 sm:space-y-6">
            <div className="border border-border p-4 sm:p-6 bg-secondary space-y-4 sm:space-y-6">
              <h3 className="text-sm font-bold pb-3 sm:pb-4 border-b border-border">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-bold">{itemCount}</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-border/50">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent">₹{total}</span>
                </div>
              </div>

              {guest && (
                <div className="space-y-2 pt-3 border-t border-border/50 text-xs">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="font-bold">{guest.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{guest.address}</span>
                  </div>
                </div>
              )}

              <div className="hidden md:block">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={ordering}
                  className="w-full btn-primary-action flex items-center justify-center gap-2"
                >
                  {ordering ? "Placing..." : <>Place Order · ₹{total} <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[68px] left-3 right-3 sm:left-4 sm:right-4 md:hidden z-40">
        <Button
          onClick={handlePlaceOrder}
          disabled={ordering}
          className="w-full btn-primary-action shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {ordering ? "Placing..." : <>Place Order · ₹{total} <ArrowRight className="h-5 w-5" /></>}
        </Button>
      </div>
    </div>
  );
}
