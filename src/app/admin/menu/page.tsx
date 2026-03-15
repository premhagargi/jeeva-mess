"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="concierge-text text-accent text-[10px]">Operations</p>
          <h1 className="text-xl font-black uppercase tracking-tight leading-none">Menu Console</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 border border-border">
          <div className="flex items-center justify-center w-2 h-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Live Kitchen</span>
        </div>
      </header>

      <Tabs defaultValue="lunch" className="w-full">
        <TabsList className="bg-secondary p-1 h-11 w-full border border-border mb-4">
          <TabsTrigger 
            value="lunch" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px]"
          >
            Lunch Thali
          </TabsTrigger>
          <TabsTrigger 
            value="dinner" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px]"
          >
            Dinner Thali
          </TabsTrigger>
        </TabsList>

        {(['lunch', 'dinner'] as const).map((type) => (
          <TabsContent key={type} value={type} className="m-0 focus-visible:outline-none">
            <Card className="border-border shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {thaliMenu[type].map((item) => (
                    <div key={item.id} className="flex items-center group px-4 h-11 hover:bg-secondary/20 transition-colors">
                      <div className="flex-1 flex items-center gap-3">
                        <Input 
                          defaultValue={item.name}
                          onBlur={(e) => handleUpdate(type, item.id, e.target.value)}
                          className="h-8 border-transparent bg-transparent hover:border-border focus:bg-white text-sm font-medium w-full max-w-md transition-all px-2"
                        />
                        {item.isCore && (
                          <span className="text-[8px] font-black uppercase tracking-widest text-accent bg-accent/10 px-1.5 py-0.5 border border-accent/20 shrink-0">
                            Core
                          </span>
                        )}
                      </div>
                      {!item.isCore && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all ml-2"
                          onClick={() => handleRemove(type, item.id, item.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Add Item Row */}
                  <div className="flex items-center px-4 h-11 bg-secondary/10">
                    <Input 
                      placeholder="Add side item..."
                      value={type === 'lunch' ? newLunchItem : newDinnerItem}
                      onChange={(e) => type === 'lunch' ? setNewLunchItem(e.target.value) : setNewDinnerItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                      className="h-8 border-dashed border-border bg-transparent text-sm italic px-2"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-accent ml-2 hover:bg-accent/10"
                      onClick={() => handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 space-y-2">
        <div className="h-px bg-border w-12 mx-auto" />
        <p className="text-[9px] text-muted-foreground text-center uppercase tracking-[0.2em] font-bold">
          Operational changes reflect instantly across the student network
        </p>
      </div>
    </div>
  );
}