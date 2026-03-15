"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, Utensils, ListPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMenuManagement() {
  const { thaliMenu, updateThaliItem, addThaliItem, removeThaliItem } = useStore();
  const { toast } = useToast();
  
  const [newLunchItem, setNewLunchItem] = useState("");
  const [newDinnerItem, setNewDinnerItem] = useState("");

  const handleUpdate = (type: 'lunch' | 'dinner', id: string, name: string) => {
    updateThaliItem(type, id, name);
  };

  const handleAdd = (type: 'lunch' | 'dinner', name: string) => {
    if (!name.trim()) return;
    addThaliItem(type, name);
    if (type === 'lunch') setNewLunchItem("");
    else setNewDinnerItem("");
    toast({ title: "Item Added", description: `${name} added to ${type} menu.` });
  };

  const handleRemove = (type: 'lunch' | 'dinner', id: string, name: string) => {
    removeThaliItem(type, id);
    toast({ title: "Item Removed", description: `${name} removed.` });
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-5xl mx-auto">
      <header className="flex items-center justify-between shrink-0 px-1">
        <div className="space-y-0.5">
          <p className="concierge-text text-accent text-[10px]">Operations Console</p>
          <h1 className="text-xl font-black uppercase tracking-tight leading-none">Menu Management</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 border border-border">
          <div className="flex items-center justify-center w-2 h-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Live Students Menu</span>
        </div>
      </header>

      <Tabs defaultValue="lunch" className="flex-1 flex flex-col min-h-0">
        <TabsList className="bg-secondary p-1 h-11 w-full border border-border shrink-0">
          <TabsTrigger 
            value="lunch" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[11px]"
          >
            Lunch Service
          </TabsTrigger>
          <TabsTrigger 
            value="dinner" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[11px]"
          >
            Dinner Service
          </TabsTrigger>
        </TabsList>

        {(['lunch', 'dinner'] as const).map((type) => (
          <TabsContent key={type} value={type} className="flex-1 m-0 pt-4 focus-visible:outline-none overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 h-full pb-4">
              {/* Main Selection Card */}
              <Card className="border-border shadow-none flex flex-col overflow-hidden">
                <CardHeader className="py-3 px-4 bg-secondary/30 border-b border-border flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Utensils className="h-3 w-3 text-accent" /> Main Selection
                  </CardTitle>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Core Items</span>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto">
                  <div className="divide-y divide-border/40">
                    {thaliMenu[type].filter(item => item.isCore).map((item) => (
                      <div key={item.id} className="flex items-center px-4 h-12 hover:bg-secondary/10 transition-colors">
                        <Input 
                          defaultValue={item.name}
                          onBlur={(e) => handleUpdate(type, item.id, e.target.value)}
                          className="h-9 border-transparent bg-transparent hover:border-border focus:bg-white text-sm font-bold w-full transition-all px-2"
                        />
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent bg-accent/5 px-1.5 py-0.5 border border-accent/10 ml-2 shrink-0">
                          Fixed
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sides & Extras Card */}
              <Card className="border-border shadow-none flex flex-col overflow-hidden">
                <CardHeader className="py-3 px-4 bg-secondary/30 border-b border-border flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <ListPlus className="h-3 w-3 text-accent" /> Accompaniments
                  </CardTitle>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Customizable</span>
                </CardHeader>
                <CardContent className="p-0 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                    {thaliMenu[type].filter(item => !item.isCore).map((item) => (
                      <div key={item.id} className="flex items-center group px-4 h-12 hover:bg-secondary/10 transition-colors">
                        <Input 
                          defaultValue={item.name}
                          onBlur={(e) => handleUpdate(type, item.id, e.target.value)}
                          className="h-9 border-transparent bg-transparent hover:border-border focus:bg-white text-sm font-medium w-full transition-all px-2"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all ml-2"
                          onClick={() => handleRemove(type, item.id, item.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Sticky Footer Add Input */}
                  <div className="p-3 bg-secondary/20 border-t border-border mt-auto">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add side item (e.g. Papad)..."
                        value={type === 'lunch' ? newLunchItem : newDinnerItem}
                        onChange={(e) => type === 'lunch' ? setNewLunchItem(e.target.value) : setNewDinnerItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                        className="h-10 bg-white border-border text-[13px] italic px-3"
                      />
                      <Button 
                        size="icon" 
                        className="h-10 w-10 bg-primary hover:bg-accent shrink-0"
                        onClick={() => handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
