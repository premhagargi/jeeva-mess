"use client";

import { useStore } from "@/hooks/use-store";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const TYPE_ORDER: Record<string, number> = { bhaji: 0, bread: 1, rice: 2, sambar: 3, side: 4 };
const TYPE_LABELS: Record<string, string> = {
  bhaji: 'Bhaaji',
  bread: 'Bread',
  rice: 'Rice',
  sambar: 'Sambar / Dal',
  side: 'Sides',
};

export default function GuestMenu() {
  const { thaliMenu, guestCart, addToGuestCart, updateGuestQuantity } = useStore();

  const cartCount = guestCart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = guestCart.reduce((s, i) => s + i.price * i.quantity, 0);

  const renderTab = (type: 'lunch' | 'dinner') => {
    const items = thaliMenu[type] || [];

    const grouped = useMemo(() => {
      const g: Record<string, typeof items> = {};
      items.forEach(item => {
        if (!g[item.type]) g[item.type] = [];
        g[item.type].push(item);
      });
      return Object.entries(g).sort(([a], [b]) => (TYPE_ORDER[a] ?? 99) - (TYPE_ORDER[b] ?? 99));
    }, [items]);

    if (items.length === 0) {
      return (
        <div className="p-12 text-center border border-dashed border-border bg-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">No {type} menu available today</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <Card className="border-primary/20 shadow-none bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{type === 'lunch' ? 'Lunch' : 'Dinner'} Menu</h3>
            <p className="text-sm text-muted-foreground">Pick any items and quantities — pay only for what you order.</p>
          </CardContent>
        </Card>

        {grouped.map(([itemType, typeItems]) => (
          <div key={itemType}>
            <h4 className="text-xs font-bold text-muted-foreground mb-2 px-1">
              {TYPE_LABELS[itemType] || itemType}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {typeItems.map(item => {
                const cartId = `guest-${type}-${item.id}`;
                const inCart = guestCart.find(c => c.id === cartId);
                const qty = inCart?.quantity ?? 0;
                const price = typeof item.amount === 'number' && item.amount > 0 ? item.amount : 0;

                const handleAdd = () => {
                  addToGuestCart({
                    id: cartId,
                    name: item.name,
                    description: TYPE_LABELS[item.type] || item.type,
                    price,
                    category: type === 'lunch' ? 'Lunch' : 'Dinner',
                    image: '',
                    dispatchAmount: 0,
                    selectedThaliItems: [item.id],
                  });
                };

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 sm:p-4 border rounded-lg flex items-center justify-between gap-3 transition-all",
                      qty > 0 ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {price > 0 ? `₹${price}` : "Price on request"}
                      </p>
                    </div>
                    {qty === 0 ? (
                      <button
                        onClick={handleAdd}
                        disabled={price <= 0}
                        className={cn(
                          "shrink-0 h-9 px-3 text-xs font-bold border rounded-md transition-colors",
                          price > 0
                            ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.97]"
                            : "border-border text-muted-foreground cursor-not-allowed opacity-60"
                        )}
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center border border-primary/40 bg-background shrink-0 rounded-md overflow-hidden">
                        <button
                          onClick={() => updateGuestQuantity(cartId, -1)}
                          className="h-9 w-9 hover:bg-muted transition-colors active:bg-muted flex items-center justify-center"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{qty}</span>
                        <button
                          onClick={() => updateGuestQuantity(cartId, 1)}
                          className="h-9 w-9 hover:bg-muted transition-colors active:bg-muted flex items-center justify-center"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Walk-In Menu</p>
        <h1 className="text-2xl sm:text-3xl md:text-[28px]">Order Items</h1>
      </header>

      <Tabs defaultValue="Lunch" className="w-full">
        <TabsList className="bg-secondary p-1 h-11 sm:h-12 w-full md:w-auto mb-5 sm:mb-8 border border-border">
          <TabsTrigger
            value="Lunch"
            className="flex-1 md:w-32 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm"
          >
            Lunch
          </TabsTrigger>
          <TabsTrigger
            value="Dinner"
            className="flex-1 md:w-32 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm"
          >
            Dinner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Lunch" className="space-y-3 sm:space-y-4">
          {renderTab('lunch')}
        </TabsContent>
        <TabsContent value="Dinner" className="space-y-3 sm:space-y-4">
          {renderTab('dinner')}
        </TabsContent>
      </Tabs>

      {cartCount > 0 && (
        <div className="fixed bottom-[68px] md:bottom-8 left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-[1120px] mx-auto pointer-events-none">
          <Link href="/guest/cart" className="pointer-events-auto">
            <div className="bg-primary text-primary-foreground p-3 sm:p-4 flex items-center justify-between shadow-lg hover:bg-accent active:bg-accent transition-colors group rounded-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary-foreground text-primary p-1.5 sm:p-2 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-80">Your Order</p>
                  <p className="text-base sm:text-lg font-bold leading-tight">
                    {cartCount} {cartCount === 1 ? 'Item' : 'Items'} · ₹{cartTotal}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-xs">
                Review <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
