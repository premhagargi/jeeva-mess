"use client";

import { useStore } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Utensils, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', count: 45 },
  { name: 'Tue', count: 52 },
  { name: 'Wed', count: 48 },
  { name: 'Thu', count: 61 },
  { name: 'Fri', count: 55 },
  { name: 'Sat', count: 42 },
  { name: 'Sun', count: 38 },
];

export default function AdminDashboard() {
  const { orders } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-1">
        <p className="concierge-text text-accent">Kitchen Control</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Admin Overview</h2>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-[9px] sm:text-[12px]">Total Orders</CardTitle>
            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-black">{orders.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">Lifetime across system</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-[9px] sm:text-[12px]">Members</CardTitle>
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-black">124</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-[9px] sm:text-[12px]">Pending</CardTitle>
            <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-black">{pendingCount}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">Orders requiring action</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="concierge-text text-[9px] sm:text-[12px]">Revenue</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-black">₹{totalRevenue}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">Projected this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <Card className="border-border shadow-none">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="concierge-text">Order Velocity</CardTitle>
          </CardHeader>
          <CardContent className="h-60 sm:h-80 p-2 sm:p-6 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" stroke="#000" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#000" fontSize={10} fontWeight="bold" />
                <Tooltip
                  cursor={{ fill: '#F2F2F2' }}
                  contentStyle={{ backgroundColor: '#F9F8F3', border: '1px solid #E5E5E5', borderRadius: '0' }}
                />
                <Bar dataKey="count" fill="#71171F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-bold">Kitchen Quick Guide</h3>
          <div className="grid gap-3 sm:gap-4">
            <div className="border border-border p-3 sm:p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-xs sm:text-sm">Lunch Rush</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">High demand for Thali expected between 12:30 - 14:00.</p>
            </div>
            <div className="border border-border p-3 sm:p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-xs sm:text-sm">Stock Alert</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Sambar dal supply running low. Recommended reorder in 24h.</p>
            </div>
            <div className="border border-border p-3 sm:p-4 bg-secondary">
              <h4 className="font-bold uppercase tracking-tight text-xs sm:text-sm">Dinner Special</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Biryani & Chapati service begins at 19:30.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
