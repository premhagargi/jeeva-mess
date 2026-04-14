"use client";

import { useStore } from "@/hooks/use-store";
import { MenuCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, ShoppingBag, ArrowRight, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  bhaji: 'Bhaaji',
  bread: 'Bread',
  rice: 'Rice',
  sambar: 'Sambar',
  side: 'Sides',
};

export default function StudentMenu() {
  const { addToCart, cart, menuItems, thaliMenu } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added.`
    });
  };

  const categories: MenuCategory[] = ['Lunch', 'Dinner'];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderThaliSection = (type: 'lunch' | 'dinner') => {
    const items = thaliMenu[type] || [];
    if (items.length === 0) return null;

    // Group by type
    const grouped: Record<string, string[]> = {};
    items.forEach(item => {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item.name);
    });

    return (
      <Card className="border-primary/20 shadow-none bg-primary/5 mb-6">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <UtensilsCrossed className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-primary">
              Today's {type === 'lunch' ? 'Lunch' : 'Dinner'} Thali
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {Object.entries(grouped).map(([type, names]) => (
              <div key={type} className="text-sm">
                <span className="text-muted-foreground text-xs font-semibold">{TYPE_LABELS[type] || type}: </span>
                <span className="font-medium">{names.join(', ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Gourmet Selection</p>
        <h1 className="text-2xl sm:text-3xl md:text-[28px]">Today's Menu</h1>
      </header>

      <Tabs defaultValue="Lunch" className="w-full">
        <TabsList className="bg-secondary p-1 h-11 sm:h-12 w-full md:w-auto mb-5 sm:mb-8 border border-border">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="flex-1 md:w-32 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-3 sm:space-y-4">
            {/* Today's Thali - live from admin */}
            {renderThaliSection(cat === 'Lunch' ? 'lunch' : 'dinner')}

            {menuItems.filter(item => item.category === cat).length === 0 ? (
              <div className="p-12 text-center border border-dashed border-border bg-secondary/20">
                <p className="text-xs font-bold text-muted-foreground">No {cat.toLowerCase()} items available</p>
              </div>
            ) : (
              menuItems.filter(item => item.category === cat).map((item) => (
                <Card key={item.id} className="border-border shadow-none overflow-hidden group hover:border-accent active:border-accent transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-44 md:w-48 h-40 sm:h-auto bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <h2 className="text-lg sm:text-xl">{item.name}</h2>
                          <span className="font-bold text-lg shrink-0">{item.price}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-xl">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex justify-end mt-3 sm:mt-4">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="btn-primary-action h-10 sm:h-11 px-5 sm:px-6 flex items-center gap-2 text-xs sm:text-sm active:scale-[0.97]"
                        >
                          <Plus className="h-4 w-4" /> Add to Plate
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
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
                  <p className="text-xs sm:text-xs font-bold opacity-80">{cartCount} Items Added</p>
                  <p className="text-base sm:text-lg font-bold leading-tight">{cartTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-xs">
                View Plate <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
