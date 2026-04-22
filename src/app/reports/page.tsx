'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Item {
  item: string;
  amount: string;
}

export default function ReportsPage() {
  const [items, setItems] = useState<Item[]>([{ item: '', amount: '' }]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addRow = () => {
    setItems([...items, { item: '', amount: '' }]);
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const generateExcel = async () => {
    setIsGenerating(true);
    try {
      // Yield to the browser so the loading state actually paints before the
      // synchronous XLSX work blocks the main thread.
      await new Promise((resolve) => setTimeout(resolve, 50));

      const worksheet = XLSX.utils.json_to_sheet(items);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

      // Create buffer and download
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'items_report.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Keep the spinner up long enough to be perceivable on fast machines.
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col h-screen max-h-screen">
      <h1 className="text-2xl font-bold mb-6 shrink-0">Generate Items Report</h1>

      <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 shadow-inner">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor={`item-${index}`}>Item</Label>
                <Input
                  id={`item-${index}`}
                  value={item.item}
                  onChange={(e) => updateItem(index, 'item', e.target.value)}
                  placeholder="Enter item name"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(index, 'amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 flex flex-col gap-2 pt-4 bg-background border-t mt-4">
        <Button onClick={addRow} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Row
        </Button>

        <Button onClick={generateExcel} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Excel Sheet'
          )}
        </Button>
      </div>
    </div>
  );
}
