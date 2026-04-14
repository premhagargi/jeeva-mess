"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function StudentCart() {
  const { cart, updateQuantity, removeFromCart, placeOrder } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [ordering, setOrdering] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setOrdering(true);
    // Navigate immediately, place order in background
    toast({ title: "Order Placed!", description: "Your order has been received." });
    router.push("/student/orders");
    placeOrder();
  };

  if (cart.length === 0 && !ordering) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-5 sm:space-y-6 text-center px-4">
        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-secondary flex items-center justify-center border border-border">
          <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl">Empty Plate</h1>
          <p className="text-muted-foreground max-w-xs text-sm">Your meal selection is currently empty. Browse our menu to add items.</p>
        </div>
        <Button asChild className="btn-primary-action px-8">
          <Link href="/student/menu">Go to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Your Selection</p>
        <h1 className="text-2xl sm:text-[28px]">Shopping Plate</h1>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 bg-background border border-border group">
              {/* Mobile: stacked layout, Desktop: row layout */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-muted flex-shrink-0 border border-border overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-[14px] sm:text-[16px]">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">₹{item.price}</p>
                  <p className="font-bold text-base sm:hidden mt-1">₹{item.price * item.quantity}</p>
                </div>
                {/* Desktop price */}
                <div className="hidden sm:block w-20 text-right font-bold shrink-0">
                  ₹{item.price * item.quantity}
                </div>
              </div>
              {/* Quantity controls row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 sm:mt-0 sm:pt-0 sm:border-t-0 sm:pl-[calc(5rem+1rem)]">
                <div className="flex items-center border border-border bg-secondary">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="tap-target h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors active:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="tap-target h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors active:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs font-bold text-destructive hover:underline tap-target"
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
              <h3 className="text-sm font-bold pb-3 sm:pb-4 border-b border-border">Bill Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Item Total</span>
                  <span className="font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mess Benefits</span>
                  <span className="text-accent font-bold">Applied</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold text-base sm:text-lg">Total Amount</span>
                  <span className="font-bold text-lg sm:text-xl">₹{total}</span>
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full btn-primary-action flex items-center justify-center gap-2"
                >
                  Confirm Order <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed hidden lg:block">
              Standard mess delivery terms apply to all orders placed within the hall.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout */}
      <div className="fixed bottom-[68px] left-3 right-3 sm:left-4 sm:right-4 md:hidden z-40">
        <Button
          onClick={handlePlaceOrder}
          className="w-full btn-primary-action shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Place Order · ₹{total} <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}