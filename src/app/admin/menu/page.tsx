"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThaliItemType } from "@/lib/mock-data";

export default function AdminMenuManagement() {
  const { thaliMenu, updateThaliItem, addThaliItem, removeThaliItem } = useStore();
  const { toast } = useToast();
  
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  
  const editContainerRef = useRef<HTMLDivElement | null>(null);

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setTempValue(currentName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempValue("");
  };

  const handleSaveEdit = (type: 'lunch' | 'dinner', id: string) => {
    if (!tempValue.trim()) return;
    updateThaliItem(type, id, tempValue);
    setEditingId(null);
    setTempValue("");
    toast({ title: "Updated", description: "Menu item saved successfully." });
  };

  const handleAddSide = (type: 'lunch' | 'dinner') => {
    if (!newItemName.trim()) return;
    addThaliItem(type, newItemName, 'side');
    setNewItemName("");
    toast({ title: "Side Added", description: `${newItemName} added to menu.` });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node)) {
        handleCancelEdit();
      }
    }
    if (editingId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingId]);

  const renderSection = (type: 'lunch' | 'dinner', label: string, itemType: ThaliItemType) => {
    const items = thaliMenu[type].filter(i => i.type === itemType);
    const isSide = itemType === 'side';

    return (
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1 mb-1">{label}</h3>
        <div className="divide-y divide-border/40 border border-border/40 bg-white shadow-sm">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center px-3 h-11 hover:bg-secondary/5 group transition-colors relative"
              ref={editingId === item.id ? editContainerRef : null}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="relative flex-1 flex items-center">
                  <Input 
                    value={editingId === item.id ? tempValue : item.name}
                    onChange={(e) => setTempValue(e.target.value)}
                    onFocus={() => handleStartEdit(item.id, item.name)}
                    className="h-8 border-transparent bg-transparent hover:bg-secondary/10 focus:bg-white focus:border-accent text-sm font-bold w-full transition-all px-2 cursor-text pr-16"
                  />
                  {editingId === item.id && (
                    <div className="absolute right-1 flex items-center gap-0.5 bg-white pl-1 shadow-[-10px_0_10px_white] z-10">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-success hover:bg-success/10"
                        onClick={() => handleSaveEdit(type, item.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-muted-foreground hover:bg-secondary"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {editingId !== item.id && (
                    <Edit2 className="h-3.5 w-3.5 absolute right-2 opacity-20 group-hover:opacity-60 pointer-events-none transition-opacity" />
                  )}
                </div>
              </div>
              
              {isSide && !editingId && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all ml-1"
                  onClick={() => removeThaliItem(type, item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
          {isSide && (
            <div className="flex items-center px-3 h-11 bg-secondary/20">
              <Plus className="h-3.5 w-3.5 text-muted-foreground mr-2" />
              <Input 
                placeholder="Add Side..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSide(type)}
                className="h-8 border-transparent bg-transparent focus:bg-white text-xs italic px-2 w-full transition-all"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-4xl mx-auto overflow-hidden">
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
          <TabsTrigger value="lunch" className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[11px]">
            Lunch Thali
          </TabsTrigger>
          <TabsTrigger value="dinner" className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[11px]">
            Dinner Thali
          </TabsTrigger>
        </TabsList>

        {(['lunch', 'dinner'] as const).map((type) => (
          <TabsContent key={type} value={type} className="flex-1 m-0 pt-4 focus-visible:outline-none overflow-y-auto pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderSection(type, "BHAAJI (2 Slots)", 'bhaji')}
                {renderSection(type, "BREAD", 'bread')}
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {renderSection(type, "RICE", 'rice')}
                  {renderSection(type, "SAMBAR", 'sambar')}
                </div>
                {renderSection(type, "SIDES", 'side')}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
