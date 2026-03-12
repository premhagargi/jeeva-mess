"use client";

import { useStore } from "@/hooks/use-store";
import { MENU_ITEMS, MenuCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentMenu() {
  const { addToCart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your order.`
    });
  };

  const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="concierge-text text-accent">Gourmet Selection</p>
          <h2 className="text-4xl font-black">Daily Menu</h2>
        </div>
      </header>

      <Tabs defaultValue="Breakfast" className="w-full">
        <TabsList className="bg-muted p-1 h-14 w-full md:w-auto mb-8">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat} 
              className="flex-1 md:w-40 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MENU_ITEMS.filter(item => item.category === cat).map((item) => (
                <Card key={item.id} className="group border border-border shadow-none hover:border-accent transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold uppercase tracking-tight">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full h-12 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] group-hover:bg-accent transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add to order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}