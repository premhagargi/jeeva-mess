"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Utensils, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMenuManagement() {
  const { thaliMenu, updateThaliItem, addThaliItem, removeThaliItem } = useStore();
  const { toast } = useToast();
  
  const [newLunchItem, setNewLunchItem] = useState("");
  const [newDinnerItem, setNewDinnerItem] = useState("");

  const handleUpdate = (type: 'lunch' | 'dinner', id: string, name: string) => {
    updateThaliItem(type, id, name);
    // Silent update for better UX, but toast on significant actions if preferred
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="concierge-text text-accent text-[10px]">Operations</p>
          <h1 className="text-xl font-black uppercase tracking-tight">Menu Management</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 border border-border">
          <Utensils className="h-3.5 w-3.5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Menu</span>
        </div>
      </header>

      <div className="grid gap-6">
        {(['lunch', 'dinner'] as const).map((type) => (
          <Card key={type} className="border-border shadow-none overflow-hidden">
            <CardHeader className="bg-secondary/50 py-4 px-5 border-b border-border">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-between">
                <span>{type} Thali</span>
                <span className="text-[10px] font-bold text-muted-foreground">Fixed Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {thaliMenu[type].map((item) => (
                  <div key={item.id} className="flex items-center group px-5 h-12 hover:bg-secondary/20 transition-colors">
                    <div className="flex-1 flex items-center gap-3">
                      <Input 
                        defaultValue={item.name}
                        onBlur={(e) => handleUpdate(type, item.id, e.target.value)}
                        className="h-8 border-transparent bg-transparent hover:border-border focus:bg-white text-sm font-medium w-full max-w-sm transition-all"
                      />
                      {item.isCore && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent bg-accent/10 px-1.5 py-0.5 border border-accent/20">
                          Core
                        </span>
                      )}
                    </div>
                    {!item.isCore && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleRemove(type, item.id, item.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Add Item Row */}
                <div className="flex items-center px-5 h-12 bg-secondary/5">
                  <Input 
                    placeholder="Add side item..."
                    value={type === 'lunch' ? newLunchItem : newDinnerItem}
                    onChange={(e) => type === 'lunch' ? setNewLunchItem(e.target.value) : setNewDinnerItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                    className="h-8 border-dashed border-border bg-transparent text-sm italic"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-accent ml-2"
                    onClick={() => handleAdd(type, type === 'lunch' ? newLunchItem : newDinnerItem)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold pt-4">
        Changes reflect instantly across the student portal
      </p>
    </div>
  );
}
