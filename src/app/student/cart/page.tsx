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
        description: `Order ${order.id} has been received. Track status in History.`
      });
      router.push("/student/orders");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col items-center justify-center space-y-6">
        <div className="h-24 w-24 bg-muted flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase">Your cart is empty</h2>
          <p className="text-muted-foreground">Browse our daily menu to add items to your order.</p>
        </div>
        <Button asChild size="lg" className="uppercase font-bold tracking-widest text-[10px] h-14 px-8">
          <Link href="/student/menu">Go to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Your Selection</p>
        <h2 className="text-4xl font-black">Shopping Cart</h2>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-t border-border">
            {cart.map((item) => (
              <div key={item.id} className="py-6 border-b border-border flex items-center gap-6">
                <div className="h-24 w-24 bg-muted flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold uppercase">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{item.price} per item</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="w-24 text-right">
                  <span className="font-black">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border p-8 space-y-6 bg-secondary">
            <h3 className="text-xl font-bold uppercase tracking-widest">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mess Discount</span>
                <span className="text-accent font-bold">Included</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center text-xl font-black">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <Button 
              onClick={handlePlaceOrder}
              className="w-full h-14 uppercase font-bold tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
              Place Order <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">
              By placing order, you agree to mess terms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}