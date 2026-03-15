"use client";

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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    const order = placeOrder();
    if (order) {
      toast({
        title: "Order Placed!",
        description: `Order ${order.id} has been received.`
      });
      router.push("/student/orders");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="h-24 w-24 bg-secondary flex items-center justify-center border border-border">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl">Empty Plate</h1>
          <p className="text-muted-foreground max-w-xs">Your meal selection is currently empty. Browse our menu to add items.</p>
        </div>
        <Button asChild className="btn-primary-action px-8">
          <Link href="/student/menu">Go to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Your Selection</p>
        <h1 className="text-[28px]">Shopping Plate</h1>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="p-4 bg-background border border-border flex items-center gap-4 group">
              <div className="h-20 w-20 bg-muted flex-shrink-0 border border-border overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate text-[16px]">{item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{item.price}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-border bg-secondary">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="tap-target h-10 w-10 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="tap-target h-10 w-10 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-[10px] font-bold uppercase tracking-widest text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="w-20 text-right font-black">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="border border-border p-6 bg-secondary space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest pb-4 border-b border-border">Bill Summary</h3>
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
                  <span className="font-black text-lg">Total Amount</span>
                  <span className="font-black text-xl">₹{total}</span>
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
            
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-[0.2em] px-4 leading-relaxed">
              Standard mess delivery terms apply to all orders placed within the hall.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout */}
      <div className="fixed bottom-20 left-4 right-4 md:hidden z-40">
        <Button 
          onClick={handlePlaceOrder}
          className="w-full btn-primary-action shadow-lg flex items-center justify-center gap-2"
        >
          Place Order · ₹{total} <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}