"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThaliItemType } from "@/lib/mock-data";

export default function AdminMenuManagement() {
  const { thaliMenu, updateThaliItem, addThaliItem, removeThaliItem, updateThaliPrice } = useStore();
  const { toast } = useToast();

  const [newItemName, setNewItemName] = useState("");
  const [isAddingSide, setIsAddingSide] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const editContainerRef = useRef<HTMLDivElement | null>(null);
  const addContainerRef = useRef<HTMLDivElement | null>(null);

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setTempValue(currentName);
    setIsAddingSide(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempValue("");
  };

  const handleSaveEdit = async (type: 'lunch' | 'dinner', id: string) => {
    if (!tempValue.trim()) return;
    await updateThaliItem(type, id, tempValue);
    setEditingId(null);
    setTempValue("");
    toast({ title: "Updated", description: "Menu item saved successfully." });
  };

  const handleStartAdd = (type: 'lunch' | 'dinner') => {
    setIsAddingSide(type);
    setNewItemName("");
    setEditingId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingSide(null);
    setNewItemName("");
  };

  const handleAddSide = async (type: 'lunch' | 'dinner') => {
    if (!newItemName.trim()) return;
    await addThaliItem(type, newItemName, 'side');
    setNewItemName("");
    setIsAddingSide(null);
    toast({ title: "Side Added", description: `${newItemName} added to menu.` });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node)) {
        handleCancelEdit();
      }
      if (addContainerRef.current && !addContainerRef.current.contains(event.target as Node)) {
        handleCancelAdd();
      }
    }
    if (editingId || isAddingSide) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingId, isAddingSide]);

  const renderSection = (type: 'lunch' | 'dinner', label: string, itemType: ThaliItemType) => {
    const items = thaliMenu[type]?.filter(i => i.type === itemType) || [];
    const canAdd = ['bhaji', 'bread', 'side'].includes(itemType);
    const addKey = `${type}-${itemType}`;
    const placeholderText = itemType === 'bhaji' ? 'Add Bhaaji...' : itemType === 'bread' ? 'Add Bread...' : 'Add Side...';

    return (
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground px-1 mb-1">{label}</h3>
        <div className="divide-y divide-border/40 border border-border/40 bg-card shadow-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center px-2 sm:px-3 min-h-[44px] sm:h-11 hover:bg-secondary/5 group transition-colors relative"
              ref={editingId === item.id ? editContainerRef : null}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="relative flex-1 flex items-center">
                  <Input
                    value={editingId === item.id ? tempValue : item.name}
                    onChange={(e) => setTempValue(e.target.value)}
                    onFocus={() => handleStartEdit(item.id, item.name)}
                    className="h-8 border-transparent bg-transparent hover:bg-secondary/10 focus:bg-card focus:border-accent text-sm font-bold w-full transition-all px-2 cursor-text pr-20"
                  />
                  {editingId === item.id && (
                    <div className="absolute right-1 flex items-center gap-0.5 bg-card pl-1 shadow-[-10px_0_10px_hsl(40,30%,99%)] z-10">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-success hover:bg-success/10"
                        onClick={() => handleSaveEdit(type, item.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:bg-secondary"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  {editingId !== item.id && (
                    <div className="absolute right-1 sm:right-2 flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                        onClick={() => removeThaliItem(type, item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs font-bold text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors pointer-events-none select-none hidden sm:inline">Edit</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {canAdd && (
            <div
              className="flex items-center px-2 sm:px-3 min-h-[44px] sm:h-11 bg-secondary/20 group/add relative"
              ref={isAddingSide === addKey ? addContainerRef : null}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="relative flex-1 flex items-center">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
                  <Input
                    placeholder={placeholderText}
                    value={isAddingSide === addKey ? newItemName : ""}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onFocus={() => { setIsAddingSide(addKey); setNewItemName(""); setEditingId(null); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newItemName.trim()) {
                        addThaliItem(type, newItemName, itemType);
                        setNewItemName("");
                        setIsAddingSide(null);
                        toast({ title: "Added", description: `${newItemName} added to ${label}.` });
                      }
                    }}
                    className="h-8 border-transparent bg-transparent focus:bg-card text-xs italic px-2 w-full transition-all pr-16"
                  />
                  {isAddingSide === addKey && (
                    <div className="absolute right-0 flex items-center gap-0.5 bg-card pl-1 shadow-[-10px_0_10px_hsl(40,30%,99%)] z-10">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-success hover:bg-success/10"
                        onClick={() => {
                          if (newItemName.trim()) {
                            addThaliItem(type, newItemName, itemType);
                            setNewItemName("");
                            setIsAddingSide(null);
                            toast({ title: "Added", description: `${newItemName} added to ${label}.` });
                          }
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 sm:h-7 sm:w-7 text-muted-foreground hover:bg-secondary"
                        onClick={handleCancelAdd}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-3 sm:space-y-4 max-w-4xl mx-auto overflow-hidden">
      <header className="flex items-center justify-between shrink-0 px-1 gap-3">
        <div className="space-y-0.5 min-w-0">
          <p className="concierge-text text-accent text-xs">Operations Console</p>
          <h1 className="text-lg sm:text-xl font-bold leading-none">Menu Management</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-2 sm:px-3 py-1.5 border border-border shrink-0">
          <div className="flex items-center justify-center w-2 h-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <span className="text-xs sm:text-xs font-bold">Live Menu</span>
        </div>
      </header>

      <Tabs
        defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('menu-tab') || 'lunch') : 'lunch'}
        onValueChange={(v) => localStorage.setItem('menu-tab', v)}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="bg-secondary p-1 h-11 w-full border border-border shrink-0">
          <TabsTrigger value="lunch" className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
            Lunch Thali
          </TabsTrigger>
          <TabsTrigger value="dinner" className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
            Dinner Thali
          </TabsTrigger>
        </TabsList>

        {(['lunch', 'dinner'] as const).map((type) => (
          <TabsContent key={type} value={type} className="flex-1 m-0 pt-4 focus-visible:outline-none overflow-y-auto pb-10">
            {/* Thali Price */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm font-bold">Thali Price:</span>
              <div className="flex items-center gap-1">
                <span className="text-sm">₹</span>
                <Input
                  type="number"
                  value={type === 'lunch' ? (thaliMenu.lunchPrice ?? 80) : (thaliMenu.dinnerPrice ?? 90)}
                  onChange={(e) => updateThaliPrice(type, Number(e.target.value))}
                  className="h-8 w-20 text-sm font-bold border-primary/30"
                />
              </div>
              <span className="text-xs text-muted-foreground">per plate for students</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderSection(type, "BHAAJI", 'bhaji')}
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
