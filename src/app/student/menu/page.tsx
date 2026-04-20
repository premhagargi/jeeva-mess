"use client";

import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const TYPE_ORDER: Record<string, number> = { bhaji: 0, bread: 1, rice: 2, sambar: 3, side: 4 };
const TYPE_LABELS: Record<string, string> = {
  bhaji: 'Bhaaji',
  bread: 'Bread',
  rice: 'Rice',
  sambar: 'Sambar / Dal',
  side: 'Sides',
};

export default function StudentMenu() {
  const { thaliMenu, addToCart, cart } = useStore();
  const { toast } = useToast();

  // Track selected items per thali type
  const [lunchSelected, setLunchSelected] = useState<Set<string>>(new Set());
  const [dinnerSelected, setDinnerSelected] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState({ lunch: false, dinner: false });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Initialize selections with all items selected by default
  // Default selection: 2 bhaajis, 1 bread, 1 rice, 1 sambar (no sides)
  const buildDefaults = (items: typeof thaliMenu.lunch) => {
    const selected = new Set<string>();
    const byType: Record<string, string[]> = {};
    items.forEach(i => {
      if (!byType[i.type]) byType[i.type] = [];
      byType[i.type].push(i.id);
    });
    // Pick first 2 bhaajis
    (byType['bhaji'] || []).slice(0, 2).forEach(id => selected.add(id));
    // Pick first bread
    (byType['bread'] || []).slice(0, 1).forEach(id => selected.add(id));
    // Pick first rice
    (byType['rice'] || []).slice(0, 1).forEach(id => selected.add(id));
    // Pick first sambar
    (byType['sambar'] || []).slice(0, 1).forEach(id => selected.add(id));
    return selected;
  };

  const getSelections = (type: 'lunch' | 'dinner') => {
    const items = thaliMenu[type] || [];
    if (type === 'lunch') {
      if (!initialized.lunch && items.length > 0) {
        const defaults = buildDefaults(items);
        setLunchSelected(defaults);
        setInitialized(prev => ({ ...prev, lunch: true }));
        return defaults;
      }
      return lunchSelected;
    } else {
      if (!initialized.dinner && items.length > 0) {
        const defaults = buildDefaults(items);
        setDinnerSelected(defaults);
        setInitialized(prev => ({ ...prev, dinner: true }));
        return defaults;
      }
      return dinnerSelected;
    }
  };

  const toggleItem = (type: 'lunch' | 'dinner', itemId: string) => {
    const setter = type === 'lunch' ? setLunchSelected : setDinnerSelected;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleAddThali = (type: 'lunch' | 'dinner') => {
    const selected = type === 'lunch' ? lunchSelected : dinnerSelected;
    const items = (thaliMenu[type] || []).filter(i => selected.has(i.id));
    const price = type === 'lunch' ? (thaliMenu.lunchPrice ?? 80) : (thaliMenu.dinnerPrice ?? 90);

    if (items.length === 0) {
      toast({ variant: "destructive", title: "Select at least one item" });
      return;
    }

    const thaliName = `${type === 'lunch' ? 'Lunch' : 'Dinner'} Thali`;
    const description = items.map(i => i.name).join(', ');
    const dispatchAmount = items.reduce((sum, i) => sum + (typeof i.amount === 'number' ? i.amount : 0), 0);
    const selectedThaliItems = items.map(i => i.id);

    addToCart({
      id: `thali-${type}-${Date.now()}`,
      name: thaliName,
      description,
      price,
      category: type === 'lunch' ? 'Lunch' : 'Dinner',
      image: '',
      dispatchAmount,
      selectedThaliItems,
    });

    toast({
      title: `${thaliName} added`,
      description: `${items.length} items selected`,
    });
  };

  const renderThaliTab = (type: 'lunch' | 'dinner') => {
    const items = thaliMenu[type] || [];
    const selected = getSelections(type);

    // Group items by type
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
          <p className="text-sm text-muted-foreground">No {type} thali available today</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {/* Banner */}
        <Card className="border-primary/20 shadow-none bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{type === 'lunch' ? 'Lunch' : 'Dinner'} Thali</h3>
            <p className="text-sm text-muted-foreground">Tap items to add or remove from your plate</p>
          </CardContent>
        </Card>

        {/* Item groups */}
        {grouped.map(([itemType, typeItems]) => (
          <div key={itemType}>
            <h4 className="text-xs font-bold text-muted-foreground mb-2 px-1">
              {TYPE_LABELS[itemType] || itemType}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {typeItems.map(item => {
                const isSelected = selected.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(type, item.id)}
                    className={cn(
                      "p-3 sm:p-4 border rounded-lg text-left transition-all active:scale-[0.97]",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm font-medium", isSelected && "font-bold")}>
                        {item.name}
                      </span>
                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add to plate button */}
        <Button
          onClick={() => handleAddThali(type)}
          className="w-full btn-primary-action flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          Add {type === 'lunch' ? 'Lunch' : 'Dinner'} Thali to Plate
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Today's Menu</p>
        <h1 className="text-2xl sm:text-3xl md:text-[28px]">Build Your Thali</h1>
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
          {renderThaliTab('lunch')}
        </TabsContent>
        <TabsContent value="Dinner" className="space-y-3 sm:space-y-4">
          {renderThaliTab('dinner')}
        </TabsContent>
      </Tabs>

      {/* Sticky Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-[68px] md:bottom-8 left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-[1120px] mx-auto pointer-events-none">
          <Link href="/student/cart" className="pointer-events-auto">
            <div className="bg-primary text-primary-foreground p-3 sm:p-4 flex items-center justify-between shadow-lg hover:bg-accent active:bg-accent transition-colors group rounded-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary-foreground text-primary p-1.5 sm:p-2 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-80">Your Plate</p>
                  <p className="text-base sm:text-lg font-bold leading-tight">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-xs">
                View Plate <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
