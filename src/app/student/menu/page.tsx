"use client";

import { useStore } from "@/hooks/use-store";
import { MENU_ITEMS, MenuCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function StudentMenu() {
  const { addToCart, cart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added.`
    });
  };

  const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner'];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Gourmet Selection</p>
        <h1 className="text-3xl md:text-[28px]">Today's Menu</h1>
      </header>

      <Tabs defaultValue="Breakfast" className="w-full">
        <TabsList className="bg-secondary p-1 h-12 w-full md:w-auto mb-8 border border-border">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat} 
              className="flex-1 md:w-32 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-4">
            {MENU_ITEMS.filter(item => item.category === cat).map((item) => (
              <Card key={item.id} className="border-border shadow-none overflow-hidden group hover:border-accent transition-colors">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 sm:h-auto bg-muted flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h2 className="text-xl">{item.name}</h2>
                        <span className="font-black text-lg">₹{item.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className="btn-primary-action h-11 px-6 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add to Plate
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Sticky Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 z-40 max-w-[1120px] mx-auto pointer-events-none">
          <Link href="/student/cart" className="pointer-events-auto">
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shadow-lg hover:bg-accent transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-primary-foreground text-primary p-2 h-10 w-10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{cartCount} Items Added</p>
                  <p className="text-lg font-black leading-tight">₹{cartTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                View Plate <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}